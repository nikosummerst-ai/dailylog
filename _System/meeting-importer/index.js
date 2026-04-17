const express = require('express');
const cron = require('node-cron');
const { Client } = require('@notionhq/client');

// --- Config ---
const PORT = process.env.PORT || 3000;
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'nikosummerst-ai/dailylog';
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN; // optional
const SLACK_USER_ID = process.env.SLACK_USER_ID || 'U09VCAUC116';
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '*/5 9-17 * * 1-5'; // every 5 min, 9am-5pm, weekdays
const LOOKBACK_MINUTES = parseInt(process.env.LOOKBACK_MINUTES || '10');

const notion = new Client({ auth: NOTION_API_KEY });

// Track processed pages to avoid duplicates (in-memory, resets on redeploy)
const processedPages = new Set();
let lastCheck = new Date();
let lastRunStatus = 'not yet run';

// --- Health check server ---
const app = express();
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    lastCheck: lastCheck.toISOString(),
    lastRunStatus,
    processedCount: processedPages.size,
    schedule: CRON_SCHEDULE
  });
});
app.listen(PORT, () => console.log(`Meeting importer listening on port ${PORT}`));

// --- Notion helpers ---

// Meeting-related keywords in titles
const MEETING_KEYWORDS = [
  'meeting', 'sync', '1:1', '1-1', 'standup', 'stand-up', 'retro',
  'retrospective', 'planning', 'review', 'catch-up', 'catchup',
  'workshop', 'session', 'call', 'check-in', 'checkin', 'huddle',
  'all-hands', 'all hands', 'weekly', 'daily', 'sprint', 'demo',
  'kickoff', 'kick-off', 'debrief', 'brainstorm'
];

function getPageTitle(page) {
  const titleProp = Object.values(page.properties || {}).find(p => p.type === 'title');
  if (!titleProp || !titleProp.title) return '';
  return titleProp.title.map(t => t.plain_text).join('');
}

function isMeetingNote(title) {
  const lower = title.toLowerCase();
  return MEETING_KEYWORDS.some(kw => lower.includes(kw));
}

async function getPageBlocks(pageId) {
  const blocks = [];
  let cursor;
  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

function blockToText(block) {
  const type = block.type;
  const data = block[type];
  if (!data) return '';

  // Handle rich text arrays
  if (data.rich_text) {
    const text = data.rich_text.map(t => t.plain_text).join('');
    switch (type) {
      case 'heading_1': return `# ${text}`;
      case 'heading_2': return `## ${text}`;
      case 'heading_3': return `### ${text}`;
      case 'bulleted_list_item': return `- ${text}`;
      case 'numbered_list_item': return `1. ${text}`;
      case 'to_do': return `- [${data.checked ? 'x' : ' '}] ${text}`;
      case 'toggle': return `> ${text}`;
      case 'quote': return `> ${text}`;
      case 'callout': return `> ${text}`;
      default: return text;
    }
  }

  if (type === 'divider') return '---';
  if (type === 'code' && data.rich_text) {
    return '```\n' + data.rich_text.map(t => t.plain_text).join('') + '\n```';
  }

  return '';
}

function blocksToMarkdown(blocks) {
  return blocks.map(blockToText).filter(Boolean).join('\n');
}

// --- Wikilink injection (no Claude needed — Notion AI already summarizes) ---
const WIKILINK_PEOPLE = [
  'Peter Yabsley', 'Megan Bryant', 'Tobias Gunkel', 'Valentina Goldie',
  'Shenyana Lim', 'Raquel Losilla', 'Alex Mortensen', 'Larry Hogan',
  'Sachin Koshe', 'Liam', 'Darrin Spiesz', 'Niko Summers', 'Niko'
];
const WIKILINK_PROJECTS = [
  'Guest Personas', 'Direct Booking Digest', 'ABM Creator', 'Help Centre Bot',
  'Automation Hub', 'Triptease Studio', 'DBSEvents', 'Guest Persona CRM Tagging',
  'Landing Page', 'HotelGEOChecker', 'Cloudprinter'
];

function injectWikilinks(text) {
  let result = text;
  // Inject project wikilinks first (longer names to avoid partial matches)
  for (const name of [...WIKILINK_PROJECTS, ...WIKILINK_PEOPLE].sort((a, b) => b.length - a.length)) {
    // Only replace if not already inside a wikilink
    const regex = new RegExp(`(?<!\\[\\[)\\b(${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b(?!\\]\\])`, 'g');
    result = result.replace(regex, '[[$1]]');
  }
  return result;
}

// --- GitHub write ---
async function writeToVault(title, content, date) {
  const dateStr = date.slice(0, 10); // YYYY-MM-DD
  const safeTitle = title.replace(/[/\\:*?"<>|]/g, '-').slice(0, 80);
  const filePath = `Meeting Notes/${dateStr} ${safeTitle}.md`;
  const encodedPath = encodeURIComponent(filePath).replace(/%2F/g, '/');

  // Check if file already exists
  const checkRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodedPath}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
  );

  if (checkRes.ok) {
    console.log(`  Already exists: ${filePath}`);
    return false; // Already exists
  }

  // Build full note with frontmatter
  const fullContent = `---
date: ${dateStr}
tags: [meeting]
area: Triptease
created: ${dateStr}
---

# ${title}

${content}
`;

  const b64 = Buffer.from(fullContent).toString('base64');

  const writeRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodedPath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `bot: import meeting note [skip deploy]`,
        content: b64,
      }),
    }
  );

  if (!writeRes.ok) {
    const err = await writeRes.text();
    console.error(`  GitHub write failed: ${writeRes.status} ${err}`);
    return false;
  }

  console.log(`  Written: ${filePath}`);
  return true;
}

// --- Slack notification ---
async function notifySlack(title, actionItems) {
  if (!SLACK_BOT_TOKEN) return;

  // Extract action items for Niko
  const nikoActions = actionItems
    ? actionItems.split('\n').filter(l => l.toLowerCase().includes('niko')).join('\n')
    : '';

  const text = `:notebook_with_decorative_cover: *Meeting imported:* ${title}${nikoActions ? `\n:point_right: ${nikoActions}` : ''}`;

  try {
    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: SLACK_USER_ID,
        text,
      }),
    });
  } catch (err) {
    console.error('Slack notification failed:', err.message);
  }
}

// --- Main poll function ---
async function pollForMeetingNotes() {
  const since = new Date(Date.now() - LOOKBACK_MINUTES * 60 * 1000).toISOString();
  console.log(`[${new Date().toISOString()}] Checking for meeting notes since ${since}`);

  try {
    // Search Notion for recently edited pages
    const results = await notion.search({
      filter: { property: 'object', value: 'page' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      page_size: 20,
    });

    // Filter for recent, unprocessed pages
    const candidates = results.results.filter(page => {
      if (processedPages.has(page.id)) return false;
      if (page.last_edited_time < since) return false;
      const title = getPageTitle(page);
      return title && isMeetingNote(title);
    });

    if (candidates.length === 0) {
      console.log('  No new meeting notes found.');
      lastRunStatus = 'ok - nothing new';
      lastCheck = new Date();
      return;
    }

    console.log(`  Found ${candidates.length} candidate(s)`);

    for (const page of candidates) {
      const title = getPageTitle(page);
      console.log(`  Processing: ${title}`);

      // Get full content
      const blocks = await getPageBlocks(page.id);
      const rawContent = blocksToMarkdown(blocks);

      if (!rawContent.trim()) {
        console.log('  Empty page, skipping');
        processedPages.add(page.id);
        continue;
      }

      // Inject wikilinks into the Notion content (Notion AI already summarized it)
      const content = injectWikilinks(rawContent);

      // Write to vault
      const written = await writeToVault(title, content, page.last_edited_time);

      // Notify Slack
      if (written) {
        await notifySlack(title, content);
      }

      processedPages.add(page.id);
    }

    lastRunStatus = `ok - processed ${candidates.length} note(s)`;
  } catch (err) {
    console.error('Poll error:', err.message);
    lastRunStatus = `error: ${err.message}`;
  }

  lastCheck = new Date();
}

// --- Schedule ---
console.log(`Meeting importer starting. Schedule: ${CRON_SCHEDULE}`);
console.log(`Lookback: ${LOOKBACK_MINUTES} minutes`);

// Run once on startup
pollForMeetingNotes();

// Then on schedule
cron.schedule(CRON_SCHEDULE, pollForMeetingNotes, {
  timezone: 'Europe/London'
});
