# Code Review Plan

## Context

This document captures the current code review findings for this repository and a concrete plan to improve correctness, maintainability, and delivery safety.

## Findings

### 1. Quality gates are currently failing

`npm run lint` does not pass. The current failures are concentrated in:

- `components/experiment-builder/experiment-form.tsx`
- `components/results-viewer/results-viewer.tsx`
- `components/shared/code-block.tsx`

The main issues are:

- React Compiler / manual memoization violations
- static component creation during render
- missing JSX keys

This is the highest-priority issue because it blocks safe iteration on a Next 16 / React 19 codebase.

### 2. The type model is inconsistent with the data

`lib/api-types.ts` models assay metrics like `kd`, `kon`, `koff`, and `r_squared` as required numbers, but `lib/mock-data.ts` contains nullable values for non-binders and no-expression cases.

The code currently works around that mismatch with unsafe casts and non-null assertions. That weakens the value of strict TypeScript and increases the chance of runtime bugs in the results UI.

### 3. API proxy routes are too fragile

The route handlers in:

- `app/api/targets/route.ts`
- `app/api/targets/[id]/route.ts`
- `app/api/cost-estimate/route.ts`

duplicate the same environment access and request logic. They also assume upstream responses are always JSON and mostly collapse unrelated failures into generic timeout-style responses.

That makes debugging harder and produces misleading behavior when upstream auth, transport, or payload issues occur.

### 4. Interactive client flows are race-prone

Search and estimate flows do not properly cancel or ignore stale requests. Older responses can overwrite newer state, especially in the target explorer.

Error handling is also mostly visible in the API panel rather than in the main UI, so the user experience degrades silently.

### 5. The page is heavier on the client than it needs to be

`app/page.tsx` is entirely client-rendered even though it mainly composes sections. On top of that, the target list creates many browser-side 3D viewer instances, each of which fetches third-party structure data.

That raises initial client cost and makes the showcase more sensitive to network variability.

### 6. The demo data model is fragmented

The same demo experiment is represented by several separate exports in `lib/mock-data.ts`, including target presets, results, updates, create responses, and result payloads.

This structure makes drift likely and increases the maintenance burden when one part of the demo changes.

### 7. Sequence parsing is too naive for real file uploads

`lib/sequence-parser.ts` uses simple delimiter splitting for CSV/TSV parsing. That will break on common spreadsheet exports with quoted commas, tabs inside fields, or more complex formatting.

There is also no strong validation feedback path for malformed uploads.

### 8. There is no automated test coverage for the risky parts

The repository currently has no real test suite and no `test` script. That leaves parser behavior, proxy route behavior, and demo integrity largely unprotected.

## Improvement Plan

### Phase 1: Restore a reliable baseline

1. Fix the current lint failures.
2. Add a `typecheck` script and keep `tsc --noEmit` green.
3. Add a `test` script, even if it starts with a minimal unit test setup.
4. Make CI fail on lint and typecheck before feature work continues.

### Phase 2: Repair the domain model

1. Update `lib/api-types.ts` so nullable assay metrics are modeled honestly.
2. Remove unsafe casts like `null as unknown as number`.
3. Replace scattered demo exports with one canonical experiment fixture and derive the related mock responses from it.

### Phase 3: Harden the server API layer

1. Create a shared server-side API client for the proxy routes.
2. Centralize environment validation, auth headers, timeout handling, and response parsing.
3. Validate upstream payloads with `zod` before returning them to the UI.
4. Normalize error responses so upstream failures are observable and actionable.

### Phase 4: Stabilize the interactive UX

1. Make client requests abortable or stale-safe.
2. Expose loading, empty, and error states directly in the main UI panels.
3. Remove request-state duplication where possible and keep transport state close to the feature that uses it.

### Phase 5: Reduce client-side weight

1. Move `app/page.tsx` back to a server component if possible.
2. Lazy-load heavier interactive sections.
3. Gate or defer 3D structure viewers so target lists do not instantiate many expensive viewers at once.
4. Consider server-side proxying or caching for structure fetches if the showcase depends on them.

### Phase 6: Add focused tests

1. Unit tests for `lib/sequence-parser.ts`
2. Fixture consistency tests for `lib/mock-data.ts`
3. Route-handler tests for the API proxy layer
4. One or two end-to-end smoke tests covering:
   - target search
   - cost estimate
   - results loading

### Phase 7: Cleanup and polish

1. Remove unused imports and dead code.
2. Reassess whether `components/experiment-types/experiment-types.tsx` should stay, be wired in, or be removed.
3. Improve accessibility details, especially interactive table headers, status messaging, and mobile interactions.
4. Make the distinction between live and mock sections more explicit to users.

## Recommended Execution Order

1. Fix lint and type issues.
2. Normalize the data model.
3. Refactor the proxy layer.
4. Improve client request handling.
5. Add tests.
6. Optimize client rendering and heavy widgets.
7. Do cleanup and polish.
