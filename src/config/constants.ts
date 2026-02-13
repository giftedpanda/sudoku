import type { Difficulty } from '@/types';

export const GRID_SIZE = 9;
export const BOX_SIZE = 3;

export const DIFFICULTY_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 36, max: 40 },
  medium: { min: 30, max: 35 },
  hard: { min: 24, max: 29 },
};
