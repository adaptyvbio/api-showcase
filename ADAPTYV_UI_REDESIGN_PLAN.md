# Adaptyv Bio Frontend Redesign Implementation Plan

## 1. Aesthetic Direction & Brand Alignment
**Purpose:** Transform the current "generic AI / generic dashboard" aesthetic into a precise, industrial-grade, and memorable interface for bio-engineers using the Adaptyv Foundry.
**Tone:** Refined Utilitarian / Technical Clean.
**Key Tenets:**
- **Typography:** Abandon overused fonts like Inter/Roboto. Adopt a sharp, technical typography scale. We will use a geometric sans-serif for headings (e.g., *Suisse Int'l* or *Geist*) and a monospace font (e.g., *JetBrains Mono* or *Fira Code*) for biological data (sequences, target names, metrics).
- **Color Theming (Adaptyv Brand):**
  - **Primary Action:** Technical Cyan/Blue `#0099ff` (extracted from brand assets).
  - **Backgrounds:** Stark white `#ffffff` with subtle gray structural panels `#f3f3f3`. *(Note: Recent `main` changes to `protein-viewer.tsx` have already established this white/blue pattern—we will expand this globally).*
  - **Text & Borders:** Deep charcoal `#222222` to `#333333` for primary text. Crisp `#eeeeee` or `#cccccc` for borders.
  - **Accents:** Yellow/Orange `#FFBB00` for controls/highlights, Purple `#8855ff` for secondary conceptual targets.
- **Motion:** Precise and snappy. No slow, floaty fades. Interactions should feel like scientific instruments—immediate feedback, 100ms sharp transitions.
- **Composition & Texture:** Zero diffuse "AI" drop shadows. We will rely on sharp 1px borders and ample, structured negative space to delineate hierarchy.

---

## 2. Global Styling & Configuration (Files to Change)

### `app/globals.css`
- **Action:** Clear out generic Tailwind/shadcn variable defaults.
- **Implementation:**
  - Define strictly controlled CSS variables for colors, spacing, and typography.
  - Remove all `.dark` mode generic purple/slate palettes. If dark mode is needed, use pure black `#000000` and high-contrast grayscale.
  - Implement a structural baseline: `* { border-radius: 2px !important; box-shadow: none !important; }` (or handle gracefully in config).

### `tailwind.config.ts` (or equivalent config)
- **Action:** Align theme output with Adaptyv colors and remove generic rounded corners and shadows.
- **Implementation:**
  - Map `primary` to `#0099ff`.
  - Disable default `boxShadow` scale, replacing with sharp structural shadows (e.g., `1px 1px 0px rgba(0,0,0,0.1)` if needed, or strictly borders).
  - Override `fontFamily` to use the chosen technical/monospace stacks.

---

## 3. UI Component Overhaul (Reducing "AI Slop")

### `components/ui/button.tsx`
- **Current State:** Likely uses generic rounded corners (`rounded-md`), floaty hovers, and standard muted colors.
- **New Implementation:**
  - **Shape:** Sharp corners (`rounded-sm` or `rounded-none`).
  - **Colors:** Vibrant primary `#0099ff` with white text.
  - **Hover:** Immediate background darken or a sharp outline shift. No soft opacity transitions.
  - **Code:** Adjust `cva` variants to reflect strict, high-contrast states.

### `components/ui/card.tsx`
- **Current State:** Probably uses `shadow-sm` and thick, soft borders.
- **New Implementation:**
  - Strip `shadow-*` utility entirely.
  - Rely exclusively on stark `border border-[#eeeeee]` or `border-zinc-200`.
  - Ensure uniform internal padding (`p-6` or tighter `p-4` for high-density scientific data).

### `components/ui/input.tsx`, `textarea.tsx`, `select.tsx`
- **Current State:** Soft focus rings (`ring-ring`, `ring-offset-2`).
- **New Implementation:**
  - Remove `ring-offset`.
  - On focus, apply a crisp, hard 1px border of `#0099ff` (`focus:border-primary focus:ring-0`).
  - Backgrounds for inactive inputs should be pure white or `#f3f3f3`.

### `components/ui/badge.tsx`
- **Current State:** Generic pill shapes.
- **New Implementation:**
  - Monospace font for technical metadata (e.g., `148 AA`, `P00533`).
  - Sharp corners, distinct background colors (e.g., pale blue `#0099ff` at 10% opacity with solid `#0099ff` text for active filters).

---

## 4. Feature Component Overhaul

### `components/nav.tsx` & Layout Shell (`app/layout.tsx`)
- **Action:** Create the fixed, industrial dashboard layout shown in the reference.
- **Implementation:**
  - Sidebar: Fixed width (e.g., `w-64`), stark white background, right border `border-r border-[#eeeeee]`.
  - Logo placement at top left with precise spacing.
  - Navigation links: Active states should use the primary `#0099ff` color with a left-aligned bold accent bar, replacing generic soft background highlights.

### `components/experiment-lifecycle/lifecycle-viewer.tsx`
- **Action:** Polish typography and timeline nodes to match the new strict UI variables.
- **Implementation:**
  - *Recent changes in `main` have already simplified this component* by removing the bounding boxes, play/pause controls, and relying on pure negative space for the timeline.
  - We will simply ensure the text uses the new fonts (especially any experiment codes or timestamps being monospaced) and update timeline marker rings/backgrounds to use the sharp `#0099ff` primary color when active.

### `components/shared/protein-viewer.tsx`
- **Action:** Ensure UI overlays match the new typography.
- **Implementation:**
  - *Recent changes in `main` have successfully aligned the 3D model with our color scheme* (pure white background `#ffffff`, blue tones for the molecule and surface).
  - We just need to review the source labels (e.g., "PDB") to make sure they use the new sharp monospace fonts and have a 0px border radius.

### `components/results-viewer/results-viewer.tsx`
- **Action:** Redesign the Binding Affinity scatter plot and the summary data table to match the clean scientific aesthetic.
- **Implementation:**
  - **Chart:** Use hard grid lines (`#eeeeee`), remove background fills. Scatter plot points in cyan (`#0099ff`). Control line in yellow (`#FFBB00`) with a dashed stroke.
  - **Data Table:** 
    - Row borders should be 1px solid `#f3f3f3`.
    - Column headers in small, uppercase, tracked-out font (`text-xs font-semibold tracking-wider text-[#666666]`).
    - Values that are biological data (e.g., sequence IDs `nano2_4_...`) strictly in monospace.
    - Status pills ("Strong", "High") with sharp corners, specific technical colors.

### `components/experiment-builder/experiment-form.tsx`
- **Action:** Tighten the layout for data entry.
- **Implementation:**
  - Use grid layouts to align input fields structurally.
  - Labels must be bold, concise, and closely tied to their inputs.

---

## 5. Execution Steps
1. **Fonts & Variables:** Update `globals.css` and font imports in `layout.tsx` to inject the technical typography and CSS variables.
2. **UI Primitives:** Methodically update the `components/ui/` directory starting with `button`, `card`, `badge`, and `input`.
3. **Layout & Nav:** Refactor `layout.tsx` and `nav.tsx` to lock in the industrial sidebar and header structures.
4. **Data Presentation:** Overhaul `results-viewer.tsx` and `target-catalog` to enforce the monospace data display and sharp tabular borders.
5. **Review Integration:** Review `lifecycle-viewer.tsx` and `protein-viewer.tsx` to ensure their text labels and timeline markers inherit the updated global tokens.
6. **Final Polish:** Audit the interface to ensure no "slop" (diffuse shadows, generic purples, overly rounded corners) remains. All transitions must be 100ms or removed.

*End of Plan*