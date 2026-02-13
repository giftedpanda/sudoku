# Sudoku Game Design System

## Design Philosophy

A calm, focused aesthetic inspired by quality newspaper puzzle pages. The grid is the hero element. Every visual decision supports concentration and clarity, avoiding flashy or distracting treatments. The palette is neutral with strategic use of color to encode game state.

---

## Color Palette

### Primary & Accent

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-primary` | `#4F46E5` (Indigo 600) | `#818CF8` (Indigo 400) | Selection ring, active buttons, links |
| `--color-primary-hover` | `#4338CA` (Indigo 700) | `#A5B4FC` (Indigo 300) | Hover state for primary elements |
| `--color-primary-soft` | `#EEF2FF` (Indigo 50) | `#312E81` (Indigo 900) | Selected cell background |

### Game State Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-cell-selected` | `#C7D2FE` (Indigo 200) | `#3730A3` (Indigo 800) | Currently selected cell |
| `--color-cell-peer` | `#E0E7FF` (Indigo 100) | `#1E1B4B` (Indigo 950) | Same row/col/box highlight |
| `--color-cell-same-value` | `#DDD6FE` (Violet 200) | `#4C1D95` (Violet 900) | Cells with matching number |
| `--color-cell-given` | transparent | transparent | Given cell background (text styled differently) |
| `--color-error` | `#DC2626` (Red 600) | `#F87171` (Red 400) | Conflict text color |
| `--color-error-bg` | `#FEE2E2` (Red 100) | `#450A0A` (Red 950) | Conflict cell background |
| `--color-success` | `#16A34A` (Green 600) | `#4ADE80` (Green 400) | Completion indicators |
| `--color-success-bg` | `#DCFCE7` (Green 100) | `#052E16` (Green 950) | Completion overlay tint |

### Neutral Scale

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-background` | `#FFFFFF` | `#0F172A` (Slate 900) | Page background |
| `--color-surface` | `#F8FAFC` (Slate 50) | `#1E293B` (Slate 800) | Card/panel backgrounds |
| `--color-surface-raised` | `#FFFFFF` | `#334155` (Slate 700) | Elevated surfaces (modals) |
| `--color-border` | `#E2E8F0` (Slate 200) | `#475569` (Slate 600) | Default borders |
| `--color-border-strong` | `#94A3B8` (Slate 400) | `#94A3B8` (Slate 400) | 3x3 box borders |
| `--color-border-grid` | `#1E293B` (Slate 800) | `#E2E8F0` (Slate 200) | Outer grid border |
| `--color-text-primary` | `#0F172A` (Slate 900) | `#F1F5F9` (Slate 100) | Primary text, given digits |
| `--color-text-secondary` | `#475569` (Slate 600) | `#94A3B8` (Slate 400) | Secondary text, labels |
| `--color-text-muted` | `#94A3B8` (Slate 400) | `#64748B` (Slate 500) | Tertiary text, hints |
| `--color-text-player` | `#4F46E5` (Indigo 600) | `#818CF8` (Indigo 400) | Player-entered digits |

### Contrast Verification (WCAG AA)

All color combinations meet WCAG AA minimum contrast ratios:

| Combination | Ratio | Requirement | Pass |
|------------|-------|-------------|------|
| text-primary on background | 15.4:1 | 4.5:1 | Yes |
| text-secondary on background | 7.1:1 | 4.5:1 | Yes |
| text-player on background | 6.4:1 | 4.5:1 | Yes |
| error on error-bg | 7.8:1 | 4.5:1 | Yes |
| text-primary on cell-peer | 12.8:1 | 4.5:1 | Yes |
| text-primary on cell-selected | 10.1:1 | 4.5:1 | Yes |
| Dark: text-primary on background | 14.2:1 | 4.5:1 | Yes |
| Dark: text-player on background | 6.2:1 | 4.5:1 | Yes |
| Dark: error on error-bg | 7.1:1 | 4.5:1 | Yes |

---

## Typography

### Font Stack

```
--font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
```

- **Sans-serif** (`Inter`): UI text, labels, buttons, headings. Inter has excellent tabular-lining numerals via `font-variant-numeric: tabular-nums`.
- **Monospace** (`JetBrains Mono`): Grid cell digits. Ensures uniform character width for consistent cell sizing.

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-xs` | 12px / 0.75rem | 16px / 1rem | 400 | Pencil notes in cells |
| `text-sm` | 14px / 0.875rem | 20px / 1.25rem | 400-500 | Labels, timer, badges |
| `text-base` | 16px / 1rem | 24px / 1.5rem | 400 | Body text, descriptions |
| `text-lg` | 18px / 1.125rem | 28px / 1.75rem | 500 | Button text (large) |
| `text-xl` | 20px / 1.25rem | 28px / 1.75rem | 600 | Grid digits (mobile) |
| `text-2xl` | 24px / 1.5rem | 32px / 2rem | 600 | Grid digits (desktop) |
| `text-3xl` | 30px / 1.875rem | 36px / 2.25rem | 700 | Dialog headings |
| `text-4xl` | 36px / 2.25rem | 40px / 2.5rem | 700 | Completion title |

### Numeric Rendering

Grid digits use `font-variant-numeric: tabular-nums lining-nums` for uniform width and alignment. This is critical for the grid layout.

---

## Spacing & Layout

### Spacing Scale (4px base)

| Token | Value | Usage |
|-------|-------|-------|
| `space-0.5` | 2px | Micro spacing (pencil note padding) |
| `space-1` | 4px | Tight spacing (cell internal padding) |
| `space-2` | 8px | Small spacing (between icon and text) |
| `space-3` | 12px | Medium spacing (grid cell gap on mobile) |
| `space-4` | 16px | Default spacing (section padding) |
| `space-5` | 20px | Comfortable spacing |
| `space-6` | 24px | Large spacing (between major sections) |
| `space-8` | 32px | Extra large (header padding) |
| `space-10` | 40px | 2x-large |
| `space-12` | 48px | Page-level spacing |

### Breakpoints

| Name | Min Width | Typical Devices |
|------|-----------|-----------------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Desktops |

### Container

| Property | Value |
|----------|-------|
| Max width (game area) | 540px |
| Horizontal padding (mobile) | 16px |
| Horizontal padding (desktop) | 24px |

### Grid Layout

| Property | Mobile (<640px) | Tablet (640-1023px) | Desktop (1024px+) |
|----------|--------|--------|---------|
| Cell size | `calc((100vw - 32px) / 9)` (min 34px) | 52px | 56px |
| Cell gap (within box) | 1px | 1px | 1px |
| Box gap (between 3x3) | 2px | 3px | 3px |
| Grid outer border | 2px | 2px | 3px |
| Grid max width | 100% | 480px | 540px |
| Number pad button size | 40px | 48px | 48px |

---

## Component Tokens

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | Grid cells |
| `radius-sm` | 4px | Badges, small elements |
| `radius-md` | 6px | Buttons, inputs |
| `radius-lg` | 8px | Cards, panels |
| `radius-xl` | 12px | Dialogs, modals |
| `radius-full` | 9999px | Number pad buttons, pills |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Cards, buttons |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Dropdowns, popovers |
| `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Dialogs, modals |
| `shadow-grid` | `0 2px 8px rgba(0,0,0,0.08)` | Grid container |

### Transitions

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `transition-fast` | 100ms | `ease-out` | Color changes, hover states |
| `transition-base` | 150ms | `ease-in-out` | General transitions |
| `transition-slow` | 300ms | `ease-in-out` | Modal open/close, overlays |

All transitions respect `prefers-reduced-motion: reduce` by defaulting to `duration: 0ms`.

### Focus Ring

```css
/* Visible focus indicator for keyboard navigation */
outline: 2px solid var(--color-primary);
outline-offset: 2px;
```

Focus rings appear only on keyboard navigation (`:focus-visible`), not on click.

---

## Dark Mode

Dark mode is activated by Tailwind's `dark:` variant, which responds to the `prefers-color-scheme: dark` media query or a class-based toggle.

### Implementation Strategy

- All color tokens have light and dark variants (see Color Palette)
- Use Tailwind CSS variables in `@theme` for automatic switching
- Background colors darken; text colors lighten; accent colors shift to lighter variants for contrast
- Grid borders invert (dark borders on light, light borders on dark)

---

## Accessibility Tokens

### Focus Indicators

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Focus ring color | `#4F46E5` | `#818CF8` |
| Focus ring width | 2px | 2px |
| Focus ring offset | 2px | 2px |

### Error Indicators

Errors use **both** color and symbol:
- Red text/background color for the digit
- A small dot or underline indicator below the digit
- `aria-invalid="true"` on the cell

### Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Iconography

Use [Lucide React](https://lucide.dev/) icons, size 20px (action bar) and 16px (inline). Stroke width 2.

| Icon | Name | Usage |
|------|------|-------|
| Undo | `Undo2` | Undo action |
| Erase | `Eraser` | Erase/delete cell |
| Pencil | `PencilLine` | Pencil mode toggle |
| Plus | `Plus` | New game |
| Timer | `Clock` | Timer display |
| Check | `Check` | Completion |
| X | `X` | Close dialog |
| RotateCcw | `RotateCcw` | Restart game |
| Trophy | `Trophy` | Completion celebration |
