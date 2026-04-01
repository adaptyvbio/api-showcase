# Adaptyv API Showcase

Interactive single-page demo of the [Adaptyv Foundry public API](https://docs.adaptyvbio.com). Walks through the full experiment lifecycle: choosing an assay type, creating an experiment with protein sequences, browsing target proteins, tracking progress, and viewing binding results.

**Live:** https://api-showcase-dun.vercel.app

## Sections

| # | Section | What it shows |
|---|---------|--------------|
| 1 | **Experiment Types** | All 5 assay types (Expression, Binding Screening, Affinity, Thermostability, Fluorescence) with target/method requirements |
| 2 | **Create Experiment** | Step-by-step builder: pick type, select target, generate 20 example VHH sequences or upload CSV/FASTA |
| 3 | **Browse Targets** | Live search against the target catalog with 3D protein structure viewers (3Dmol.js, Swiss-Model/AlphaFold) |
| 4 | **Track Progress** | Auto-animated experiment lifecycle (9 updates, 2s each, loops). Click any update to enter manual mode |
| 5 | **View Results** | 20 VHH sequences with vertical KD bar chart, sortable data table, CSV download |

Each section has a 50/50 split layout: interactive UI on the left, live API request/response panel on the right.

## Demo data

All sections reference a single coherent experiment (`ABS-001-042`, Anti-HER2 VHH Binding Screen) with 20 realistic nanobody sequences. The results range from 0.8 nM (strong binder) to non-binder, with a trastuzumab-derived control at 156 nM.

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**, TypeScript
- **Tailwind CSS v4** with custom design tokens
- **shadcn/ui** components (Base UI variant)
- **3Dmol.js** for protein structure rendering
- **Geist Sans / Geist Mono** fonts

## Infrastructure

### GitHub

- **Repo:** [adaptyvbio/api-showcase](https://github.com/adaptyvbio/api-showcase)
- Pushes to `main` trigger Vercel production deployments automatically

### Vercel

- **Project:** [adaptyv-bio/api-showcase](https://vercel.com/adaptyv-bio/api-showcase)
- **Team:** Adaptyv Bio (`adaptyv-bio`)
- **Production URL:** https://api-showcase-dun.vercel.app
- Connected to GitHub repo for automatic deployments on push
- Environment variables are synced from Doppler (do NOT set env vars directly on Vercel)

### Doppler

- **Project:** `api-showcase`
- **Config:** `prd` (production)
- **Sync:** Doppler syncs secrets to the Vercel project's Production environment automatically
- **Secrets managed:**
  - `ADAPTYV_API_URL` -- Foundry public API base URL
  - `ADAPTYV_API_TOKEN` -- Bearer token for API authentication

To update secrets, change them in Doppler and they will sync to Vercel automatically. No redeployment needed for runtime env vars, but server-side build-time vars require a redeploy.

### Flow

```
Doppler (secrets) --sync--> Vercel (env vars)
GitHub (code)     --push--> Vercel (build + deploy)
```

## Local development

```bash
# Clone
git clone https://github.com/adaptyvbio/api-showcase.git
cd api-showcase

# Install
bun install

# Set up env vars (pull from Doppler or create manually)
doppler secrets download -p api-showcase -c dev --no-file --format env > .env.local
# Or manually create .env.local with ADAPTYV_API_URL and ADAPTYV_API_TOKEN

# Run dev server
bun dev --port 3456
```

## API proxy routes

The app proxies API calls through Next.js server routes to keep the API token server-side:

| Route | Upstream | Fallback |
|-------|----------|----------|
| `GET /api/targets?search=` | `GET /targets?search=&selfservice_only=true` | 6 hardcoded targets with UniProt IDs |
| `GET /api/targets/[id]` | `GET /targets/{id}` | Full detail data for all 6 fallback targets |
| `POST /api/cost-estimate` | `POST /experiments/cost-estimate` | None (pass-through) |

When the upstream testing API is unavailable (timeout, 500, invalid response), the target routes fall back to realistic mock data so the demo always works.
