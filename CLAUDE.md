# Sudoku — Claude Code Instructions

## Project Overview
A modern, client-side browser-based Sudoku puzzle game. Single-page static export, no backend.

## Tech Stack
- Next.js 16 (App Router, static export via `output: "export"`)
- TypeScript 5 (strict mode)
- React 19
- Tailwind CSS 4 (CSS-based config with `@theme` blocks, no tailwind.config.ts)
- Vitest + @testing-library/react (testing)
- pnpm (package manager)

## Commands
- `pnpm dev` — Start dev server
- `pnpm build` — Production build (static export to `out/`)
- `pnpm test` — Run test suite
- `pnpm test:watch` — Run tests in watch mode
- `pnpm lint` — Run ESLint
- `pnpm type-check` — Run TypeScript type checker

## Project Structure
```
src/
  app/           — Next.js App Router (layout, page, globals.css)
  components/
    ui/          — Reusable primitives (Button, Dialog, Badge)
    game/        — Game-specific components (SudokuGrid, SudokuCell, etc.)
  hooks/         — React hooks (useGameState, useTimer, useLocalStorage)
  lib/           — Pure logic (sudoku-generator, sudoku-solver, board-utils, storage, utils)
  types/         — TypeScript type definitions
  config/        — Constants and configuration
```

## Architecture Notes
- All game state is managed via `useReducer` in `useGameState` hook
- Puzzle engine (generator, solver, board-utils) operates on raw `CellValue[][]` arrays
- UI components use `Board` type (array of `Cell` objects with notes as `Set<number>`)
- localStorage serialization converts `Set<number>` to `number[]` via `SerializedCell`

## Coding Conventions
- **Components:** PascalCase files and names (`SudokuGrid.tsx`)
- **Hooks:** camelCase with `use` prefix (`useGameState.ts`)
- **Lib files:** kebab-case (`board-utils.ts`)
- **Constants:** SCREAMING_SNAKE_CASE (`GRID_SIZE`, `DIFFICULTY_RANGES`)
- **Tests:** Adjacent to source (`*.test.ts` / `*.test.tsx`)
- **Commits:** Conventional commits (`feat:`, `fix:`, `test:`, `chore:`, `docs:`)

## Key Patterns
- Use `cn()` from `@/lib/utils` for conditional class merging
- Use `cva` from `class-variance-authority` for component variants
- Components use `forwardRef` when refs may be needed
- Game reducer is immutable — always create new objects, never mutate
- `cloneBoard()` for deep copying boards before modification
- localStorage operations wrap in try/catch

## Testing
- Unit tests for puzzle engine: 90%+ coverage target
- Component tests for UI interactions
- Use `vitest` with `jsdom` environment
- Use `@testing-library/react` for component tests

## Dependencies (runtime only)
- next, react, react-dom
- clsx, tailwind-merge (for `cn()`)
- class-variance-authority (for component variants)

No Firebase, Stripe, Resend, OpenAI, or Capacitor.
