import type { CellValue, Difficulty } from '@/types';
import { GRID_SIZE, DIFFICULTY_RANGES } from '@/config/constants';
import { isValidPlacement, countSolutions } from '@/lib/sudoku-solver';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateCompletedBoard(): CellValue[][] {
  const board: CellValue[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );

  function backtrack(index: number): boolean {
    if (index === GRID_SIZE * GRID_SIZE) return true;

    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    const candidates = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of candidates) {
      if (isValidPlacement(board, { row, col }, num)) {
        board[row][col] = num as CellValue;
        if (backtrack(index + 1)) return true;
        board[row][col] = null;
      }
    }

    return false;
  }

  backtrack(0);
  return board;
}

export function generatePuzzle(difficulty: Difficulty): {
  puzzle: CellValue[][];
  solution: CellValue[][];
} {
  const solution = generateCompletedBoard();
  const puzzle = solution.map(row => [...row]);

  const { min, max } = DIFFICULTY_RANGES[difficulty];
  const targetGivens = min + Math.floor(Math.random() * (max - min + 1));
  const cellsToRemove = GRID_SIZE * GRID_SIZE - targetGivens;

  // Shuffle cell positions for random removal order
  const positions = shuffleArray(
    Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      row: Math.floor(i / GRID_SIZE),
      col: i % GRID_SIZE,
    }))
  );

  let removed = 0;
  for (const pos of positions) {
    if (removed >= cellsToRemove) break;

    const backup = puzzle[pos.row][pos.col];
    puzzle[pos.row][pos.col] = null;

    if (countSolutions(puzzle, 2) === 1) {
      removed++;
    } else {
      // Restore — removing this cell would create multiple solutions
      puzzle[pos.row][pos.col] = backup;
    }
  }

  return { puzzle, solution };
}
