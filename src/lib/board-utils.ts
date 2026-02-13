import type { Board, Cell, CellValue, Position } from '@/types';
import { BOX_SIZE, GRID_SIZE } from '@/config/constants';

export function createEmptyBoard(): Board {
  const board: Board = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    const rowCells: Cell[] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      rowCells.push({
        value: null,
        isGiven: false,
        notes: new Set<number>(),
        isError: false,
      });
    }
    board.push(rowCells);
  }
  return board;
}

export function getBoxIndex(row: number, col: number): number {
  return Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);
}

export function getRowPeers(row: number, col: number): Position[] {
  const peers: Position[] = [];
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col) {
      peers.push({ row, col: c });
    }
  }
  return peers;
}

export function getColPeers(row: number, col: number): Position[] {
  const peers: Position[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row) {
      peers.push({ row: r, col });
    }
  }
  return peers;
}

export function getBoxPeers(row: number, col: number): Position[] {
  const peers: Position[] = [];
  const boxRowStart = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxColStart = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRowStart; r < boxRowStart + BOX_SIZE; r++) {
    for (let c = boxColStart; c < boxColStart + BOX_SIZE; c++) {
      if (r !== row || c !== col) {
        peers.push({ row: r, col: c });
      }
    }
  }
  return peers;
}

export function getAllPeers(row: number, col: number): Position[] {
  const seen = new Set<string>();
  const peers: Position[] = [];

  const addPeer = (pos: Position) => {
    const key = `${pos.row},${pos.col}`;
    if (!seen.has(key)) {
      seen.add(key);
      peers.push(pos);
    }
  };

  for (const p of getRowPeers(row, col)) addPeer(p);
  for (const p of getColPeers(row, col)) addPeer(p);
  for (const p of getBoxPeers(row, col)) addPeer(p);

  return peers;
}

export function hasConflict(board: Board, row: number, col: number): boolean {
  const cell = board[row][col];
  if (cell.value === null) return false;

  const peers = getAllPeers(row, col);
  return peers.some((p) => board[p.row][p.col].value === cell.value);
}

export function validateBoard(board: Board): Board {
  const newBoard = cloneBoard(board);

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      newBoard[row][col].isError = hasConflict(newBoard, row, col);
    }
  }

  return newBoard;
}

export function isBoardComplete(board: Board, solution: CellValue[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col].value !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => ({
      value: cell.value,
      isGiven: cell.isGiven,
      notes: new Set(cell.notes),
      isError: cell.isError,
    })),
  );
}
