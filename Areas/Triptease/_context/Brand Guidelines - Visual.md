---
type: context
last-updated: 2026-04-15
source: BRAND_GUIDELINES.md
---

# Brand Guidelines: Visual

Canonical reference for colors, typography, gradients, and logo usage across all Triptease outputs (PDF decks, infographics, dashboards, marketing materials). See [[Brand Voice and Style Guide]] for written tone and style rules.

---

## Logo

**File:** `Assets/triptease logo.png`

The wordmark is **TRIPTEASE** set in uppercase with generous letter-spacing. All letters share the same thin weight: **do not** make "TRIP" bolder than "TEASE".

| Property | Value |
|----------|-------|
| Font | Inter |
| Weight | 300 (Light) / 400 (Regular) |
| Letter-spacing | 0.35 em (CSS) / 4 px (SVG) |
| Color (on light) | `#3D3D3D` |
| Color (on dark) | `#FFFFFF` |
| Transform | `uppercase` |

**SVG inline usage:**
```svg
<text fill="#3D3D3D" font-family="Inter, Helvetica Neue, Arial, sans-serif"
      font-size="12" font-weight="400" letter-spacing="4">TRIPTEASE</text>
```

**Breathing room:** The logo always needs clear space above it. On infographics, match the reference gap between the grid area and the logo at the bottom.

---

## Color Palette

### Primary Brand Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Copper** | `#ED6E2E` | 237, 110, 46 | Primary accent, CTAs, gradient start |
| **Violet** | `#5E43C2` | 94, 67, 194 | Secondary accent, gradient end |
| **Dark Text** | `#1B1B1B` | 27, 27, 27 | Primary body text |
| **Dark Navy** | `#1B1E27` | 27, 30, 39 | Headers, dark backgrounds |
| **White** | `#FFFFFF` | 255, 255, 255 | Card backgrounds, text on dark |
| **Background Cream** | `#FDF9F6` | 253, 249, 246 | Page/document background |

### Neutral Greys

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Gray 100** | `#F5F5F7` | 245, 245, 247 | Dashboard background |
| **Gray 200** | `#E5E5E7` | 229, 229, 231 | Borders, dividers |
| **Gray 600** | `#6B7280` | 107, 114, 128 | Secondary/muted text |
| **Light Gray** | `#777777` | 119, 119, 119 | Captions, labels |
| **Logo Gray** | `#3D3D3D` | 61, 61, 61 | Logo on light backgrounds |

### Status Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Success** | `#10B981` | 16, 185, 129 | Live indicators, success states |
| **Success Alt** | `#22C55E` | 34, 197, 94 | Badges, positive values |
| **Warning** | `#F59E0B` | 245, 158, 11 | Caution, pending states |
| **Error** | `#EF4444` | 239, 68, 68 | Failures, error states |

### Service / Data Visualization Colors

Used in charts and dashboard cards to represent third-party services:

| Service | Hex | RGB |
|---------|-----|-----|
| Google APIs | `#4285F4` | 66, 133, 244 |
| Apify | `#009DE0` / `#36B5C0` | varies |
| Firecrawl | `#FF6B00` / `#ED6E2E` | varies |
| Claude (Anthropic) | `#CC9966` / `#5E43C2` | varies |
| Gemini | `#8A2BE2` / `#9B6FD4` | varies |
| BigQuery | `#4285F4` | 66, 133, 244 |

### Light Purple Tint

| Name | Value | Usage |
|------|-------|-------|
| **Light Purple** | `rgba(199, 173, 248, 0.2)` | Highlight backgrounds, hover states |

---

## CSS Variables (Dashboard)

```css
:root {
    --primary-orange: #ED6E2E;
    --purple: #5E43C2;
    --dark-navy: #1B1E27;
    --light-purple: rgba(199, 173, 248, 0.2);
    --white: #FFFFFF;
    --gray-100: #F5F5F7;
    --gray-200: #E5E5E7;
    --gray-600: #6B7280;
    --success: #10B981;
    --warning: #F59E0B;
    --error: #EF4444;
}
```

---

## Gradients

### Primary Gradient (Copper-to-Violet)

The signature brand gradient flows from Copper to Violet, left-to-right.

| Format | Value |
|--------|-------|
| CSS (horizontal) | `linear-gradient(90deg, #ED6E2E, #5E43C2)` |
| CSS (diagonal) | `linear-gradient(135deg, #ED6E2E, #5E43C2)` |
| SVG | `<linearGradient x1="0%" x2="100%"><stop offset="0%" stop-color="#ED6E2E"/><stop offset="100%" stop-color="#5E43C2"/></linearGradient>` |

**Used for:** Title text (via SVG gradient fill), header border accents, CTA buttons, link highlights.

### Background Blur Washes

Soft, blurred color washes applied to PDF/deck page backgrounds:

| Wash | Color | Position | Opacity | Blur Radius |
|------|--------|----------|---------|-------------|
| **Orange wash** | `rgb(237, 110, 46)` | Top-left corner | ~10% (alpha 25/255) | 80-120 px |
| **Purple wash** | `rgb(94, 67, 194)` | Bottom-right corner | ~8% (alpha 20/255) | 80-120 px |

**Base color:** `#FDF9F6` (warm cream)

**Python (PIL) technique:**
```python
img = Image.new('RGB', (1122, 793), (253, 249, 246))
# Draw orange ellipse top-left, purple ellipse bottom-right
# Apply GaussianBlur(radius=80)
```

### Button Gradients

| Element | Gradient |
|---------|----------|
| PDF link button | `linear-gradient(135deg, #ED6E2E, #d45a1e)` |
| Infographic link button | `linear-gradient(135deg, #5E43C2, #4a35a0)` |

### Rank Badge Gradients

| Rank | Gradient |
|------|----------|
| Gold | `linear-gradient(135deg, #F59E0B, #D97706)` |
| Silver | `linear-gradient(135deg, #9CA3AF, #6B7280)` |
| Bronze | `linear-gradient(135deg, #D97706, #92400E)` |

---

## Typography

### Font Stack

| Role | Font Family | Fallback Stack |
|------|------------|----------------|
| **Display / Titles** | PT Serif | Georgia, serif |
| **Body / UI** | Inter | -apple-system, Helvetica Neue, Arial, sans-serif |
| **Dashboard body** | Roboto | sans-serif |
| **Monospace / Data** | Roboto Mono | monospace |
| **CJK Support** | Noto Sans SC, Noto Sans KR, Noto Sans JP | Noto Sans CJK SC |

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
```

For dashboard contexts, also include:
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap');
```

### Type Scale

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Page title | PT Serif | 36-38 px | 700 | Gradient fill via SVG |
| Section title | PT Serif | 28 px | 700 | Gradient fill via SVG |
| Card title | Inter | 14-16 px | 600 | Dark text |
| Subtitle | Inter | 13 px | 500 | |
| Body text | Inter | 11-12 px | 400 | Line-height 1.4-1.5 |
| Label / Caption | Inter | 8-10 px | 500 | Uppercase, letter-spacing 0.5-1 px |
| Data value | Roboto Mono | 11-14 px | 400-500 | Cost figures, metrics |
| Logo wordmark | Inter | 12-14 px | 300 | Letter-spacing 4 px, uppercase |

### Gradient Text (SVG Technique)

Titles use SVG `<text>` with a `linearGradient` fill to achieve the Copper-to-Violet gradient:

```python
def svg_gradient_text(text, font_size=48, font_weight=700):
    return f'''<svg ...>
    <defs><linearGradient id="grad" x1="0%" x2="100%">
        <stop offset="0%" stop-color="#ED6E2E"/>
        <stop offset="100%" stop-color="#5E43C2"/>
    </linearGradient></defs>
    <text fill="url(#grad)" font-family="PT Serif, Georgia, serif"
          font-size="{font_size}px" font-weight="{font_weight}">{text}</text>
    </svg>'''
```

---

## Infographic-Specific Rules

These rules apply to Gemini-generated infographic images (used in [[Guest Personas]] and similar outputs):

| Rule | Detail |
|------|--------|
| Aspect ratio | 3:2 landscape (e.g. 2400 x 1600 px) |
| Title font | PT Serif with visible thick-thin stroke variation and decorative serifs |
| Title color | Coral-to-purple gradient (left-to-right), never a solid color |
| Title layout | Always exactly 2 lines, never squeezed to 1 |
| Label font | PT Serif, regular weight (not bold), centered in white boxes |
| Grid | 8 cells in 2x4 or 4x2 arrangement |
| Cell numbering | Plain text (1-8) at bottom-left of each cell's white label area |
| Logo | "TRIPTEASE" at bottom center with clear space above |
| Separator | Thin line between title area and grid area |
| Background | Very subtle, muted gradient: soft cream to very light lavender, almost white |
| Character style | Illustrated character-based scenes, culturally appropriate |
| Title background | NO solid colored band/rectangle: text sits directly on the gradient |

### Reference Assets (S3)

| Asset | S3 Key |
|-------|--------|
| Reference infographic PNG | `Character Sheet/LandscapeTriptease.png` |
| Base64 reference data | `Character Sheet/Base64Indographic.json` |
| S3 bucket | `guest-segments-generator` |

---

## Quick Reference

```
Copper:     #ED6E2E    rgb(237, 110, 46)
Violet:     #5E43C2    rgb(94, 67, 194)
Dark:       #1B1B1B    rgb(27, 27, 27)
Navy:       #1B1E27    rgb(27, 30, 39)
Cream:      #FDF9F6    rgb(253, 249, 246)
Logo Gray:  #3D3D3D    rgb(61, 61, 61)

Gradient:   #ED6E2E -> #5E43C2

Titles:     PT Serif 700
Body:       Inter 400
Logo:       Inter 300, letter-spacing 4px, uppercase
```

---

## Related

- [[Brand Voice and Style Guide]]
- [[Product Reference]]
- [[Triptease Studio]]
- [[Guest Personas]]
