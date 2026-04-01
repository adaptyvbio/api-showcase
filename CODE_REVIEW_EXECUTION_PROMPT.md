# Code Review Execution Prompt

You are working on branch `codex-review-plan-2026-04-01` in `/Users/julian.englert/api-showcase`.

Your job is to work through the review plan in [CODE_REVIEW_PLAN.md](/Users/julian.englert/api-showcase/CODE_REVIEW_PLAN.md) and improve the codebase in small, defensible steps until the branch is in materially better shape.

## Primary Objective

Execute the review plan with emphasis on correctness, maintainability, and verification. Do not just describe changes. Make them.

## Constraints

- The repository may already contain unrelated user changes. Do not revert or overwrite them unless explicitly asked.
- Work within the current branch unless instructed otherwise.
- Preserve the product intent of the showcase.
- Follow the repo's Next.js guidance in `AGENTS.md`: read the relevant guide in `node_modules/next/dist/docs/` before making framework-sensitive changes.
- Prefer incremental improvements that keep the app runnable over large speculative rewrites.

## Priority Order

### 1. Restore baseline quality gates

Start by getting the current quality bar under control:

- fix `npm run lint`
- keep `./node_modules/.bin/tsc --noEmit` passing
- add missing scripts like `typecheck` and `test` if appropriate

Do this first. A branch that does not pass its baseline checks is not a safe place to continue.

### 2. Repair the domain and mock-data model

Focus on:

- truthful nullable typing in `lib/api-types.ts`
- removing unsafe casts in `lib/mock-data.ts`
- reducing duplication in demo data
- deriving related mock payloads from a single canonical source where practical

### 3. Harden the route handlers

Refactor:

- `app/api/targets/route.ts`
- `app/api/targets/[id]/route.ts`
- `app/api/cost-estimate/route.ts`

Goals:

- shared request helper
- centralized env validation
- safer JSON handling
- better error classification
- schema validation with `zod` if the added structure is justified

### 4. Stabilize client-side request behavior

Focus on:

- stale request protection
- abortable fetches where needed
- user-visible error states
- reducing duplicated transport state

Target components likely include:

- `components/target-catalog/target-explorer.tsx`
- `components/cost-estimator/cost-estimator.tsx`

### 5. Reduce avoidable client weight

Reassess:

- whether `app/page.tsx` needs to be a client component
- whether heavy interactive sections can be deferred
- whether `components/shared/protein-viewer.tsx` should be limited, deferred, or cached more intelligently

### 6. Add focused test coverage

Add the smallest useful test suite that protects the most failure-prone areas:

- parser tests for `lib/sequence-parser.ts`
- fixture consistency tests for `lib/mock-data.ts`
- route tests for proxy behavior
- optionally one smoke-style integration or e2e flow if the setup cost is justified

## Working Style

- Make one coherent improvement at a time.
- After each substantial change set, run the relevant checks.
- Prefer direct code improvements over piling on abstractions.
- If a refactor increases indirection without reducing risk, do not do it.
- Keep naming concrete and boring.

## Required Verification

At minimum, keep track of:

- `npm run lint`
- `./node_modules/.bin/tsc --noEmit`
- any new tests you add

If a build step fails because of sandboxed network access or external font fetching, say so explicitly and separate that from actual code failures.

## Deliverables

By the time you stop, you should have:

1. fixed the current confirmed lint/type problems
2. improved the safety of the typed data model
3. reduced route-handler fragility
4. improved the stability of the main interactive flows
5. added at least some targeted automated coverage
6. left a concise summary of what changed, what remains, and what still needs follow-up

## Decision Rule

If you have to choose between broad surface-area changes and a smaller change that clearly improves correctness and maintainability, choose the smaller verified change first.
