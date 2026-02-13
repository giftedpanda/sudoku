# Sudoku Game — Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- **Deliver a polished, browser-based Sudoku game** that players can enjoy instantly without downloads, accounts, or ads
- **Provide a range of difficulty levels** (Easy, Medium, Hard) so both casual players and enthusiasts find appropriate challenges
- **Create an intuitive, responsive interface** that works seamlessly on mobile phones, tablets, and desktops

### Background Context

Sudoku is a globally popular logic puzzle with a massive audience spanning all age groups. While many web-based Sudoku games exist, the market is split between dated interfaces (websudoku.com) and ad-heavy experiences (sudoku.com). Players frequently express frustration with cluttered UIs, poor mobile support, and slow performance.

This project builds a modern Sudoku web app using Next.js, TypeScript, and Tailwind CSS. All game logic — puzzle generation, validation, and state management — runs entirely client-side with no backend dependencies. Game progress persists via localStorage, ensuring players never lose their work. The focus is on speed, simplicity, and a delightful user experience.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-02-13 | 1.0 | Initial PRD | Product Owner |

---

## Requirements

### Functional Requirements

- **FR1**: The system shall generate valid Sudoku puzzles with exactly one solution at three difficulty levels: Easy (~38-45 given cells), Medium (~30-37 given cells), and Hard (~22-29 given cells)
- **FR2**: The system shall display a 9x9 Sudoku grid with clearly delineated 3x3 boxes, distinguishing pre-filled (given) cells from player-editable cells
- **FR3**: The system shall allow players to select any editable cell by clicking/tapping it, with clear visual indication of the selected cell
- **FR4**: The system shall allow players to enter digits 1-9 into selected editable cells via on-screen number pad and keyboard input
- **FR5**: The system shall provide a pencil/notes mode that allows players to toggle candidate numbers in cells without committing a final answer
- **FR6**: The system shall highlight conflicting entries in real-time when a player enters a number that violates Sudoku rules (duplicate in row, column, or 3x3 box)
- **FR7**: The system shall provide an undo function that reverts the most recent cell change, supporting multiple sequential undos
- **FR8**: The system shall display an elapsed-time timer that starts when a puzzle begins and pauses when the game is not active
- **FR9**: The system shall detect when a puzzle is correctly completed and display a congratulatory message with the completion time
- **FR10**: The system shall allow players to start a new game at any difficulty level at any time
- **FR11**: The system shall allow players to restart the current puzzle, clearing all player entries while keeping given cells
- **FR12**: The system shall automatically save the current game state (board, timer, difficulty) to localStorage on every change
- **FR13**: The system shall restore the saved game state when the player returns to the app
- **FR14**: The system shall provide an erase/delete function to clear the value from the selected editable cell
- **FR15**: The system shall highlight all cells in the same row, column, and 3x3 box as the selected cell to aid solving
- **FR16**: The system shall highlight all cells containing the same number as the selected cell's value
- **FR17**: The system shall disable number input buttons for digits that already appear 9 times on the board

### Non-Functional Requirements

- **NFR1**: Page load (First Contentful Paint) shall be under 2 seconds on a simulated 3G connection
- **NFR2**: Puzzle generation shall complete in under 500ms on a mid-range mobile device
- **NFR3**: All user interactions (cell selection, number entry) shall respond within 50ms
- **NFR4**: The application shall score 90+ on Lighthouse Performance audit
- **NFR5**: The application shall score 95+ on Lighthouse Accessibility audit
- **NFR6**: The application shall be fully keyboard-navigable (arrow keys to move between cells, number keys to enter values)
- **NFR7**: The application shall be usable on screens as narrow as 320px
- **NFR8**: The application shall function offline after initial load (static export, no API calls)
- **NFR9**: The game grid shall be navigable by screen readers with appropriate ARIA labels

---

## User Interface Design Goals

### Overall UX Vision
A minimal, distraction-free interface where the puzzle grid is the hero element. The design should feel calm and focused — closer to a quality newspaper puzzle page than a flashy mobile game. Clean typography, generous spacing, and subtle color cues guide the player without overwhelming.

### Key Interaction Paradigms
- **Click/Tap to Select**: Tap a cell, then tap a number to fill it
- **Keyboard Input**: Use arrow keys to navigate, number keys to enter values, toggle pencil mode with a shortcut key
- **Mode Toggle**: Clear toggle between "pen" (final answer) and "pencil" (notes) modes
- **Visual Feedback**: Selected cell, related cells (same row/col/box), matching numbers, and conflicts are all indicated through distinct background colors

### Core Screens and Views
1. **Game Screen** (primary): 9x9 grid, number pad, action buttons (undo, erase, pencil toggle, new game), timer, difficulty indicator
2. **New Game Dialog**: Difficulty selection (Easy, Medium, Hard) with brief descriptions
3. **Completion Overlay**: Congratulations message, completion time, option to start a new game

### Accessibility
- Full keyboard navigation with visible focus indicators
- ARIA labels on grid cells (e.g., "Row 3, Column 5, value 7" or "Row 3, Column 5, empty")
- Sufficient color contrast ratios (WCAG AA)
- Conflict indicators use both color and icon/pattern (not color alone)
- Respects prefers-reduced-motion for animations

### Branding
- Clean, modern aesthetic with a neutral color palette
- Accent color for selections and interactive elements
- Monospace or tabular-lining numerals for the grid to ensure uniform cell sizing

### Target Platforms
- Mobile browsers (iOS Safari, Android Chrome) — primary
- Desktop browsers (Chrome, Firefox, Safari, Edge) — primary
- Tablet browsers — supported via responsive layout

---

## Technical Assumptions

### Repository Structure
Monorepo — single repository with Next.js app, shared types, and configuration.

### Standard Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js 15+ (App Router) | Full-stack React framework with static export |
| Language | TypeScript 5+ | Type safety across all game logic |
| Styling | Tailwind CSS 4+ | Utility-first CSS for rapid UI development |
| Testing | vitest, @testing-library/react | Unit + component tests |
| Package Manager | pnpm | Fast, disk-efficient package management |

### Additional Technical Notes
- Puzzle generation and solving algorithms implemented in TypeScript (no external puzzle library)
- Game state managed with React useState/useReducer — no external state management library needed
- Static export (`output: 'export'`) for deployment — no server-side rendering required
- localStorage for game persistence — no database

### Testing Requirements
- Unit tests: vitest — for puzzle generation, validation, and game logic
- Component tests: @testing-library/react — for grid rendering, cell interaction, and game flow

---

## Epic List

| Epic | Title | Description | Stories |
|------|-------|-------------|---------|
| 1 | Project Foundation & Puzzle Engine | Scaffold the project, implement Sudoku puzzle generation and validation, render the basic grid | 1.1 – 1.5 |
| 2 | Interactive Gameplay | Cell selection, number input, pencil mode, error highlighting, undo, timer | 2.1 – 2.7 |
| 3 | Game Management & Polish | Difficulty selection, new game flow, auto-save/restore, completion detection, responsive design, accessibility | 3.1 – 3.7 |

---

## Epic Details

### Epic 1: Project Foundation & Puzzle Engine

> Establish the project scaffolding, implement the core Sudoku engine (generation + validation), and render a basic interactive grid.

#### Story 1.1: Project Scaffolding

**Description**: Initialize the Next.js project with TypeScript, Tailwind CSS, vitest, and testing-library. Configure the project for static export. Set up the basic folder structure.

**Acceptance Criteria**:
- Next.js 15+ project created with App Router and TypeScript
- Tailwind CSS 4+ configured and working
- vitest and @testing-library/react installed and configured
- `pnpm dev` starts the development server without errors
- `pnpm build` produces a static export without errors
- `pnpm test` runs vitest without errors (even if no tests yet)
- Folder structure includes: `src/app/`, `src/components/`, `src/lib/`, `src/types/`
- A placeholder home page renders with "Sudoku" title

#### Story 1.2: Sudoku Data Types and Board Utilities

**Description**: Define TypeScript types for the Sudoku domain (cell, board, difficulty, game state) and implement board utility functions (create empty board, get row/column/box peers, check if a value is valid in a position).

**Acceptance Criteria**:
- Types defined: `Cell` (value, isGiven, notes, isError), `Board` (9x9 grid of Cells), `Difficulty` enum (Easy, Medium, Hard), `GameState` (board, difficulty, timer, selectedCell, isPencilMode)
- Utility function `getRow(board, row)` returns all 9 cells in a row
- Utility function `getColumn(board, col)` returns all 9 cells in a column
- Utility function `getBox(board, row, col)` returns all 9 cells in the 3x3 box
- Utility function `isValidPlacement(board, row, col, value)` returns boolean
- All utility functions have unit tests with at least 3 test cases each
- Types are exported from `src/types/` for use across the app

#### Story 1.3: Puzzle Generator

**Description**: Implement a Sudoku puzzle generator that creates valid puzzles with exactly one solution. The generator should support three difficulty levels by varying the number of given cells.

**Acceptance Criteria**:
- Function `generatePuzzle(difficulty: Difficulty)` returns a `Board` with pre-filled given cells
- Easy puzzles have 38-45 given cells
- Medium puzzles have 30-37 given cells
- Hard puzzles have 22-29 given cells
- Every generated puzzle has exactly one solution (validated by solver)
- Puzzle generation completes in under 500ms (tested with performance timing)
- Unit tests verify: correct number of givens per difficulty, puzzle validity, uniqueness of solution
- Generator is implemented in `src/lib/sudoku-generator.ts`

#### Story 1.4: Puzzle Solver and Validator

**Description**: Implement a Sudoku solver (backtracking algorithm) used to validate puzzle uniqueness and verify completed boards. Implement a board completion checker.

**Acceptance Criteria**:
- Function `solve(board)` returns the solved board or null if unsolvable
- Function `hasUniqueSolution(board)` returns boolean (attempts to find more than one solution)
- Function `isBoardComplete(board)` returns true only when all cells are filled with valid values
- Solver handles empty boards and partially filled boards
- Unit tests verify: solving a known puzzle, detecting invalid boards, detecting multiple-solution boards, completion checking
- Solver is implemented in `src/lib/sudoku-solver.ts`

#### Story 1.5: Basic Grid Rendering

**Description**: Create the Sudoku grid component that renders a 9x9 board with visual distinction between 3x3 boxes and between given vs. editable cells. No interaction yet — display only.

**Acceptance Criteria**:
- `SudokuGrid` component renders a 9x9 grid from a `Board` prop
- 3x3 box boundaries are visually distinct (thicker borders or spacing)
- Given cells display their value in a bold/distinct style
- Empty editable cells are visually empty
- Grid scales appropriately within its container
- Component test verifies: correct number of cells rendered (81), given cells show values, box boundaries are present
- Component is implemented in `src/components/SudokuGrid.tsx`

---

### Epic 2: Interactive Gameplay

> Make the grid fully interactive with cell selection, number entry, pencil notes, error detection, undo capability, and a game timer.

#### Story 2.1: Cell Selection and Highlighting

**Description**: Implement cell selection by click/tap with visual highlighting of the selected cell, its row, column, and 3x3 box peers, and all cells with the same number value.

**Acceptance Criteria**:
- Clicking/tapping an editable or given cell selects it with a distinct background color
- All cells in the same row, column, and 3x3 box are highlighted with a subtle background color
- All cells containing the same number as the selected cell are highlighted with a matching-number color
- Clicking outside the grid or on the selected cell deselects it
- Only one cell can be selected at a time
- Component test verifies: clicking a cell applies selected style, peer cells receive highlight style

#### Story 2.2: Number Input (Number Pad and Keyboard)

**Description**: Allow players to enter numbers into selected editable cells via an on-screen number pad (buttons 1-9) and via keyboard number keys. Given cells cannot be edited.

**Acceptance Criteria**:
- On-screen number pad with buttons 1-9 is displayed below the grid
- Clicking a number pad button fills the selected editable cell with that digit
- Pressing keyboard keys 1-9 fills the selected editable cell with that digit
- Given cells cannot be modified (input is ignored)
- Entering a number replaces the previous value in that cell
- Number pad buttons for digits appearing 9 times on the board are visually disabled
- Component test verifies: number entry into editable cell, given cell rejection, number pad disable state

#### Story 2.3: Erase and Cell Clearing

**Description**: Implement erase functionality to clear the value from the selected editable cell, accessible via an erase button and keyboard (Backspace/Delete).

**Acceptance Criteria**:
- Erase button is displayed in the action bar
- Clicking erase clears the selected editable cell's value and notes
- Pressing Backspace or Delete key clears the selected editable cell
- Erasing a given cell is not possible (action is ignored)
- Erasing an already-empty cell has no effect (no error)
- Component test verifies: erase clears cell value, given cells are protected

#### Story 2.4: Pencil/Notes Mode

**Description**: Implement a pencil mode toggle that allows players to enter candidate numbers as small notes within cells instead of committing final answers.

**Acceptance Criteria**:
- Pencil mode toggle button is displayed in the action bar with clear on/off state
- Keyboard shortcut (P key) toggles pencil mode
- When pencil mode is active, entering a number adds/removes it from the cell's notes set (toggle behavior)
- Notes are displayed as small numbers within the cell (arranged in a 3x3 mini-grid pattern)
- Entering a final value (with pencil mode off) clears any notes in that cell
- When a number is placed as a final value, that number is automatically removed from notes of all peer cells (same row, column, box)
- Component test verifies: pencil toggle state, notes display, note toggle behavior, auto-removal of notes

#### Story 2.5: Error Highlighting

**Description**: Implement real-time conflict detection that highlights cells when a player's entry violates Sudoku rules (duplicate in row, column, or 3x3 box).

**Acceptance Criteria**:
- When a player enters a number that conflicts with another cell in the same row, column, or 3x3 box, both conflicting cells are marked with an error indicator
- Error indicator uses both color (red background/text) and a visual marker (not color alone, for accessibility)
- Errors update in real-time as numbers are entered or erased
- Given cells that conflict with a player's entry are also marked
- Removing the conflicting value clears the error state
- Component test verifies: conflict detection in row, column, and box; error clearing on removal

#### Story 2.6: Undo Functionality

**Description**: Implement an undo stack that allows players to revert their most recent cell changes, supporting multiple sequential undos back to the puzzle's initial state.

**Acceptance Criteria**:
- Undo button is displayed in the action bar
- Keyboard shortcut (Ctrl+Z / Cmd+Z) triggers undo
- Each number entry, erase, or note change pushes to the undo stack
- Undo reverts the cell to its previous state (value and notes)
- Multiple undos can be performed sequentially
- Undo button is disabled when no actions are available to undo
- Component test verifies: undo reverts last action, multiple undos work, undo disabled when empty

#### Story 2.7: Game Timer

**Description**: Implement an elapsed-time timer that starts when a puzzle begins, displays in MM:SS format, and can be included in the completion message.

**Acceptance Criteria**:
- Timer displays elapsed time in MM:SS format (or H:MM:SS if over 1 hour)
- Timer starts automatically when a new puzzle begins
- Timer value is preserved across page refreshes (via saved game state)
- Timer is displayed prominently near the grid
- Timer updates every second
- Component test verifies: timer renders in correct format, timer increments

---

### Epic 3: Game Management & Polish

> Complete the game experience with difficulty selection, new game flow, auto-save, completion detection, responsive design, and accessibility.

#### Story 3.1: Difficulty Selection and New Game Flow

**Description**: Implement the new game flow: a dialog/modal where the player selects a difficulty level (Easy, Medium, Hard) and starts a fresh puzzle. Also provide a "Restart" option to reset the current puzzle.

**Acceptance Criteria**:
- "New Game" button is accessible from the game screen
- Clicking "New Game" opens a dialog with difficulty options: Easy, Medium, Hard
- Each difficulty option includes a brief description (e.g., "Easy — Great for beginners")
- Selecting a difficulty generates a new puzzle and closes the dialog
- "Restart" button resets the current puzzle to its initial state (clears all player entries, resets timer)
- If a game is in progress, "New Game" shows a confirmation before discarding it
- On first visit with no saved game, the difficulty selection dialog is shown automatically
- Component test verifies: dialog opens/closes, difficulty selection generates new puzzle, restart clears entries

#### Story 3.2: Auto-Save and Game Restoration

**Description**: Implement automatic saving of game state to localStorage on every change, and restore the game state when the player returns.

**Acceptance Criteria**:
- Game state (board, difficulty, timer, undo stack) is saved to localStorage after every player action
- On app load, if a saved game exists, it is restored automatically
- On app load, if no saved game exists, the new game dialog is shown
- Saving is debounced to avoid excessive writes (no more than once per 500ms)
- Invalid or corrupted saved data is handled gracefully (start new game instead)
- Unit test verifies: state serialization/deserialization, corruption handling

#### Story 3.3: Puzzle Completion Detection and Celebration

**Description**: Detect when a puzzle is correctly and fully solved. Display a congratulatory overlay with the completion time and an option to start a new game.

**Acceptance Criteria**:
- Completion is detected automatically when all 81 cells are filled with valid values and no conflicts exist
- A congratulatory overlay/modal is displayed with: "Puzzle Complete!" message, difficulty level, completion time
- The overlay includes a "New Game" button that opens difficulty selection
- The timer stops when the puzzle is completed
- The saved game is cleared upon completion (so next visit starts fresh)
- A subtle animation or visual flourish accompanies completion (confetti or similar, respecting prefers-reduced-motion)
- Component test verifies: completion detection triggers overlay, timer stops, new game option works

#### Story 3.4: Responsive Layout — Mobile

**Description**: Optimize the game layout for mobile screens (320px-768px). The grid, number pad, and action buttons must all be usable without horizontal scrolling.

**Acceptance Criteria**:
- Grid fills available width on screens 320px-768px with appropriate padding
- Grid cells are large enough to tap accurately (minimum 36px x 36px touch target)
- Number pad is displayed as a horizontal row of 9 buttons below the grid
- Action buttons (undo, erase, pencil, new game) are accessible and adequately sized
- Timer and difficulty indicator are visible without scrolling
- No horizontal scrolling at any supported width
- Visual test at 320px, 375px, and 768px breakpoints

#### Story 3.5: Responsive Layout — Desktop

**Description**: Optimize the game layout for desktop screens (769px+). Use available space effectively without making the grid excessively large.

**Acceptance Criteria**:
- Grid is centered on the page with a maximum width (e.g., 540px)
- Number pad and action buttons are positioned conveniently near the grid
- Adequate whitespace around the grid for a calm, focused feel
- Layout adjusts smoothly between 769px and 1440px+
- The overall page design looks intentional on wide screens (no awkward stretching)

#### Story 3.6: Keyboard Navigation

**Description**: Implement full keyboard navigation for the Sudoku grid and game controls, enabling play without a mouse.

**Acceptance Criteria**:
- Arrow keys move cell selection in the corresponding direction
- Arrow navigation wraps at grid boundaries (right edge to next row, etc.) or stops at edges
- Tab key moves focus between major UI sections (grid, number pad, action buttons)
- Enter or Space on a number pad button enters that number
- All interactive elements have visible focus indicators
- Keyboard shortcuts: 1-9 (enter number), P (toggle pencil), Backspace/Delete (erase), Ctrl/Cmd+Z (undo)
- Component test verifies: arrow key navigation, focus management

#### Story 3.7: Accessibility and Screen Reader Support

**Description**: Add ARIA attributes and screen reader support to make the game playable for users relying on assistive technology.

**Acceptance Criteria**:
- Grid uses `role="grid"` with rows using `role="row"` and cells using `role="gridcell"`
- Each cell has an `aria-label` describing its position and state (e.g., "Row 3, Column 5, value 7" or "Row 3, Column 5, empty, notes 2 4 8")
- Given cells are indicated via `aria-readonly="true"`
- Selected cell state is conveyed via `aria-selected`
- Error states are conveyed via `aria-invalid` and announced to screen readers
- Pencil mode state is announced when toggled
- Game completion is announced via an ARIA live region
- Color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI components)
- All animations respect `prefers-reduced-motion`
- Manual testing with VoiceOver (macOS) confirms basic usability

---

## Story Dependency Map

```
1.1 (Scaffolding)
 └── 1.2 (Types & Utilities)
      ├── 1.4 (Solver & Validator)
      │    └── 1.3 (Generator) [needs solver for uniqueness check]
      │         └── 1.5 (Basic Grid)
      │              ├── 2.1 (Cell Selection)
      │              │    ├── 2.2 (Number Input)
      │              │    │    ├── 2.3 (Erase)
      │              │    │    ├── 2.4 (Pencil Mode)
      │              │    │    ├── 2.5 (Error Highlighting)
      │              │    │    └── 2.6 (Undo)
      │              │    └── 2.7 (Timer)
      │              └── 3.4 (Mobile Layout)
      │              └── 3.5 (Desktop Layout)
      └── 3.2 (Auto-Save) [needs types for serialization]

2.2 + 2.3 + 2.4 + 2.5 + 2.6 + 2.7 ──> 3.1 (New Game Flow)
3.1 + 3.2 ──> 3.3 (Completion)
2.1 ──> 3.6 (Keyboard Nav)
3.6 ──> 3.7 (Accessibility)
```
