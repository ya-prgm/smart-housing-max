---
name: GovTech Civic Executive
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#424654'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737785'
  outline-variant: '#c3c6d6'
  surface-tint: '#0957cc'
  primary: '#0048af'
  on-primary: '#ffffff'
  primary-container: '#1e60d5'
  on-primary-container: '#dee5ff'
  inverse-primary: '#b1c5ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#7a4000'
  on-tertiary: '#ffffff'
  tertiary-container: '#9d5400'
  on-tertiary-container: '#ffe1cb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001946'
  on-primary-fixed-variant: '#00419e'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm-medium:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  tabular-number:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system delivers an institutional-grade, modern GovTech operating environment engineered for housing governance professionals, property management heads (УО), and HOA board chairs (Председатель ТСЖ/ЖКХ). 

The emotional tone balances rigorous administrative authority with approachable operational calm. Workflows in property oversight are dense, regulated, and often tense; the visual presentation removes friction through pristine spatial discipline, deliberate typography, and quick visual triage.

The aesthetic blends **Modern Corporate** structure with soft, humanized utility inspired by **Keep-style contextual tinting**:
- Structural layouts remain strictly aligned, quiet, and data-dense.
- Interactive workspaces leverage pastel surface washes to categorize buildings, emergency levels, and work orders without visual exhaustion.
- Form controls and elevation choices project reliability, tactile clarity, and high-readability compliance across long operating sessions.

## Colors
The palette is built around high legibility, strict status signaling, and contextual pastels that maintain high contrast against dark neutral typography.

### Core Canvas & Structure
- **Canvas Root:** `#F8FAFC` (Slate 50)
- **Primary Surface:** `#FFFFFF` (Pure White)
- **Subtle Hairline Borders:** `#E2E8F0` (Slate 200)
- **Divider Lines:** `#F1F5F9` (Slate 100)

### Text & Iconography Hierarchy
- **Primary Text:** `#0F172A` (Slate 900) — used for headers, primary data, and key metrics.
- **Secondary / Supporting Text:** `#64748B` (Slate 500) — labels, timestamps, metadata.
- **Tertiary / Disabled Text:** `#94A3B8` (Slate 400) — placeholder text, inactive counts.

### Functional Status System
- **Action & Primary Brand:** `#1E60D5` (Royal Blue) — interactive primary buttons, active tabs, selected states.
- **Resolved / Normal Operations:** `#059669` (Emerald 600) / Background `#ECFDF5` / Border `#A7F3D0`
- **In-Progress / Routine Work:** `#0284C7` (Sky 600) / Background `#F0F9FF` / Border `#BAE6FD`
- **Pending Review / Warning:** `#D97706` (Amber 600) / Background `#FFFBEB` / Border `#FDE68A`
- **Urgent / Emergency (Аварийная):** `#E11D48` (Rose 600) / Background `#FFF1F2` / Border `#FECDD3`

### Pastel Tint System (Card Contexts)
For quick categorization of properties, service accounts, and notices:
- **Pale Blue (Standard Work Order):** Surface `#F0F6FE`, Border `#CFE2FE`
- **Pale Emerald (Utility / Efficiency / Good Standing):** Surface `#F0FDF4`, Border `#BBF7D0`
- **Pale Amber (Financial Dues / Inspection Scheduled):** Surface `#FEFCE8`, Border `#FEF08A`
- **Pale Rose (Critical / Tenant Complaint / Leak):** Surface `#FFF1F2`, Border `#FFE4E6`
- **Pale Purple (Legal / General Assembly / Voting):** Surface `#FAF5FF`, Border `#E9D5FF`
- **Neutral White (Base Card):** Surface `#FFFFFF`, Border `#E2E8F0`

## Typography
The system employs `Inter` (with native system-ui fallbacks: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`) to provide uncompromising optical clarity for Cyrillic and Latin characters.

### Principles & Features
- **OpenType Features:** Enable `cv05` (lowercase l with tail), `cv08` (upper case I with serifs), and `tnum` (tabular numerals) across all data tables, budget rows, and metric widgets.
- **Hierarchy Rules:** Section titles rely on weight contrast (`600` and `700`) rather than drastic size shifts, preserving dense vertical rhythm suitable for management dashboards.
- **Labels & Microcopy:** Badges, field labels, and meta captions use medium-to-semibold weights with subtle tracking (`letter-spacing: 0.02em` to `0.04em`) to ensure instant legibility against pastel containers.

## Layout & Spacing
The layout model is optimized for high-resolution desktop operations (1440px+ standard, down to 1024px tablet/compact displays).

### Grid & Structure
- **Sidebar Navigation:** Fixed width at `260px` (expandable to `300px` for deep organizational trees) or collapsed to `72px` icon rail.
- **Main Viewport Canvas:** Fluid grid with maximum content bounding at `1680px`, anchored with `margin-lg` padding (`2rem`).
- **Dashboard Metric Grid:** 12-column system, collapsing into 6 or 4 columns depending on widget size. Gutter spacing defaults to `1.25rem` (`20px`).
- **Kanban / Multi-Column Board:** Strict horizontal rail with flex child columns (`320px` to `360px` fixed column width), utilizing `space-base` (`1rem`) gap.

### Adaptive Behavior
- **Desktop Wide (≥1440px):** 3 or 4 functional columns for cards; persistent contextual side-drawers for ticket inspection.
- **Desktop Standard (1200px – 1439px):** 2 or 3 functional columns; side-drawers overlay with dimmed backdrops.
- **Tablet Landscape (1024px – 1199px):** 2-column layout; secondary meta panels collapse into tabs.

## Elevation & Depth
Elevation is maintained using crisp boundary lines accompanied by ultra-soft, diffused shadows. The intention is an effortless, airy plane rather than harsh heavy drop shadows.

### Elevation Hierarchy
1. **Level 0 (Flat Canvas & Panels):**
   - Background: `#F8FAFC`
   - Shadow: `none`
   - Border: none
2. **Level 1 (Default Base Cards & Data Containers):**
   - Background: `#FFFFFF` (or designated pastel tint)
   - Border: `1px solid #E2E8F0` (tinted cards use their dedicated color-tinted border)
   - Shadow: `0px 1px 3px rgba(15, 23, 42, 0.04), 0px 1px 2px rgba(15, 23, 42, 0.02)`
3. **Level 2 (Interactive Hover & Elevated Blocks):**
   - Applied to hovered tickets, draggable task cards, and utility cards.
   - Border: `1px solid #CBD5E1`
   - Shadow: `0px 4px 12px -2px rgba(15, 23, 42, 0.06), 0px 2px 4px -1px rgba(15, 23, 42, 0.03)`
4. **Level 3 (Flyouts, Dropdowns & Popovers):**
   - Applied to filter menus, date pickers, and context menus.
   - Border: `1px solid #E2E8F0`
   - Shadow: `0px 10px 24px -4px rgba(15, 23, 42, 0.08), 0px 4px 8px -2px rgba(15, 23, 42, 0.04)`
5. **Level 4 (Modals & Slide-Over Inspector):**
   - Applied to incident creation sheets and building ledger audits.
   - Border: `1px solid #CBD5E1`
   - Shadow: `0px 20px 32px -6px rgba(15, 23, 42, 0.12), 0px 8px 16px -4px rgba(15, 23, 42, 0.06)`

## Shapes
The design system employs a geometric, soft-modern curvature profile (`roundedness: 2`), projecting precision while avoiding cold technical rigidity.

- **Primary Cards & Containers (`rounded-xl`):** `16px` (`1rem`) border radius on dashboard panels, pastel summary cards, and tables.
- **Modals & Slide-out Panels (`rounded-2xl`):** `24px` (`1.5rem`) on central modal windows and high-level dialogue containers.
- **Controls & Form Elements (`rounded-lg`):** `8px` (`0.5rem`) on inputs, buttons, select pickers, and filter pills.
- **Status Badges & Avatar Indicators (`rounded-full`):** Completely pill-shaped (`9999px`) for compact status markers, incident badges, and count bubbles.

## Components

### Buttons
- **Primary:** Solid `#1E60D5` fill, `#FFFFFF` text, `8px` radius. Hover: `#184FA8`. Active: `#14428D`. Focused: `box-shadow: 0 0 0 3px rgba(30, 96, 213, 0.25)`.
- **Secondary (Outline):** Pure `#FFFFFF` background, `1px solid #CBD5E1`, `#0F172A` text. Hover: `#F8FAFC` background, `#0F172A` text.
- **Ghost:** Transparent background, `#64748B` text. Hover: `#F1F5F9` background, `#0F172A` text.
- **Destructive / Urgent:** Background `#FFF1F2`, border `1px solid #FECDD3`, text `#E11D48`. Hover: Background `#FFE4E6`.

### Cards & Pastel Tiles
- **Standard Card:** Background `#FFFFFF`, border `1px solid #E2E8F0`, padding `1.25rem`, border radius `16px`.
- **Tinted Context Cards (Keep-Style):**
  - Used for announcements, inspection items, or unit dossiers.
  - Border thickness is strictly `1px solid` matching the respective border token (e.g., `#BBF7D0` for green, `#FDE68A` for amber).
  - Background maintains high luminosity (97%+ lightness) to keep `#0F172A` body copy passing WCAG AAA contrast.

### Chips & Status Badges
- **Structure:** Height `24px` (small) or `28px` (regular), pill radius (`9999px`), inline flex alignment, padding `0.25rem 0.625rem`. Text: `11px` or `12px` semibold.
- **Emergency / Urgent Badge:** Background `#FFF1F2`, text `#E11D48`, border `1px solid #FECDD3`. Includes a pulsing `6px` circular status indicator.
- **In-Progress Badge:** Background `#F0F9FF`, text `#0284C7`, border `1px solid #BAE6FD`.
- **Resolved Badge:** Background `#ECFDF5`, text `#059669`, border `1px solid #A7F3D0`.
- **Pending Badge:** Background `#FFFBEB`, text `#D97706`, border `1px solid #FDE68A`.

### Input Fields & Controls
- **Input Field:** Height `40px`, padding `0 0.75rem`, background `#FFFFFF`, border `1px solid #CBD5E1`, radius `8px`, typography `14px`. 
- **Focus State:** Border `#1E60D5`, ring `0 0 0 3px rgba(30, 96, 213, 0.15)`.
- **Checkboxes & Radios:** Square `18px` (radius `4px` for check, `50%` for radio). Inactive: `#FFFFFF` with `1.5px solid #CBD5E1`. Checked: `#1E60D5` fill with white checkmark icon.

### Data Tables
- **Header:** Height `44px`, background `#F8FAFC`, border-bottom `1px solid #E2E8F0`, text `#64748B`, uppercase `11px` semibold tracking.
- **Row:** Height `52px`, background `#FFFFFF`, alternating hover state `#F8FAFC`, border-bottom `1px solid #F1F5F9`. Numbers formatted via tabular alignment (`font-variant-numeric: tabular-nums`).

### Specialized Domain Components
- **Apartment / Unit Badge:** Monospaced numerical pill (`№ 142`) in `#F1F5F9` background, `#334155` text, indicating ownership type and arrears indicator.
- **Dispatcher Metric Banner:** Top-level summary band presenting critical counts (Active Outages, Dispatch Queue, Unread Citizen Petitions) in 4 rounded pastel surface blocks.