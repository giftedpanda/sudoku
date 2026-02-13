import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  serializeGameState,
  deserializeGameState,
  saveGame,
  loadGame,
  clearSave,
} from '@/lib/storage';
import type { GameState, CellValue } from '@/types';

function makeGameState(overrides: Partial<GameState> = {}): GameState {
  const board = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: null as CellValue,
      isGiven: false,
      notes: new Set<number>(),
      isError: false,
    }))
  );
  const solution: CellValue[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => 1 as CellValue)
  );

  return {
    board,
    solution,
    difficulty: 'easy',
    selectedCell: null,
    isPencilMode: false,
    timer: 0,
    undoStack: [],
    isComplete: false,
    ...overrides,
  };
}

describe('serializeGameState', () => {
  it('converts Set<number> notes to number[]', () => {
    const state = makeGameState();
    state.board[0][0].notes = new Set([1, 3, 5]);

    const saved = serializeGameState(state);
    expect(saved.board[0][0].notes).toEqual([1, 3, 5]);
    expect(Array.isArray(saved.board[0][0].notes)).toBe(true);
  });

  it('preserves cell values', () => {
    const state = makeGameState();
    state.board[0][0].value = 5;
    state.board[0][0].isGiven = true;

    const saved = serializeGameState(state);
    expect(saved.board[0][0].value).toBe(5);
    expect(saved.board[0][0].isGiven).toBe(true);
  });

  it('serializes undo stack with Set to array conversion', () => {
    const state = makeGameState({
      undoStack: [
        {
          position: { row: 0, col: 0 },
          previousCell: {
            value: 3,
            isGiven: false,
            notes: new Set([2, 7]),
            isError: false,
          },
        },
      ],
    });

    const saved = serializeGameState(state);
    expect(saved.undoStack).toHaveLength(1);
    expect(saved.undoStack[0].previousCell.notes).toEqual([2, 7]);
    expect(Array.isArray(saved.undoStack[0].previousCell.notes)).toBe(true);
  });

  it('includes savedAt timestamp', () => {
    const state = makeGameState();
    const before = Date.now();
    const saved = serializeGameState(state);
    const after = Date.now();

    expect(saved.savedAt).toBeGreaterThanOrEqual(before);
    expect(saved.savedAt).toBeLessThanOrEqual(after);
  });

  it('preserves difficulty and timer', () => {
    const state = makeGameState({ difficulty: 'hard', timer: 125 });
    const saved = serializeGameState(state);

    expect(saved.difficulty).toBe('hard');
    expect(saved.timer).toBe(125);
  });

  it('preserves solution', () => {
    const state = makeGameState();
    const saved = serializeGameState(state);

    expect(saved.solution).toEqual(state.solution);
  });
});

describe('deserializeGameState', () => {
  it('converts number[] notes back to Set<number>', () => {
    const state = makeGameState();
    state.board[0][0].notes = new Set([1, 3, 5]);
    const saved = serializeGameState(state);

    const restored = deserializeGameState(saved);
    expect(restored.board[0][0].notes).toBeInstanceOf(Set);
    expect(restored.board[0][0].notes).toEqual(new Set([1, 3, 5]));
  });

  it('restores undo stack with Set notes', () => {
    const state = makeGameState({
      undoStack: [
        {
          position: { row: 1, col: 2 },
          previousCell: {
            value: null,
            isGiven: false,
            notes: new Set([4, 8]),
            isError: false,
          },
        },
      ],
    });
    const saved = serializeGameState(state);

    const restored = deserializeGameState(saved);
    expect(restored.undoStack[0].previousCell.notes).toBeInstanceOf(Set);
    expect(restored.undoStack[0].previousCell.notes).toEqual(new Set([4, 8]));
    expect(restored.undoStack[0].position).toEqual({ row: 1, col: 2 });
  });

  it('resets transient state fields', () => {
    const state = makeGameState({
      selectedCell: { row: 3, col: 4 },
      isPencilMode: true,
      isComplete: true,
    });
    const saved = serializeGameState(state);

    const restored = deserializeGameState(saved);
    expect(restored.selectedCell).toBeNull();
    expect(restored.isPencilMode).toBe(false);
    expect(restored.isComplete).toBe(false);
  });

  it('restores timer value', () => {
    const state = makeGameState({ timer: 300 });
    const saved = serializeGameState(state);

    const restored = deserializeGameState(saved);
    expect(restored.timer).toBe(300);
  });
});

describe('round-trip: serialize then deserialize', () => {
  it('produces equivalent state', () => {
    const state = makeGameState({ timer: 42, difficulty: 'medium' });
    state.board[0][0].value = 5;
    state.board[0][0].isGiven = true;
    state.board[3][3].notes = new Set([1, 2, 9]);
    state.board[8][8].isError = true;

    const restored = deserializeGameState(serializeGameState(state));

    expect(restored.board[0][0].value).toBe(5);
    expect(restored.board[0][0].isGiven).toBe(true);
    expect(restored.board[3][3].notes).toEqual(new Set([1, 2, 9]));
    expect(restored.board[8][8].isError).toBe(true);
    expect(restored.timer).toBe(42);
    expect(restored.difficulty).toBe('medium');
    expect(restored.solution).toEqual(state.solution);
  });

  it('preserves undo stack through round-trip', () => {
    const state = makeGameState({
      undoStack: [
        {
          position: { row: 0, col: 0 },
          previousCell: {
            value: 1,
            isGiven: false,
            notes: new Set([3, 6]),
            isError: true,
          },
        },
        {
          position: { row: 5, col: 7 },
          previousCell: {
            value: null,
            isGiven: false,
            notes: new Set(),
            isError: false,
          },
        },
      ],
    });

    const restored = deserializeGameState(serializeGameState(state));

    expect(restored.undoStack).toHaveLength(2);
    expect(restored.undoStack[0].previousCell.value).toBe(1);
    expect(restored.undoStack[0].previousCell.notes).toEqual(new Set([3, 6]));
    expect(restored.undoStack[1].position).toEqual({ row: 5, col: 7 });
    expect(restored.undoStack[1].previousCell.notes).toEqual(new Set());
  });

  it('handles empty notes through round-trip', () => {
    const state = makeGameState();

    const restored = deserializeGameState(serializeGameState(state));

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        expect(restored.board[r][c].notes).toBeInstanceOf(Set);
        expect(restored.board[r][c].notes.size).toBe(0);
      }
    }
  });
});

describe('saveGame', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('writes serialized state to localStorage', () => {
    const state = makeGameState({ timer: 99 });
    saveGame(state);

    const raw = localStorage.getItem('sudoku-save');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed.timer).toBe(99);
  });

  it('handles localStorage being disabled', () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('localStorage disabled');
    });

    expect(() => saveGame(makeGameState())).not.toThrow();

    localStorage.setItem = originalSetItem;
  });

  it('handles localStorage quota exceeded', () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new DOMException('quota exceeded', 'QuotaExceededError');
    });

    expect(() => saveGame(makeGameState())).not.toThrow();

    localStorage.setItem = originalSetItem;
  });
});

describe('loadGame', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when localStorage is empty', () => {
    expect(loadGame()).toBeNull();
  });

  it('returns null when data is corrupted', () => {
    localStorage.setItem('sudoku-save', 'not valid json{{{');
    expect(loadGame()).toBeNull();
  });

  it('returns deserialized GameState when valid save exists', () => {
    const state = makeGameState({ timer: 55, difficulty: 'hard' });
    saveGame(state);

    const restored = loadGame();
    expect(restored).not.toBeNull();
    expect(restored!.timer).toBe(55);
    expect(restored!.difficulty).toBe('hard');
  });

  it('handles localStorage being disabled', () => {
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn(() => {
      throw new Error('localStorage disabled');
    });

    expect(loadGame()).toBeNull();

    localStorage.getItem = originalGetItem;
  });
});

describe('clearSave', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removes saved game from localStorage', () => {
    const state = makeGameState();
    saveGame(state);
    expect(localStorage.getItem('sudoku-save')).not.toBeNull();

    clearSave();
    expect(localStorage.getItem('sudoku-save')).toBeNull();
  });

  it('does not throw when no save exists', () => {
    expect(() => clearSave()).not.toThrow();
  });

  it('handles localStorage being disabled', () => {
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = vi.fn(() => {
      throw new Error('localStorage disabled');
    });

    expect(() => clearSave()).not.toThrow();

    localStorage.removeItem = originalRemoveItem;
  });
});
