#!/bin/zsh
# Auto-sync Obsidian vault with GitHub
# Pulls bot commits, pushes any local changes

cd /Users/nikosummers/Desktop/ClaudeProjects/Obsidian || exit 1

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

# Pull remote changes (autostash handles local edits)
git pull --rebase --autostash origin main 2>&1

# If there are local commits ahead of remote, push them
if [ -n "$(git log origin/main..HEAD --oneline 2>/dev/null)" ]; then
  git push origin main 2>&1
fi
