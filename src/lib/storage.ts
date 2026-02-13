import type { GameState, SavedGame } from '@/types';

const STORAGE_KEY = 'sudoku-save';

export function serializeGameState(state: GameState): SavedGame {
  return {
    board: state.board.map(row =>
      row.map(cell => ({
        ...cell,
        notes: Array.from(cell.notes),
      }))
    ),
    solution: state.solution,
    difficulty: state.difficulty,
    timer: state.timer,
    undoStack: state.undoStack.map(entry => ({
      position: entry.position,
      previousCell: {
        ...entry.previousCell,
        notes: Array.from(entry.previousCell.notes),
      },
    })),
    savedAt: Date.now(),
  };
}

export function deserializeGameState(saved: SavedGame): GameState {
  return {
    board: saved.board.map(row =>
      row.map(cell => ({
        ...cell,
        notes: new Set(cell.notes),
      }))
    ),
    solution: saved.solution,
    difficulty: saved.difficulty,
    selectedCell: null,
    isPencilMode: false,
    timer: saved.timer,
    undoStack: saved.undoStack.map(entry => ({
      position: entry.position,
      previousCell: {
        ...entry.previousCell,
        notes: new Set(entry.previousCell.notes),
      },
    })),
    isComplete: false,
  };
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(serializeGameState(state))
    );
  } catch {
    // localStorage full or disabled — silently fail
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return deserializeGameState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}
