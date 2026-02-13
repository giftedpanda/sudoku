import { useEffect, useRef } from 'react';
import type { GameState } from '@/types';
import { saveGame, loadGame, clearSave } from '@/lib/storage';

const DEFAULT_DEBOUNCE_MS = 500;

export function useLocalStorage(
  state: GameState | null,
  debounceMs: number = DEFAULT_DEBOUNCE_MS
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!state) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      saveGame(state);
      timerRef.current = null;
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state, debounceMs]);

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        if (state) {
          saveGame(state);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loadGame, clearSave };
}
