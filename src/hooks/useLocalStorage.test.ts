import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import * as storage from '@/lib/storage';
import type { GameState, CellValue } from '@/types';

vi.mock('@/lib/storage', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(),
  clearSave: vi.fn(),
}));

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

describe('useLocalStorage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces saves', () => {
    const state = makeGameState({ timer: 10 });
    renderHook(() => useLocalStorage(state, 500));

    expect(storage.saveGame).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(storage.saveGame).toHaveBeenCalledOnce();
    expect(storage.saveGame).toHaveBeenCalledWith(state);
  });

  it('resets debounce timer on state change', () => {
    const state1 = makeGameState({ timer: 10 });
    const state2 = makeGameState({ timer: 20 });

    const { rerender } = renderHook(
      ({ state }) => useLocalStorage(state, 500),
      { initialProps: { state: state1 } }
    );

    vi.advanceTimersByTime(400);
    expect(storage.saveGame).not.toHaveBeenCalled();

    rerender({ state: state2 });

    vi.advanceTimersByTime(400);
    expect(storage.saveGame).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(storage.saveGame).toHaveBeenCalledOnce();
    expect(storage.saveGame).toHaveBeenCalledWith(state2);
  });

  it('does not save when state is null', () => {
    renderHook(() => useLocalStorage(null, 500));

    vi.advanceTimersByTime(1000);
    expect(storage.saveGame).not.toHaveBeenCalled();
  });

  it('returns loadGame and clearSave functions', () => {
    const state = makeGameState();
    const { result } = renderHook(() => useLocalStorage(state, 500));

    expect(result.current.loadGame).toBe(storage.loadGame);
    expect(result.current.clearSave).toBe(storage.clearSave);
  });

  it('uses default debounce of 500ms', () => {
    const state = makeGameState();
    renderHook(() => useLocalStorage(state));

    vi.advanceTimersByTime(499);
    expect(storage.saveGame).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(storage.saveGame).toHaveBeenCalledOnce();
  });

  it('flushes save on unmount if pending', () => {
    const state = makeGameState({ timer: 42 });
    const { unmount } = renderHook(() => useLocalStorage(state, 500));

    vi.advanceTimersByTime(200); // pending save
    expect(storage.saveGame).not.toHaveBeenCalled();

    unmount();
    expect(storage.saveGame).toHaveBeenCalledWith(state);
  });
});
