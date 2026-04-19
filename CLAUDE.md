@AGENTS.md

## Theming — ALWAYS use CSS variables

This project has light/dark mode. **Never use hardcoded hex colors in components or pages.**
Always reference the CSS custom properties defined in `app/globals.css`:

| Variable | Use for |
|---|---|
| `var(--bg)` | page / section background |
| `var(--bg-card)` | card backgrounds |
| `var(--bg-nav)` | nav bar (includes opacity) |
| `var(--ink)` | primary text, headings |
| `var(--ink-mid)` | secondary / body text |
| `var(--ink-soft)` | muted text, meta, labels |
| `var(--accent)` | purple accent, tags, links, CTAs |
| `var(--border)` | all borders and dividers |
| `var(--lpe-bg)` | Life Pattern Engine promo card bg |
| `var(--lpe-border)` | Life Pattern Engine promo card border |

In Tailwind use the arbitrary value syntax: `bg-[var(--bg)]`, `text-[var(--ink)]`, etc.

The `.dark` class on `<html>` switches all variables automatically. The toggle is in `Nav.tsx` and the FOUC-prevention script is in `layout.tsx`.
