import type { CellValue, Position } from '@/types';
import { BOX_SIZE, GRID_SIZE } from '@/config/constants';

export function isValidPlacement(
  board: CellValue[][],
  pos: Position,
  value: number,
): boolean {
  // Check row
  for (let col = 0; col < GRID_SIZE; col++) {
    if (board[pos.row][col] === value) return false;
  }

  // Check column
  for (let row = 0; row < GRID_SIZE; row++) {
    if (board[row][pos.col] === value) return false;
  }

  // Check box
  const boxRowStart = Math.floor(pos.row / BOX_SIZE) * BOX_SIZE;
  const boxColStart = Math.floor(pos.col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRowStart; r < boxRowStart + BOX_SIZE; r++) {
    for (let c = boxColStart; c < boxColStart + BOX_SIZE; c++) {
      if (board[r][c] === value) return false;
    }
  }

  return true;
}

function findEmptyCell(board: CellValue[][]): Position | null {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === null) {
        return { row, col };
      }
    }
  }
  return null;
}

function cloneGrid(board: CellValue[][]): CellValue[][] {
  return board.map((row) => [...row]);
}

function hasInitialConflicts(board: CellValue[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = board[row][col];
      if (value === null) continue;

      // Temporarily remove the value to check placement validity
      board[row][col] = null;
      const valid = isValidPlacement(board, { row, col }, value);
      board[row][col] = value;

      if (!valid) return true;
    }
  }
  return false;
}

export function solve(board: CellValue[][]): CellValue[][] | null {
  const grid = cloneGrid(board);

  if (hasInitialConflicts(grid)) return null;

  function backtrack(): boolean {
    const empty = findEmptyCell(grid);
    if (!empty) return true;

    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(grid, empty, num)) {
        grid[empty.row][empty.col] = num as CellValue;
        if (backtrack()) return true;
        grid[empty.row][empty.col] = null;
      }
    }

    return false;
  }

  return backtrack() ? grid : null;
}

export function countSolutions(board: CellValue[][], limit: number): number {
  const grid = cloneGrid(board);

  if (hasInitialConflicts(grid)) return 0;

  let count = 0;

  function backtrack(): boolean {
    const empty = findEmptyCell(grid);
    if (!empty) {
      count++;
      return count >= limit;
    }

    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(grid, empty, num)) {
        grid[empty.row][empty.col] = num as CellValue;
        if (backtrack()) return true;
        grid[empty.row][empty.col] = null;
      }
    }

    return false;
  }

  backtrack();
  return count;
}
