# insta

Marketing SOP Skills System — agency knowledge converted into structured, reusable AI modules.

## What This Is

Every major marketing function, codified as a structured skill:

| # | Skill | Function |
|---|-------|----------|
| 00 | Product Marketing Context | Foundation — audience, positioning, messaging pillars |
| 01 | Content Marketing | Strategy, creation, distribution |
| 02 | SEO & Search Marketing | Keywords, on-page optimization, technical audits |
| 03 | Social Media Marketing | Platform-native content, calendars, engagement |
| 04 | Email Marketing | Sequences, campaigns, segmentation |
| 05 | Paid Advertising | Campaign structure, ad copy, media buying |
| 06 | Analytics & Reporting | KPIs, performance reports, experiment analysis |
| 07 | Brand Strategy & PR | Guidelines, press materials, crisis comms |

## How It Works

Each skill contains five components:

- **Role definition** — who the AI operates as
- **Operating rules** — behavioral constraints
- **Output structure** — exact deliverable format
- **Quality checks** — validation checklist before output
- **Context-reading behavior** — dependency chain and coordination

## Getting Started

1. Start with **Product Marketing Context** (skill 00) — define your audience, positioning, and messaging
2. Save the output to `context/[your-product]-context.md`
3. Run any department skill — they all read from your context file
4. Use **Analytics & Reporting** to measure and feed results back into strategy

## Architecture

```
skills/
  00-product-marketing-context.md       ← Start here. Everything reads this.
  departments/
    01-content-marketing.md
    02-seo-search-marketing.md
    03-social-media-marketing.md
    04-email-marketing.md
    05-paid-advertising.md
    06-analytics-reporting.md
    07-brand-strategy-pr.md
context/
  [product]-context.md                  ← Generated per product/service
```

The Product Marketing Context is the root dependency. Without it, downstream skills will ask for it before producing output.
