@AGENTS.md

# API Showcase

Interactive demo of the Adaptyv Foundry public API. Single-page Next.js 16 app with 5 sections showing the experiment lifecycle.

## Project layout

```
app/
  page.tsx              Main page — imports all 5 section components
  layout.tsx            Root layout with Geist fonts, analytics
  globals.css           Design tokens, animations, Tailwind v4 config
  api/
    targets/route.ts    GET proxy → Foundry /targets (with fallback)
    targets/[id]/route.ts  GET proxy → Foundry /targets/{id} (with fallback)
    cost-estimate/route.ts POST proxy → Foundry /experiments/cost-estimate

components/
  hero.tsx              Hero with LIVE chip (AA→DNA easter egg), flip animation
  nav.tsx               Sticky top nav with IntersectionObserver active tracking
  footer.tsx            Footer with links
  experiment-types/     Section 1: experiment type cards
  experiment-builder/   Section 2: create experiment form with sequence table
  target-catalog/       Section 3: target search + 3D protein viewer
  experiment-lifecycle/ Section 4: auto-animated timeline updates
  results-viewer/       Section 5: vertical bar chart + data table
  shared/
    api-panel.tsx       Dark code panel (request/response tabs, URL bar, headers)
    code-block.tsx      React-based JSON syntax highlighting (no dangerouslySetInnerHTML)
    example-block.tsx   50/50 split layout wrapper for each section
    protein-viewer.tsx  3Dmol.js wrapper (Swiss-Model → AlphaFold fallback)
    copy-button.tsx     Copy-to-clipboard button
    http-method-badge.tsx  GET/POST method badge
  ui/                   shadcn/ui components (Base UI variant, NOT Radix)

lib/
  mock-data.ts          Coherent demo data: experiment ABS-001-042, 20 VHH sequences, results
  api-types.ts          TypeScript interfaces for API contracts
  fallback-targets.ts   6 hardcoded targets with full details (used when upstream API fails)
  foundry-api.ts        Shared fetch wrapper for Foundry API with Zod validation
  sequence-parser.ts    FASTA / CSV / TSV / plain text parser for sequence upload
  utils.ts              cn(), formatCents(), formatKd(), formatScientific()

types/
  3dmol.d.ts            Type declarations for 3Dmol.js (GLViewer, StyleSpec, addSurface)
```

## Key conventions

- **All components are client components** (`"use client"`) except API routes
- **shadcn/ui uses Base UI**, not Radix — no `asChild` prop available
- **Tailwind v4** with `@theme inline` — use design token CSS vars, not arbitrary hex
- **Geist fonts** defined as literal names in `@theme inline`, NOT as `var(--font-geist-sans)`
- **No `rounded-lg`** — the linter normalizes to `rounded-sm` everywhere
- **Package manager is bun**, not pnpm or npm

## Design tokens (globals.css)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-blue` | `#0099ff` | Primary blue, CTAs, active states |
| `--color-accent-blue-hover` | `#007acc` | Hover state for blue buttons |
| `--color-code-bg` | `#222222` | Code panel background |
| `--color-code-header` | `#333333` | Code panel header/tab bar |
| `--color-binding-strong` | `#22C55E` (green) | KD < 5 nM |
| `--color-binding-medium` | `#0099ff` (blue) | KD 5-50 nM |
| `--color-binding-weak` | `#FFBB00` (amber) | KD 50 nM - 1 µM |
| `--color-binding-non` | `#6B7280` (gray) | No measurable binding |

## Demo data model

All 5 sections reference the same coherent experiment:
- **Experiment:** ABS-001-042, Anti-HER2 VHH Binding Screen
- **Type:** screening (BLI)
- **Target:** Canine HER2 / ErbB2 (His Tag), ID `019a03da-b87f-7e62-9ba1-7b776b7c8eb3`
- **Sequences:** 20 VHH nanobodies (~120 aa each) + 1 trastuzumab control
- **Results:** KD from 0.8 nM (strong) to non-binder, control at 156 nM

Mock data lives in `lib/mock-data.ts`. Changes there affect all sections.

## API proxy behavior

Routes in `app/api/` proxy to the Foundry testing API. When the upstream fails (timeout, 500, invalid JSON), routes return fallback data from `lib/fallback-targets.ts` so the demo always works. The shared fetch logic is in `lib/foundry-api.ts` with Zod schema validation.

Env vars needed:
- `ADAPTYV_API_URL` — base URL (e.g. `https://foundry-api-public-testing.adaptyvbio.com/api/v1`)
- `ADAPTYV_API_TOKEN` — bearer token (`abs0_...`)

These are managed in Doppler (`api-showcase` project, `prd` config) and synced to Vercel automatically.

## Protein viewer (3Dmol.js)

- Fetches PDB from Swiss-Model first, falls back to AlphaFold
- Blue gradient cartoon coloring with semi-transparent molecular surface
- White background
- Small cards: `pointer-events: none` (no interaction)
- Large detail view: centered 50%x50% interaction zone (prevents accidental zoom when scrolling page)
- Structure data is cached in a module-level Map to avoid refetching

## Timeline (Track Progress)

- Auto-starts on scroll into view (IntersectionObserver, threshold 0.3, fires once via ref)
- Loops every 9 updates at 2s intervals
- Clicking any update switches to manual mode (stops auto-play)
- All 9 updates always rendered; transparency transitions: past=0.4, current=1.0, future=0.08
- API response panel auto-scrolls to bottom as updates stream in

## Infrastructure

- **GitHub:** adaptyvbio/api-showcase
- **Vercel:** adaptyv-bio/api-showcase (auto-deploys on push to main)
- **Doppler:** `api-showcase` project → syncs secrets to Vercel Production
- **Do NOT** set env vars directly on Vercel — use Doppler

## Commands

```bash
bun dev --port 3456    # Local dev server
bun run build          # Production build
bun run typecheck      # TypeScript check
bun test               # Run vitest tests
```
