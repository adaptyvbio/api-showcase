@AGENTS.md

# API Showcase

Single-page Next.js 16 demo of the Adaptyv Foundry public API. Five sections show the experiment lifecycle with 50/50 split layouts (interactive UI + API request/response panel).

## Commands

```bash
bun dev --port 3456    # Local dev server
bun run build          # Production build
bun run typecheck      # TypeScript check
bun test               # Run vitest tests
```

## Workflow — IMPORTANT

1. **Always plan first.** Use Plan Mode or subagents to explore and design before writing any code — even for small fixes
2. **Always use tasks.** Break work into discrete tasks with TaskCreate, update status as you go (in_progress → completed)
3. **Use subagents for research.** Delegate codebase exploration, investigation, and planning to subagents to keep the main context clean
4. **Never jump straight to implementation.** The sequence is: explore → plan → implement → verify

## Gotchas

- **shadcn/ui uses Base UI**, not Radix — `asChild` prop does NOT exist
- **Tailwind v4** with `@theme inline` — use CSS vars from `globals.css`, not arbitrary hex values
- **Geist fonts** are literal names in `@theme inline`, NOT `var(--font-geist-sans)`
- **No `rounded-lg`** — the linter normalizes to `rounded-sm` everywhere
- **Package manager is bun** — do not use pnpm or npm
- **All components are `"use client"`** except API routes
- **Do NOT set env vars on Vercel** — use Doppler (`api-showcase` project, `prd` config), which syncs automatically
- **All 5 sections share one coherent demo experiment** (`ABS-001-042`) — changes to `lib/mock-data.ts` affect every section
- **API routes fall back to mock data** when upstream is down — the demo must always work
