import type { Board, Position } from '@/types';
import { GRID_SIZE } from '@/config/constants';
import { SudokuCell } from './SudokuCell';

export interface SudokuGridProps {
  board: Board;
  selectedCell: Position | null;
  onCellClick: (position: Position) => void;
}

export function SudokuGrid({ board, selectedCell, onCellClick }: SudokuGridProps) {
  return (
    <div
      className="grid grid-cols-9 border-2 border-grid-border-strong shadow-grid"
      role="grid"
      aria-label="Sudoku grid"
    >
      {Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => {
          const isSelected =
            selectedCell !== null &&
            selectedCell.row === row &&
            selectedCell.col === col;

          const isHighlighted =
            selectedCell !== null &&
            !isSelected &&
            (selectedCell.row === row ||
              selectedCell.col === col ||
              (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
                Math.floor(selectedCell.col / 3) === Math.floor(col / 3)));

          return (
            <SudokuCell
              key={`${row}-${col}`}
              cell={board[row][col]}
              position={{ row, col }}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              onClick={onCellClick}
            />
          );
        }),
      )}
    </div>
  );
}
