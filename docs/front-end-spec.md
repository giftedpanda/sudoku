# Sudoku Game Front-End Specification

## Overview

This document defines the UI architecture, component catalog, layout specifications, and interaction patterns for the Sudoku game. It serves as the source of truth for developers building the interface.

---

## Page Layout

### Game Screen (Primary)

The game screen is the only route (`/`). It contains four stacked sections:

```
+----------------------------------+
|  GameHeader                      |
|  [Timer]  [Difficulty]  [New]    |
+----------------------------------+
|                                  |
|         SudokuGrid               |
|         9x9 cells                |
|                                  |
+----------------------------------+
|  ActionBar                       |
|  [Undo] [Erase] [Pencil] [Rst]  |
+----------------------------------+
|  NumberPad                       |
|  [1][2][3][4][5][6][7][8][9]     |
+----------------------------------+
```

### Mobile Layout (< 640px)

- Full-width, vertically stacked
- Grid: fills available width minus 16px padding per side
- Cell size: `calc((100vw - 32px) / 9)` with minimum 34px
- Number pad: horizontal row, buttons ~40px
- Action bar: horizontal row with icon buttons
- Header: compact, single row

### Tablet Layout (640px - 1023px)

- Centered, max-width 480px for grid
- More generous spacing
- Larger touch targets (48px buttons)

### Desktop Layout (1024px+)

- Centered container, max-width 540px for grid
- Grid cells: 56px
- Generous whitespace for calm, focused feel
- Number pad and action bar remain below grid

---

## Component Catalog

### Primitive UI Components (`src/components/ui/`)

These are generic, reusable components not specific to Sudoku.

---

#### Button (`button.tsx`)

A polymorphic button with variant-based styling via `cva`.

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg" | "icon"
  asChild?: boolean
}
```

**Variants:**
| Variant | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| `default` | White bg, slate border | Slate-800 bg, slate-600 border | General buttons |
| `primary` | Indigo-600 bg, white text | Indigo-500 bg, white text | Primary actions (New Game) |
| `secondary` | Slate-100 bg, slate-700 text | Slate-700 bg, slate-200 text | Secondary actions |
| `ghost` | Transparent bg, hover slate-100 | Transparent bg, hover slate-800 | Icon buttons (action bar) |
| `destructive` | Red-600 bg, white text | Red-500 bg, white text | Destructive confirmations |

**Sizes:**
| Size | Padding | Height | Font |
|------|---------|--------|------|
| `sm` | `px-3` | 32px | 14px |
| `md` | `px-4` | 40px | 14px |
| `lg` | `px-6` | 48px | 16px |
| `icon` | `p-2` | 40px | N/A |

**States:** hover, active, focus-visible, disabled

---

#### Dialog (`dialog.tsx`)

A modal dialog with backdrop, built on native `<dialog>` or portal-based approach.

**Components:**
```typescript
// Compound component pattern
Dialog            // Root provider (open state)
DialogTrigger     // Opens the dialog
DialogContent     // The modal panel
DialogHeader      // Header section
DialogTitle       // H2 title
DialogDescription // Subtitle/description
DialogFooter      // Action buttons section
DialogClose       // Close button
```

**Behavior:**
- Opens centered with backdrop overlay (`bg-black/50`)
- Closes on backdrop click, Escape key, or close button
- Traps focus within dialog when open
- Returns focus to trigger on close
- Animates in (fade + scale) respecting `prefers-reduced-motion`

**Props (DialogContent):**
```typescript
interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
}
```

---

#### Badge (`badge.tsx`)

Small status/label indicators.

**Props:**
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error"
}
```

**Variants:**
| Variant | Light Style | Usage |
|---------|------------|-------|
| `default` | Slate bg, slate text | Generic labels |
| `primary` | Indigo-100 bg, indigo-700 text | Difficulty indicator |
| `success` | Green-100 bg, green-700 text | Completion |
| `warning` | Amber-100 bg, amber-700 text | Caution |
| `error` | Red-100 bg, red-700 text | Error state |

---

### Game Components (`src/components/game/`)

These are Sudoku-specific components built by developers during story implementation. Specifications here serve as the build guide.

---

#### SudokuGrid (`SudokuGrid.tsx`)

The 9x9 game grid. This is the hero element of the interface.

**Props:**
```typescript
interface SudokuGridProps {
  board: Board
  selectedCell: [number, number] | null
  onCellSelect: (row: number, col: number) => void
  isPencilMode: boolean
}
```

**Structure:**
```html
<div role="grid" aria-label="Sudoku puzzle grid">
  <!-- 9 rows -->
  <div role="row" aria-rowindex={row + 1}>
    <!-- 9 cells per row -->
    <SudokuCell ... />
  </div>
</div>
```

**Visual Rules:**
- Outer border: 2-3px, `border-grid` color
- 3x3 box borders: 2px, `border-strong` color
- Cell borders: 1px, `border` color
- CSS Grid: `grid-template-columns: repeat(9, 1fr)` with gap management

**3x3 Box Delineation Strategy:**
Use thicker borders on cells at box boundaries (every 3rd column/row) rather than nesting grids. This simplifies the grid structure and accessibility.

---

#### SudokuCell (`SudokuCell.tsx`)

Individual grid cell with multiple visual states.

**Props:**
```typescript
interface SudokuCellProps {
  value: number | null
  notes: Set<number>
  isGiven: boolean
  isSelected: boolean
  isPeer: boolean         // Same row/col/box as selected
  isSameValue: boolean    // Contains same digit as selected
  isError: boolean
  row: number
  col: number
  onClick: () => void
}
```

**States (visual hierarchy, highest to lowest):**

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Selected + Error | `error-bg` | `error` | `primary` ring |
| Selected | `cell-selected` | `text-player` or `text-primary` | `primary` ring |
| Error | `error-bg` | `error` | default |
| Same Value | `cell-same-value` | inherit | default |
| Peer (same row/col/box) | `cell-peer` | inherit | default |
| Given (default) | transparent | `text-primary`, **font-weight: 700** | default |
| Editable (default) | transparent | `text-player` | default |

**Notes Display:**
When a cell has notes and no value, render a 3x3 mini-grid:
```
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
```
Only occupied positions show the digit; others are empty. Use `text-xs` (12px).

**Error Indicator (non-color):**
In addition to red coloring, error cells display a small triangular marker in the top-right corner of the cell. This ensures color-blind users can identify errors.

**Accessibility:**
```html
<div
  role="gridcell"
  tabindex={isSelected ? 0 : -1}
  aria-label="Row 3, Column 5, value 7"
  aria-selected={isSelected}
  aria-readonly={isGiven}
  aria-invalid={isError}
/>
```

---

#### NumberPad (`NumberPad.tsx`)

Row of 9 number buttons for input.

**Props:**
```typescript
interface NumberPadProps {
  onNumberSelect: (num: number) => void
  disabledNumbers: Set<number>  // Numbers appearing 9 times
  isPencilMode: boolean
}
```

**Layout:** Horizontal row with flex-wrap, gap of 8px. Each button is a rounded square (40-48px depending on breakpoint).

**Button States:**
- Default: `surface` bg, `text-primary` text
- Hover: `primary-soft` bg
- Active/Pressed: `primary` bg, white text (brief flash)
- Disabled: `surface` bg, `text-muted` text, 50% opacity
- When pencil mode active: Pencil icon or subtle pencil-style treatment on number buttons

---

#### ActionBar (`ActionBar.tsx`)

Game action buttons in a horizontal row.

**Props:**
```typescript
interface ActionBarProps {
  onUndo: () => void
  onErase: () => void
  onTogglePencil: () => void
  onRestart: () => void
  isPencilMode: boolean
  canUndo: boolean
}
```

**Buttons:**
| Button | Icon | Label | Keyboard Shortcut |
|--------|------|-------|-------------------|
| Undo | `Undo2` | "Undo" | Ctrl/Cmd+Z |
| Erase | `Eraser` | "Erase" | Backspace/Delete |
| Pencil | `PencilLine` | "Pencil" | P |
| Restart | `RotateCcw` | "Restart" | -- |

Each button uses the `ghost` variant with icon + label below. The pencil button uses `primary` variant when active.

---

#### GameHeader (`GameHeader.tsx`)

Top bar with timer, difficulty, and new game button.

**Props:**
```typescript
interface GameHeaderProps {
  time: number          // Seconds elapsed
  difficulty: Difficulty
  onNewGame: () => void
}
```

**Layout:**
```
[Clock icon] 05:23    [Easy badge]    [+ New Game button]
```

- Timer: `text-sm font-mono`, left-aligned with clock icon
- Difficulty: `Badge` component with `primary` variant, center
- New Game: `Button` with `primary` variant, right-aligned

---

#### Timer (`Timer.tsx`)

Displays elapsed time.

**Props:**
```typescript
interface TimerProps {
  seconds: number
}
```

**Format:** `MM:SS` when under 1 hour, `H:MM:SS` when 1+ hours.

**Style:** `font-mono text-sm text-secondary` with `Clock` icon.

---

#### NewGameDialog (`NewGameDialog.tsx`)

Modal for starting a new game.

**Props:**
```typescript
interface NewGameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectDifficulty: (difficulty: Difficulty) => void
  showConfirmation?: boolean  // When replacing an in-progress game
}
```

**Content:**
- Title: "New Game"
- Three difficulty cards (radio-button-like selection):

| Difficulty | Description | Given Cells |
|-----------|-------------|-------------|
| Easy | "Great for beginners" | 38-45 |
| Medium | "A balanced challenge" | 30-37 |
| Hard | "For Sudoku experts" | 22-29 |

- Confirmation variant: "You have a game in progress. Start a new one?" with Cancel/Confirm buttons.

---

#### CompletionOverlay (`CompletionOverlay.tsx`)

Victory celebration modal.

**Props:**
```typescript
interface CompletionOverlayProps {
  open: boolean
  time: number
  difficulty: Difficulty
  onNewGame: () => void
}
```

**Content:**
- Trophy icon (large, `success` color)
- Title: "Puzzle Complete!"
- Difficulty badge
- Completion time
- "New Game" button

**Animation:** Subtle scale-up entrance. Confetti or particle animation (CSS-only, respects `prefers-reduced-motion`).

---

## Interaction Patterns

### Cell Selection Flow

1. User clicks/taps cell -> cell becomes selected (`cell-selected` bg, focus ring)
2. Peer cells highlighted (`cell-peer` bg)
3. Same-value cells highlighted (`cell-same-value` bg)
4. Previous selection cleared
5. Click outside grid or same cell -> deselect

### Number Entry Flow

1. User selects an editable cell
2. User presses number (pad or keyboard)
3. If pencil mode OFF: value is set, notes cleared, peer notes updated
4. If pencil mode ON: note toggled in cell
5. Conflict detection runs
6. Action pushed to undo stack
7. Game state auto-saved

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow keys | Move selection in direction |
| 1-9 | Enter number / toggle note |
| 0, Backspace, Delete | Erase cell |
| P | Toggle pencil mode |
| Ctrl/Cmd + Z | Undo |
| Escape | Deselect cell / Close dialog |
| Tab | Move focus between sections |

### Focus Management

- Grid cells use roving `tabindex` (selected cell = `tabindex="0"`, others = `tabindex="-1"`)
- Arrow keys navigate within grid
- Tab moves focus to next section (grid -> action bar -> number pad)
- Dialog traps focus when open

---

## Responsive Behavior

### Grid Scaling

The grid scales to fill available width on mobile, with a maximum size on larger screens:

```css
/* Mobile-first */
.grid {
  width: calc(100vw - 32px);  /* 16px padding each side */
  max-width: 540px;
  aspect-ratio: 1 / 1;        /* Always square */
}
```

### Touch Targets

All interactive elements meet the 44x44px minimum touch target (WCAG 2.5.5). On mobile:
- Grid cells: minimum 34px (acceptable given the 9x9 constraint)
- Number pad buttons: 40px minimum
- Action bar buttons: 44px minimum

### Breakpoint Adjustments

| Element | Mobile (<640px) | Tablet (640-1023px) | Desktop (1024px+) |
|---------|--------|--------|---------|
| Grid digit size | `text-xl` (20px) | `text-2xl` (24px) | `text-2xl` (24px) |
| Note digit size | 9px | 10px | 11px |
| Number pad button | 40px round | 48px round | 48px round |
| Action bar labels | Hidden (icon only) | Visible | Visible |
| Header layout | Single compact row | Single row | Single row |
| Game container padding | 16px | 24px | 24px |

---

## State Management Architecture

Game state is managed via `useReducer` in the main game component:

```typescript
interface GameState {
  board: Board
  solution: Board
  difficulty: Difficulty
  selectedCell: [number, number] | null
  isPencilMode: boolean
  timer: number
  undoStack: UndoEntry[]
  isComplete: boolean
}

type GameAction =
  | { type: "SELECT_CELL"; row: number; col: number }
  | { type: "DESELECT_CELL" }
  | { type: "SET_VALUE"; value: number }
  | { type: "TOGGLE_NOTE"; value: number }
  | { type: "ERASE_CELL" }
  | { type: "TOGGLE_PENCIL" }
  | { type: "UNDO" }
  | { type: "TICK_TIMER" }
  | { type: "NEW_GAME"; board: Board; solution: Board; difficulty: Difficulty }
  | { type: "RESTART" }
  | { type: "RESTORE_STATE"; state: GameState }
```

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts, metadata
│   ├── page.tsx            # Game page
│   └── globals.css         # Tailwind imports, CSS variables
├── components/
│   ├── ui/                 # Reusable primitives
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── index.ts
│   └── game/               # Sudoku-specific components
│       ├── SudokuGrid.tsx
│       ├── SudokuCell.tsx
│       ├── NumberPad.tsx
│       ├── ActionBar.tsx
│       ├── GameHeader.tsx
│       ├── Timer.tsx
│       ├── NewGameDialog.tsx
│       ├── CompletionOverlay.tsx
│       └── Game.tsx         # Main game orchestrator
├── lib/
│   ├── utils.ts            # cn() utility
│   ├── sudoku-generator.ts
│   ├── sudoku-solver.ts
│   └── sudoku-utils.ts
├── hooks/
│   ├── useGame.ts          # Game state reducer + logic
│   ├── useTimer.ts         # Timer hook
│   └── useLocalStorage.ts  # Auto-save hook
└── types/
    └── sudoku.ts           # Game type definitions
```
