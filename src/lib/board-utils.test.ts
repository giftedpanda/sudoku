import { describe, expect, it } from 'vitest';
import {
  cloneBoard,
  createEmptyBoard,
  getAllPeers,
  getBoxIndex,
  getBoxPeers,
  getColPeers,
  getRowPeers,
  hasConflict,
  isBoardComplete,
  validateBoard,
} from '@/lib/board-utils';
import type { Board, CellValue } from '@/types';
import { GRID_SIZE } from '@/config/constants';

function makeCell(value: CellValue = null, isGiven = false): Board[0][0] {
  return { value, isGiven, notes: new Set<number>(), isError: false };
}

function makeBoardFromValues(values: CellValue[][]): Board {
  return values.map((row) => row.map((v) => makeCell(v)));
}

describe('createEmptyBoard', () => {
  it('returns a 9x9 board', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(GRID_SIZE);
    for (const row of board) {
      expect(row).toHaveLength(GRID_SIZE);
    }
  });

  it('all cells have null values', () => {
    const board = createEmptyBoard();
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        expect(board[r][c].value).toBeNull();
      }
    }
  });

  it('all cells have isGiven false', () => {
    const board = createEmptyBoard();
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        expect(board[r][c].isGiven).toBe(false);
      }
    }
  });

  it('all cells have empty notes set', () => {
    const board = createEmptyBoard();
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        expect(board[r][c].notes).toBeInstanceOf(Set);
        expect(board[r][c].notes.size).toBe(0);
      }
    }
  });

  it('all cells have isError false', () => {
    const board = createEmptyBoard();
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        expect(board[r][c].isError).toBe(false);
      }
    }
  });
});

describe('getRowPeers', () => {
  it('returns 8 positions in the same row', () => {
    const peers = getRowPeers(3, 4);
    expect(peers).toHaveLength(8);
    for (const p of peers) {
      expect(p.row).toBe(3);
      expect(p.col).not.toBe(4);
    }
  });

  it('does not include the cell itself', () => {
    const peers = getRowPeers(0, 0);
    expect(peers.some((p) => p.row === 0 && p.col === 0)).toBe(false);
  });

  it('includes all other columns', () => {
    const peers = getRowPeers(5, 2);
    const cols = peers.map((p) => p.col).sort((a, b) => a - b);
    expect(cols).toEqual([0, 1, 3, 4, 5, 6, 7, 8]);
  });
});

describe('getColPeers', () => {
  it('returns 8 positions in the same column', () => {
    const peers = getColPeers(3, 4);
    expect(peers).toHaveLength(8);
    for (const p of peers) {
      expect(p.col).toBe(4);
      expect(p.row).not.toBe(3);
    }
  });

  it('does not include the cell itself', () => {
    const peers = getColPeers(0, 0);
    expect(peers.some((p) => p.row === 0 && p.col === 0)).toBe(false);
  });

  it('includes all other rows', () => {
    const peers = getColPeers(2, 7);
    const rows = peers.map((p) => p.row).sort((a, b) => a - b);
    expect(rows).toEqual([0, 1, 3, 4, 5, 6, 7, 8]);
  });
});

describe('getBoxPeers', () => {
  it('returns 8 positions in the same 3x3 box', () => {
    const peers = getBoxPeers(0, 0);
    expect(peers).toHaveLength(8);
  });

  it('does not include the cell itself', () => {
    const peers = getBoxPeers(4, 4);
    expect(peers.some((p) => p.row === 4 && p.col === 4)).toBe(false);
  });

  it('returns correct peers for top-left box', () => {
    const peers = getBoxPeers(1, 1);
    for (const p of peers) {
      expect(p.row).toBeGreaterThanOrEqual(0);
      expect(p.row).toBeLessThan(3);
      expect(p.col).toBeGreaterThanOrEqual(0);
      expect(p.col).toBeLessThan(3);
    }
  });

  it('returns correct peers for center box', () => {
    const peers = getBoxPeers(4, 4);
    for (const p of peers) {
      expect(p.row).toBeGreaterThanOrEqual(3);
      expect(p.row).toBeLessThan(6);
      expect(p.col).toBeGreaterThanOrEqual(3);
      expect(p.col).toBeLessThan(6);
    }
  });

  it('returns correct peers for bottom-right box', () => {
    const peers = getBoxPeers(8, 8);
    for (const p of peers) {
      expect(p.row).toBeGreaterThanOrEqual(6);
      expect(p.row).toBeLessThan(9);
      expect(p.col).toBeGreaterThanOrEqual(6);
      expect(p.col).toBeLessThan(9);
    }
  });
});

describe('getAllPeers', () => {
  it('returns 20 unique peers', () => {
    const peers = getAllPeers(4, 4);
    expect(peers).toHaveLength(20);
  });

  it('does not include the cell itself', () => {
    const peers = getAllPeers(0, 0);
    expect(peers.some((p) => p.row === 0 && p.col === 0)).toBe(false);
  });

  it('contains no duplicates', () => {
    const peers = getAllPeers(0, 0);
    const keys = peers.map((p) => `${p.row},${p.col}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('returns 20 peers for a corner cell', () => {
    const peers = getAllPeers(0, 0);
    expect(peers).toHaveLength(20);
  });

  it('returns 20 peers for an edge cell', () => {
    const peers = getAllPeers(0, 4);
    expect(peers).toHaveLength(20);
  });
});

describe('getBoxIndex', () => {
  it('returns 0 for top-left box', () => {
    expect(getBoxIndex(0, 0)).toBe(0);
    expect(getBoxIndex(2, 2)).toBe(0);
  });

  it('returns 1 for top-center box', () => {
    expect(getBoxIndex(0, 3)).toBe(1);
    expect(getBoxIndex(2, 5)).toBe(1);
  });

  it('returns 2 for top-right box', () => {
    expect(getBoxIndex(0, 6)).toBe(2);
    expect(getBoxIndex(2, 8)).toBe(2);
  });

  it('returns 4 for center box', () => {
    expect(getBoxIndex(3, 3)).toBe(4);
    expect(getBoxIndex(5, 5)).toBe(4);
  });

  it('returns 8 for bottom-right box', () => {
    expect(getBoxIndex(6, 6)).toBe(8);
    expect(getBoxIndex(8, 8)).toBe(8);
  });

  it('returns correct index for all 9 boxes', () => {
    expect(getBoxIndex(0, 0)).toBe(0);
    expect(getBoxIndex(0, 3)).toBe(1);
    expect(getBoxIndex(0, 6)).toBe(2);
    expect(getBoxIndex(3, 0)).toBe(3);
    expect(getBoxIndex(3, 3)).toBe(4);
    expect(getBoxIndex(3, 6)).toBe(5);
    expect(getBoxIndex(6, 0)).toBe(6);
    expect(getBoxIndex(6, 3)).toBe(7);
    expect(getBoxIndex(6, 6)).toBe(8);
  });
});

describe('hasConflict', () => {
  it('returns false for null value', () => {
    const board = createEmptyBoard();
    expect(hasConflict(board, 0, 0)).toBe(false);
  });

  it('returns false for valid placement', () => {
    const board = createEmptyBoard();
    board[0][0].value = 1;
    board[0][1].value = 2;
    expect(hasConflict(board, 0, 0)).toBe(false);
    expect(hasConflict(board, 0, 1)).toBe(false);
  });

  it('detects row conflict', () => {
    const board = createEmptyBoard();
    board[0][0].value = 5;
    board[0][8].value = 5;
    expect(hasConflict(board, 0, 0)).toBe(true);
    expect(hasConflict(board, 0, 8)).toBe(true);
  });

  it('detects column conflict', () => {
    const board = createEmptyBoard();
    board[0][0].value = 3;
    board[8][0].value = 3;
    expect(hasConflict(board, 0, 0)).toBe(true);
    expect(hasConflict(board, 8, 0)).toBe(true);
  });

  it('detects box conflict', () => {
    const board = createEmptyBoard();
    board[0][0].value = 7;
    board[2][2].value = 7;
    expect(hasConflict(board, 0, 0)).toBe(true);
    expect(hasConflict(board, 2, 2)).toBe(true);
  });

  it('does not flag different values as conflict', () => {
    const board = createEmptyBoard();
    board[0][0].value = 1;
    board[0][1].value = 2;
    board[1][0].value = 3;
    board[1][1].value = 4;
    expect(hasConflict(board, 0, 0)).toBe(false);
  });
});

describe('validateBoard', () => {
  it('returns board with no errors for empty board', () => {
    const board = createEmptyBoard();
    const validated = validateBoard(board);
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        expect(validated[r][c].isError).toBe(false);
      }
    }
  });

  it('sets isError on conflicting cells', () => {
    const board = createEmptyBoard();
    board[0][0].value = 5;
    board[0][3].value = 5;

    const validated = validateBoard(board);
    expect(validated[0][0].isError).toBe(true);
    expect(validated[0][3].isError).toBe(true);
  });

  it('does not mutate the original board', () => {
    const board = createEmptyBoard();
    board[0][0].value = 5;
    board[0][3].value = 5;

    validateBoard(board);
    expect(board[0][0].isError).toBe(false);
    expect(board[0][3].isError).toBe(false);
  });

  it('clears previous errors for non-conflicting cells', () => {
    const board = createEmptyBoard();
    board[0][0].value = 1;
    board[0][0].isError = true; // stale error

    const validated = validateBoard(board);
    expect(validated[0][0].isError).toBe(false);
  });

  it('marks all cells involved in multiple conflicts', () => {
    const board = createEmptyBoard();
    // Row conflict
    board[0][0].value = 1;
    board[0][5].value = 1;
    // Column conflict
    board[3][0].value = 1;

    const validated = validateBoard(board);
    expect(validated[0][0].isError).toBe(true);
    expect(validated[0][5].isError).toBe(true);
    expect(validated[3][0].isError).toBe(true);
  });
});

describe('isBoardComplete', () => {
  it('returns true when board matches solution', () => {
    const solution: CellValue[][] = Array.from({ length: 9 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => (((r * 3 + Math.floor(r / 3) + c) % 9) + 1) as CellValue),
    );
    const board = makeBoardFromValues(solution);

    expect(isBoardComplete(board, solution)).toBe(true);
  });

  it('returns false when board has null values', () => {
    const solution: CellValue[][] = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => 1 as CellValue),
    );
    const board = createEmptyBoard();

    expect(isBoardComplete(board, solution)).toBe(false);
  });

  it('returns false when board has wrong values', () => {
    const solution: CellValue[][] = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => 1 as CellValue),
    );
    const values: CellValue[][] = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => 2 as CellValue),
    );
    const board = makeBoardFromValues(values);

    expect(isBoardComplete(board, solution)).toBe(false);
  });

  it('returns false when single cell differs', () => {
    const solution: CellValue[][] = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => 1 as CellValue),
    );
    const board = makeBoardFromValues(solution);
    board[8][8].value = 2;

    expect(isBoardComplete(board, solution)).toBe(false);
  });
});

describe('cloneBoard', () => {
  it('creates a board with the same values', () => {
    const board = createEmptyBoard();
    board[0][0].value = 5;
    board[4][4].notes.add(1);
    board[4][4].notes.add(3);

    const clone = cloneBoard(board);
    expect(clone[0][0].value).toBe(5);
    expect(clone[4][4].notes.has(1)).toBe(true);
    expect(clone[4][4].notes.has(3)).toBe(true);
  });

  it('modifying clone does not affect original', () => {
    const board = createEmptyBoard();
    board[0][0].value = 5;

    const clone = cloneBoard(board);
    clone[0][0].value = 9;

    expect(board[0][0].value).toBe(5);
  });

  it('modifying original does not affect clone', () => {
    const board = createEmptyBoard();
    const clone = cloneBoard(board);

    board[3][3].value = 7;
    expect(clone[3][3].value).toBeNull();
  });

  it('notes Sets are independent', () => {
    const board = createEmptyBoard();
    board[0][0].notes.add(1);

    const clone = cloneBoard(board);
    clone[0][0].notes.add(5);

    expect(board[0][0].notes.has(5)).toBe(false);
    expect(clone[0][0].notes.has(1)).toBe(true);
    expect(clone[0][0].notes.has(5)).toBe(true);
  });

  it('preserves isGiven and isError flags', () => {
    const board = createEmptyBoard();
    board[1][1].isGiven = true;
    board[2][2].isError = true;

    const clone = cloneBoard(board);
    expect(clone[1][1].isGiven).toBe(true);
    expect(clone[2][2].isError).toBe(true);
  });
});
