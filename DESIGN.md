# API Showcase — Visual Style Guide

## Philosophy

**Biotech precision meets developer tools.** Linear warmth + Vercel reduction + Stripe code panels. Every pixel earns its place. One accent color. Everything else is surgical grayscale.

---

## Color System

### Backgrounds

| Token | Value | Usage |
|-------|-------|-------|
| Page | `#FAFAFA` | Page background (CSS var `--background`) |
| Card | `#FFFFFF` | Card surfaces, left panels |
| Sunken | `#F4F4F5` | Form inputs, inset areas (CSS var `--muted`) |
| Code body | `#13161B` | Dark code panel background |
| Code header | `#1C2027` | Code panel tab bar |
| Code hover | `#242A35` | Hover states within code panels |

### Text

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0A0A0A` | Headings, high-emphasis (CSS var `--foreground`) |
| Body | `foreground/60` | Body text, descriptions — use opacity, not gray hex |
| Muted | `#6B7280` | Captions, timestamps, helper text (CSS var `--muted-foreground`) |
| On-dark primary | `#E4E4E7` | Text on code panels |
| On-dark secondary | `#9CA3B0` | Less important code panel text |
| On-dark dim | `#636D83` | Comments, separators on dark |
| On-dark faint | `#5C6370` | Least emphasis on dark |

### Accent

| Token | Value | Usage |
|-------|-------|-------|
| Blue | `#0070F3` | Primary accent — links, buttons, active states, focus rings |
| Blue hover | `#005CC8` | Blue hover state |
| Blue muted | `rgba(0,112,243,0.08)` | Selected cards, active nav, section number badges |

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| Success | `#22C55E` | 200 status, LIVE badge, positive states |
| Success bg | `rgba(34,197,94,0.10)` | Success badge background |
| Warning | `#F59E0B` | 400 status, MOCK badge |
| Warning bg | `rgba(245,158,11,0.10)` | Warning badge background |
| Error | `#EF4444` | 500 status, errors |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| Default | `#E4E4E7` | Cards, inputs, dividers (CSS var `--border`) |
| On-dark subtle | `white/[0.06]` | Inner borders on dark panels |
| On-dark | `white/[0.08]` | Borders within code panels |
| On-dark strong | `white/[0.15]` | Tab bar bottom border |

### Binding Strength (domain-specific)

| Token | Value | Usage |
|-------|-------|-------|
| Strong | `#22C55E` | Strong binders |
| Medium | `#3B82F6` | Medium binders |
| Weak | `#F59E0B` | Weak binders |
| Non-binder | `#6B7280` | Non-binders |

### JSON Syntax (One Dark Pro-derived)

| Token | Value | Usage |
|-------|-------|-------|
| Keys | `#E06C75` | JSON property keys |
| Strings | `#98C379` | String values |
| Numbers | `#D19A66` | Numeric values |
| Booleans | `#56B6C2` | true/false/null |
| Brackets | `#ABB2BF` | {}, [], commas |
| Header keys | `#C678DD` | Header names (purple) |

---

## Typography

### Font Families

- **Sans**: Geist Sans — all UI text
- **Mono**: Geist Mono — code, JSON, badges, URLs, sequence data

### Scale

| Use | Size | Weight | Tracking | Line Height |
|-----|------|--------|----------|-------------|
| Hero H1 | `text-[3.75rem]` | 700 (bold) | `-0.045em` | `1.05` |
| Section H2 | `text-2xl` (24px) | 600 (semibold) | `-0.04em` | `tight` |
| Body | `text-[15px]` | 400 | `-0.005em` | `relaxed` |
| Small body | `text-sm` (14px) | 400 | normal | normal |
| Label | `text-xs` (12px) | 500 (medium) | normal | normal |
| Micro label | `text-[11px]` | 600 | `0.04em` | normal |
| Tiny label | `text-[10px]` | varies | `wider` | normal |
| Code JSON | `text-[12px]` mono | 400 | normal | `1.7` |
| Code URL | `text-xs` mono | 400 | normal | normal |
| Mono badge | `text-[10px]` mono | 500-600 | `0.08em` | normal |

---

## Spacing

### Section rhythm

- Between sections: `mt-20` (80px) with `border-t border-border` divider
- Section header to content: `mb-6` (24px)
- Section number to title: `mt-3` (12px)

### Card padding

- Left panel (UI): `p-6 lg:p-8`
- Right panel (code): handled by ApiPanel (p-4 for content)

### Component spacing

- Form field groups: `space-y-5`
- Tight lists: `space-y-1` to `space-y-2`
- Badge groups: `gap-1` to `gap-2`
- Button groups: `gap-3`

---

## Borders & Radius

| Element | Radius | Border |
|---------|--------|--------|
| Example block container | `rounded-xl` (12px) | `border border-border` |
| Target cards | `rounded-lg` (8px) | `border border-border` |
| Buttons | `rounded-lg` (8px) | varies |
| Badges | `rounded-full` | `border border-[color]/20` |
| Code panel tabs | `rounded-md` (6px) | none |
| Protein viewer | `rounded-lg` (8px) | `border border-white/[0.06]` |
| Inputs | from shadcn defaults | `border border-input` |

---

## Interactive States

### Buttons

- **Primary**: `bg-[#0070F3] hover:bg-[#005CC8] text-white` with `shadow-[0_1px_2px_rgba(0,112,243,0.3),0_4px_12px_rgba(0,112,243,0.15)]`
- **Secondary/Outline**: `border border-border text-foreground/70 hover:bg-muted`
- **Transition**: `transition-all duration-150`

### Cards (clickable)

- Default: `border-border`
- Hover: `border-accent-blue/30 bg-accent-blue/[0.02]`
- Text on hover: `text-accent-blue`

### Code panel tabs

- Active: `bg-[#13161B] text-[#E4E4E7]`
- Inactive: `text-[#9CA3B0] hover:text-[#E4E4E7]/70`

### Nav links

- Active: `text-foreground border-[#0070F3]` (underline style)
- Inactive: `text-muted-foreground hover:text-foreground`

---

## Effects

### Frosted glass nav

```css
backdrop-filter: blur(12px);
background-color: rgba(250, 250, 250, 0.8);
```

### Live badge pulse

```css
@keyframes pulse-dot { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
animation: pulse-dot 2s ease-in-out infinite;
```

### Code panel shimmer (loading)

```css
background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.04) 50%, transparent 75%);
background-size: 200% 100%;
animation: shimmer 1.5s ease-in-out infinite;
```

### Entrance animations

- Hero elements: `animate-in fade-in slide-in-from-bottom-N duration-700` with staggered `delay-N00`
- Transitions: `transition-all duration-150` for interactive elements

### 3D Protein Viewer

- Background: `radial-gradient(ellipse at center, #1a1f2e 0%, #0e1116 100%)`
- Inner border: `border border-white/[0.06]`
- Small (card): 140px height, auto-spin `y` axis at 0.5 speed
- Large (detail): 360px height, mouse-interactive
