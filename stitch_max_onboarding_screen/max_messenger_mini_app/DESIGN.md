---
name: 'MAX Messenger Mini-App: Мой Дом'
colors:
  surface: '#f7f9ff'
  surface-dim: '#d2dbe6'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf4ff'
  surface-container: '#e6effa'
  surface-container-high: '#e0e9f4'
  surface-container-highest: '#dae3ef'
  on-surface: '#141c24'
  on-surface-variant: '#3e4850'
  inverse-surface: '#29313a'
  inverse-on-surface: '#e9f2fd'
  outline: '#6e7881'
  outline-variant: '#bec8d2'
  surface-tint: '#006591'
  primary: '#006591'
  on-primary: '#ffffff'
  primary-container: '#2aabee'
  on-primary-container: '#003c58'
  inverse-primary: '#89ceff'
  secondary: '#0056c4'
  on-secondary: '#ffffff'
  secondary-container: '#006df5'
  on-secondary-container: '#fefcff'
  tertiary: '#1a52d9'
  on-tertiary: '#ffffff'
  tertiary-container: '#809dff'
  on-tertiary-container: '#002f8e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#afc6ff'
  on-secondary-fixed: '#001944'
  on-secondary-fixed-variant: '#00429a'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b6c4ff'
  on-tertiary-fixed: '#00164e'
  on-tertiary-fixed-variant: '#003baf'
  background: '#f7f9ff'
  on-background: '#141c24'
  surface-variant: '#dae3ef'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  numeric-display:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system defines the visual language for a high-utility residential and civic services mini-app hosted inside a native mobile messenger ecosystem. The personality balances the speed, convenience, and lightweight feel of a chat-driven interface with the authoritative reliability required for municipal, billing, and home management workflows.

### Target Audience & Emotional Intent
Designed for urban apartment owners, tenants, and property management staff who value swift execution without bureaucratic friction. The UI conveys:
- **Instant Clarity**: Cognitive load is minimized through concise card grouping, explicit status iconography, and legible typographic tiers.
- **Trust & Legitimacy**: Subdued institutional accents anchor transactional security (payments, meter submissions, government-verified homeowner registry) within an inviting, modern messenger container.
- **Fluid Dexterity**: Micro-interactions, soft physical elevation, and generous touch targets emulate fluid iOS/Android native performance.

### Aesthetic Direction: Modern Messenger Native
A hybrid of contemporary flat surfaces, subtle glass accents for navigation headers, and soft atmospheric shadows. Surfaces rely on crisp cool neutrals (`#F4F6F8`), distinct separation between content tiers, rounded corners (16px–20px for structural modules, fully pill-shaped for actionable buttons and badges), and hairline border strokes (`#E5E8EC`).

## Colors

The palette establishes an immediate link to the messenger host shell while introducing specialized utility tokens for civic, utility, and payment states.

### Primary & Action Scale
- **Primary Messenger Blue (`#2AABEE`)**: Active tabs, key focus rings, progress bars, and high-frequency messaging utilities.
- **Deep Action Blue (`#0C73FE`)**: Primary transactional buttons, interactive links, verified checkmarks, and focal tap states.
- **Institutional Blue (`#0D4CD3`)**: Used sparingly for civic services badges, Gosuslugi integration labels, and official document signatures.
- **Civic Critical Red (`#EB140A`)**: Overdue invoices, critical building announcements (e.g., scheduled water/power shutoffs), and destructive dialog triggers.

### Neutral & Surface Hierarchy
- **Canvas Base (`#F4F6F8`)**: Global backdrop across views.
- **Surface Elevation (`#FFFFFF`)**: Cards, bottom sheets, sticky bars, and modal sheets.
- **Text Primary (`#1C1E21`)**: Primary headlines, values, invoice amounts, and high-emphasis body text.
- **Text Secondary (`#717A84`)**: Subtitles, input placeholders, metadata timestamps, and meter serial numbers.
- **Border / Hairline (`#E5E8EC`)**: 1px subtle separation for structural elements, table rows, and secondary containers.
- **Success / Positive (`#00B865`)**: Meter reading approved, paid receipt, and status healthy.
- **Warning (`#FF9500`)**: Pending verification, submission deadline approaching.

## Typography

The type system uses `Inter` to replicate the crispness and legibility of native mobile system fonts (SF Pro / Roboto). It prioritizes rapid scanning of tabular meter data, bill receipts, and operational updates inside messenger webviews.

- **Headlines**: Set tightly with negative tracking (`-0.015em` on sizes above 20px) to maximize horizontal real estate on compact mobile screens.
- **Body Text**: Tuned for maximum readability on varying OLED/LCD glass. High optical clarity in both Russian and English character sets.
- **Numeric Display**: Utilized strictly for currency balances, payment amounts, and meter index readouts. Must render with tabular lining figures (`font-variant-numeric: tabular-nums`) to prevent jitter in animated value changes.

## Layout & Spacing

The layout is built for native mobile mini-app containers (viewport widths typically ranging between 360px and 430px), scaling upward gracefully to tablet sheets and desktop messenger panels.

### Grid & Boundary Rules
- **Canvas Margins**: Fixed `16px` (`margin: 1rem`) on phones, expanding to `24px` on tablet and split-pane desktop webviews.
- **Component Padding Scale**: Internal card padding uses `16px` for standard widgets and `12px` for compact meter input counters.
- **Rhythm**: Standard spacing aligns to a strict 4px/8px incremental rhythm (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 12px, `space-lg` = 16px, `space-xl` = 24px).
- **Sticky Viewport Anchors**: Bottom action containers (e.g., 'Pay Bill', 'Submit Readings') leverage a fixed bottom panel backed by a translucent frosted background with an internal vertical padding of `12px` and bottom safe-area inset compensation (`env(safe-area-inset-bottom)`).

## Elevation & Depth

Visual depth is achieved through quiet, soft-ambient drop shadows coupled with 1px hairline boundary strokes, avoiding visual noise inside a condensed mini-app envelope.

### Layer Hierarchy
- **Level 0 (Base Canvas)**: Flat `#F4F6F8` background with no elevation.
- **Level 1 (Cards, Modules, Input Groups)**: Pure white `#FFFFFF` with a 1px border stroke (`#E5E8EC`) and an ambient shadow: `0 2px 8px rgba(28, 30, 33, 0.04)`.
- **Level 2 (Floating Controls, Quick-Action Pills, Dropdowns)**: `#FFFFFF` surface with `0 4px 16px rgba(28, 30, 33, 0.08)` and border stroke (`#E5E8EC`).
- **Level 3 (Modals, Bottom Sheets, Toast Overlays)**: Surface `#FFFFFF` layered above a 40% black backdrop (`rgba(0, 0, 0, 0.40)`), elevated via `0 -4px 24px rgba(28, 30, 33, 0.12)`.
- **Level 4 (Sticky Top Bar / Bottom Action Dock)**: Semi-transparent `#FFFFFF` (90% opacity) with a `16px` backdrop-filter blur and a hairline border (`#E5E8EC`) facing the content stream.

## Shapes

The geometric signature combines generous structural corner radiuses with full-pill elements to reflect the modern messenger UI style.

- **Primary Cards and Service Containers**: Set to `16px` (up to `20px` for hero dashboard balance banners) to deliver an inviting, tactile enclosure.
- **Input Fields & Text Areas**: `12px` radius for structured input balance.
- **Buttons, Status Badges, and Filter Chips**: `9999px` (Pill shape) to contrast sharply against rectangular content cards and optimize thumb-reach affordance.
- **Bottom Sheets**: `20px` top-left and top-right radii with an integrated `4px × 36px` centered drag indicator pill (`#D2D6DC`).

## Components

### Buttons
- **Primary Action (Transactional)**: Filled `#0C73FE` with `#FFFFFF` label text. Height `48px`, pill radius (`9999px`), bold label (`label-lg`). Active state drops to `90%` opacity with a subtle `scale(0.98)` transform for native responsiveness.
- **Secondary (Messenger Shell Native)**: Soft-tinted `#EBF5FE` background with `#0C73FE` or `#2AABEE` label. Height `44px`, pill radius.
- **Destructive**: Subdued `#FDE8E7` background with `#EB140A` typography.

### Input Fields & Counters
- **Text & Numeric Inputs**: `48px` height, `#FFFFFF` background, `1px solid #E5E8EC` border, `12px` radius. Focused state introduces a `2px` ring in `#2AABEE` with zero shadow offset. Placeholder text in `#717A84`.
- **Meter Reading Input**: Split-digit or grouped numeric box with right-aligned unit indicator (`кВт·ч`, `м³`) in `#717A84` and high-contrast tabular numeric text (`#1C1E21`).

### Cards & Service Tiles
- **Utility Overview Card**: Background `#FFFFFF`, `16px` border-radius, `1px solid #E5E8EC`, soft elevation level 1. Contains status pill at top right, clear payment sums in `numeric-display`, and inline primary action button.
- **Quick Action Grid**: 2-column or 4-column icon-top service tiles (e.g., 'Master Call', 'Pay Rent', 'Intercom Camera', 'Passes') with circular 44px icon containers tinted in matching secondary/tertiary colors.

### Status Chips & Badges
- **Pill Badges**: `24px` height, horizontal padding `10px`, font size `label-sm`.
  - *Paid / Verified*: Background `#E6F8F0`, Text `#00874A`.
  - *Pending / Processing*: Background `#FFF4E5`, Text `#B26500`.
  - *Debt / Overdue*: Background `#FDE8E7`, Text `#EB140A`.
  - *Official (Gosuslugi / Management)*: Background `#E8F0FE`, Text `#0D4CD3`.

### Lists & Cell Rows
- Grouped iOS/messenger-style cells inside white cards. Each row has a minimum height of `52px`, separated by a `1px` border inset by `16px`. Right accessory features chevrons (`#717A84`), switch controls, or secondary status labels.

### Intercom & Camera Preview Widget
- Aspect ratio 16:9 card, `16px` rounded corners, absolute overlay controls for 'Open Door' (pill-shaped white glass container with `#00B865` key icon) and emergency security ping.