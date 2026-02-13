import { describe, expect, it } from 'vitest';
import { generateCompletedBoard, generatePuzzle } from '@/lib/sudoku-generator';
import { isValidPlacement, countSolutions, solve } from '@/lib/sudoku-solver';
import { GRID_SIZE, DIFFICULTY_RANGES } from '@/config/constants';
import type { CellValue, Difficulty } from '@/types';

function isValidCompletedBoard(board: CellValue[][]): boolean {
  if (board.length !== GRID_SIZE) return false;
  for (let row = 0; row < GRID_SIZE; row++) {
    if (board[row].length !== GRID_SIZE) return false;
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = board[row][col];
      if (value === null || value < 1 || value > 9) return false;

      // Temporarily remove value and check placement
      board[row][col] = null;
      const valid = isValidPlacement(board, { row, col }, value);
      board[row][col] = value;
      if (!valid) return false;
    }
  }
  return true;
}

function countGivens(board: CellValue[][]): number {
  let count = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] !== null) count++;
    }
  }
  return count;
}

describe('generateCompletedBoard', () => {
  it('returns a 9x9 board', () => {
    const board = generateCompletedBoard();
    expect(board).toHaveLength(GRID_SIZE);
    for (const row of board) {
      expect(row).toHaveLength(GRID_SIZE);
    }
  });

  it('fills all cells with values 1-9', () => {
    const board = generateCompletedBoard();
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        expect(board[row][col]).toBeGreaterThanOrEqual(1);
        expect(board[row][col]).toBeLessThanOrEqual(9);
      }
    }
  });

  it('produces a valid sudoku solution', () => {
    const board = generateCompletedBoard();
    expect(isValidCompletedBoard(board)).toBe(true);
  });

  it('each row contains digits 1-9 exactly once', () => {
    const board = generateCompletedBoard();
    for (let row = 0; row < GRID_SIZE; row++) {
      const values = new Set(board[row]);
      expect(values.size).toBe(9);
      for (let n = 1; n <= 9; n++) {
        expect(values.has(n as CellValue)).toBe(true);
      }
    }
  });

  it('each column contains digits 1-9 exactly once', () => {
    const board = generateCompletedBoard();
    for (let col = 0; col < GRID_SIZE; col++) {
      const values = new Set<CellValue>();
      for (let row = 0; row < GRID_SIZE; row++) {
        values.add(board[row][col]);
      }
      expect(values.size).toBe(9);
    }
  });

  it('each 3x3 box contains digits 1-9 exactly once', () => {
    const board = generateCompletedBoard();
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const values = new Set<CellValue>();
        for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
          for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
            values.add(board[r][c]);
          }
        }
        expect(values.size).toBe(9);
      }
    }
  });

  it('generates different boards on successive calls', () => {
    const board1 = generateCompletedBoard();
    const board2 = generateCompletedBoard();
    // Extremely unlikely two random boards are identical
    const flat1 = board1.flat().join(',');
    const flat2 = board2.flat().join(',');
    expect(flat1).not.toBe(flat2);
  });
});

describe('generatePuzzle', () => {
  it('returns both puzzle and solution', () => {
    const result = generatePuzzle('easy');
    expect(result).toHaveProperty('puzzle');
    expect(result).toHaveProperty('solution');
    expect(result.puzzle).toHaveLength(GRID_SIZE);
    expect(result.solution).toHaveLength(GRID_SIZE);
  });

  it('solution is a valid completed board', () => {
    const { solution } = generatePuzzle('easy');
    expect(isValidCompletedBoard(solution)).toBe(true);
  });

  it('puzzle has null cells (is not fully filled)', () => {
    const { puzzle } = generatePuzzle('easy');
    const nullCells = puzzle.flat().filter(v => v === null);
    expect(nullCells.length).toBeGreaterThan(0);
  });

  it('puzzle given cells match the solution', () => {
    const { puzzle, solution } = generatePuzzle('medium');
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (puzzle[row][col] !== null) {
          expect(puzzle[row][col]).toBe(solution[row][col]);
        }
      }
    }
  });

  it('puzzle has exactly one solution', () => {
    const { puzzle } = generatePuzzle('easy');
    expect(countSolutions(puzzle, 2)).toBe(1);
  });

  it('puzzle is solvable and solution matches', () => {
    const { puzzle, solution } = generatePuzzle('medium');
    const solved = solve(puzzle);
    expect(solved).not.toBeNull();
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        expect(solved![row][col]).toBe(solution[row][col]);
      }
    }
  });

  describe.each<Difficulty>(['easy', 'medium', 'hard'])('difficulty: %s', (difficulty) => {
    it(`produces givens within the ${difficulty} range`, () => {
      const { puzzle } = generatePuzzle(difficulty);
      const givens = countGivens(puzzle);
      const { min, max } = DIFFICULTY_RANGES[difficulty];
      expect(givens).toBeGreaterThanOrEqual(min);
      expect(givens).toBeLessThanOrEqual(max);
    });
  });

  it('harder difficulties have fewer givens than easier ones', () => {
    // Generate multiple puzzles and compare average givens
    const easyGivens = countGivens(generatePuzzle('easy').puzzle);
    const hardGivens = countGivens(generatePuzzle('hard').puzzle);
    // Easy range: 36-40, Hard range: 24-29 — easy should always have more
    expect(easyGivens).toBeGreaterThan(hardGivens);
  });
});
