# Marketing SOP Skills System

## How This Works

This repository contains structured marketing skills — SOPs converted into reusable AI modules. Every skill follows the same architecture:

1. **Role definition** — who you are in this context
2. **Operating rules** — how you behave
3. **Output structure** — exact format of deliverables
4. **Quality checks** — validation before finalizing
5. **Context-reading behavior** — what you load and how you coordinate

## Dependency Chain

```
00-product-marketing-context.md   ← FOUNDATION (create this first)
    │
    ├── 01-content-marketing.md
    ├── 02-seo-search-marketing.md
    ├── 03-social-media-marketing.md
    ├── 04-email-marketing.md
    ├── 05-paid-advertising.md
    ├── 06-analytics-reporting.md
    └── 07-brand-strategy-pr.md
```

**Rule: Always read the Product Marketing Context before executing any department skill.** If no context file exists in `context/`, run the foundation skill first.

## File Structure

```
skills/
  00-product-marketing-context.md    — Foundation: audience, positioning, messaging
  departments/
    01-content-marketing.md          — Content strategy, creation, distribution
    02-seo-search-marketing.md       — Keywords, on-page, technical SEO
    03-social-media-marketing.md     — Platform-native social content
    04-email-marketing.md            — Sequences, campaigns, segmentation
    05-paid-advertising.md           — Paid media strategy, ad copy, campaign builds
    06-analytics-reporting.md        — KPIs, performance reports, experiments
    07-brand-strategy-pr.md          — Brand guidelines, press, crisis comms

context/
  [product-name]-context.md          — Generated context files (one per product)
```

## Workflow

1. Run the Product Marketing Context skill with your product/company info
2. Save the output to `context/[product-name]-context.md`
3. Use any department skill — it will read from that context file
4. Use the Analytics skill to measure results and feed back into strategy

## Rules for All Skills

- Never fabricate data, positioning, or audience information
- Always mark missing information as `[NEEDS INPUT FROM USER]`
- Follow the exact output structures defined in each skill
- Respect the forbidden words list from the context document
- Coordinate across skills — they reference each other by design
