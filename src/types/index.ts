export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;

export interface Position {
  row: number; // 0-8
  col: number; // 0-8
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Cell {
  value: CellValue;
  isGiven: boolean;
  notes: Set<number>;
  isError: boolean;
}

export type Board = Cell[][];

export interface UndoAction {
  position: Position;
  previousCell: Cell;
}

export interface GameState {
  board: Board;
  solution: CellValue[][];
  difficulty: Difficulty;
  selectedCell: Position | null;
  isPencilMode: boolean;
  timer: number;
  undoStack: UndoAction[];
  isComplete: boolean;
}

export interface SerializedCell {
  value: CellValue;
  isGiven: boolean;
  notes: number[];
  isError: boolean;
}

export interface SavedGame {
  board: SerializedCell[][];
  solution: CellValue[][];
  difficulty: Difficulty;
  timer: number;
  undoStack: { position: Position; previousCell: SerializedCell }[];
  savedAt: number;
}
