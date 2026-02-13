import { describe, expect, it } from 'vitest';
import { countSolutions, isValidPlacement, solve } from '@/lib/sudoku-solver';
import type { CellValue } from '@/types';

// A known easy puzzle with a unique solution
const EASY_PUZZLE: CellValue[][] = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];

const EASY_SOLUTION: CellValue[][] = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

// A known hard puzzle (27 givens)
const HARD_PUZZLE: CellValue[][] = [
  [8, null, null, null, null, null, null, null, null],
  [null, null, 3, 6, null, null, null, null, null],
  [null, 7, null, null, 9, null, 2, null, null],
  [null, 5, null, null, null, 7, null, null, null],
  [null, null, null, null, 4, 5, 7, null, null],
  [null, null, null, 1, null, null, null, 3, null],
  [null, null, 1, null, null, null, null, 6, 8],
  [null, null, 8, 5, null, null, null, 1, null],
  [null, 9, null, null, null, null, 4, null, null],
];

// A complete valid board (the EASY_SOLUTION)
const COMPLETE_BOARD: CellValue[][] = EASY_SOLUTION;

// An unsolvable board (two 5s in the first row)
const UNSOLVABLE_BOARD: CellValue[][] = [
  [5, 5, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
];

function emptyBoard(): CellValue[][] {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null));
}

/** Create a non-unique board by blanking two full rows from EASY_SOLUTION. */
function createNonUniqueBoard(): CellValue[][] {
  const board: CellValue[][] = EASY_SOLUTION.map((row) => [...row]);
  for (let c = 0; c < 9; c++) {
    board[0][c] = null;
    board[1][c] = null;
  }
  return board;
}

describe('isValidPlacement', () => {
  it('allows valid placement on empty board', () => {
    const board = emptyBoard();
    expect(isValidPlacement(board, { row: 0, col: 0 }, 5)).toBe(true);
  });

  it('detects row conflict', () => {
    const board = emptyBoard();
    board[0][0] = 5;
    expect(isValidPlacement(board, { row: 0, col: 8 }, 5)).toBe(false);
  });

  it('detects column conflict', () => {
    const board = emptyBoard();
    board[0][0] = 3;
    expect(isValidPlacement(board, { row: 8, col: 0 }, 3)).toBe(false);
  });

  it('detects box conflict', () => {
    const board = emptyBoard();
    board[0][0] = 7;
    expect(isValidPlacement(board, { row: 2, col: 2 }, 7)).toBe(false);
  });

  it('allows placement when same value is in different box', () => {
    const board = emptyBoard();
    board[0][0] = 5;
    expect(isValidPlacement(board, { row: 3, col: 3 }, 5)).toBe(true);
  });

  it('allows different values in same row', () => {
    const board = emptyBoard();
    board[0][0] = 1;
    expect(isValidPlacement(board, { row: 0, col: 1 }, 2)).toBe(true);
  });

  it('allows different values in same column', () => {
    const board = emptyBoard();
    board[0][0] = 1;
    expect(isValidPlacement(board, { row: 1, col: 0 }, 2)).toBe(true);
  });

  it('allows different values in same box', () => {
    const board = emptyBoard();
    board[0][0] = 1;
    expect(isValidPlacement(board, { row: 1, col: 1 }, 2)).toBe(true);
  });
});

describe('solve', () => {
  it('finds correct solution for a known easy puzzle', () => {
    const result = solve(EASY_PUZZLE);
    expect(result).not.toBeNull();
    expect(result).toEqual(EASY_SOLUTION);
  });

  it('finds a valid solution for a known hard puzzle', () => {
    const result = solve(HARD_PUZZLE);
    expect(result).not.toBeNull();

    // Verify all cells are filled
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        expect(result![r][c]).toBeGreaterThanOrEqual(1);
        expect(result![r][c]).toBeLessThanOrEqual(9);
      }
    }

    // Verify given cells are preserved
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (HARD_PUZZLE[r][c] !== null) {
          expect(result![r][c]).toBe(HARD_PUZZLE[r][c]);
        }
      }
    }
  });

  it('returns null for an unsolvable board', () => {
    const result = solve(UNSOLVABLE_BOARD);
    expect(result).toBeNull();
  });

  it('returns the board itself if already complete', () => {
    const result = solve(COMPLETE_BOARD);
    expect(result).not.toBeNull();
    expect(result).toEqual(COMPLETE_BOARD);
  });

  it('solves an empty board', () => {
    const result = solve(emptyBoard());
    expect(result).not.toBeNull();

    // Verify all cells filled
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        expect(result![r][c]).toBeGreaterThanOrEqual(1);
        expect(result![r][c]).toBeLessThanOrEqual(9);
      }
    }
  });

  it('does not mutate the input board', () => {
    const original = EASY_PUZZLE.map((row) => [...row]);
    solve(EASY_PUZZLE);
    expect(EASY_PUZZLE).toEqual(original);
  });

  it('completes in under 500ms for a typical puzzle', () => {
    const start = performance.now();
    solve(HARD_PUZZLE);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
  });
});

describe('countSolutions', () => {
  it('returns 1 for a unique puzzle (nearly complete board)', () => {
    // Use a board with just a few blanks for fast uniqueness verification
    const board: CellValue[][] = EASY_SOLUTION.map((row) => [...row]);
    // Blank 5 cells that are uniquely determined by remaining givens
    board[0][0] = null;
    board[0][1] = null;
    board[0][2] = null;
    board[0][3] = null;
    board[0][4] = null;
    const count = countSolutions(board, 2);
    expect(count).toBe(1);
  });

  it('returns more than 1 for a non-unique puzzle', () => {
    const count = countSolutions(createNonUniqueBoard(), 3);
    expect(count).toBeGreaterThan(1);
  });

  it('respects the limit parameter', () => {
    const count = countSolutions(createNonUniqueBoard(), 2);
    expect(count).toBe(2);
  });

  it('returns 0 for an unsolvable board', () => {
    const count = countSolutions(UNSOLVABLE_BOARD, 10);
    expect(count).toBe(0);
  });

  it('returns 1 for a complete board', () => {
    const count = countSolutions(COMPLETE_BOARD, 2);
    expect(count).toBe(1);
  });

  it('does not mutate the input board', () => {
    const board = createNonUniqueBoard();
    const original = board.map((row) => [...row]);
    countSolutions(board, 2);
    expect(board).toEqual(original);
  });
});
