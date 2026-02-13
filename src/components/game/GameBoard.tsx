'use client';

import { useState, useMemo } from 'react';
import type { Board, CellValue, Position } from '@/types';
import { SudokuGrid } from './SudokuGrid';

// Hardcoded puzzle for initial rendering (Story 1.5)
const HARDCODED_PUZZLE: CellValue[][] = [
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

function createBoardFromPuzzle(puzzle: CellValue[][]): Board {
  return puzzle.map((row) =>
    row.map((value) => ({
      value,
      isGiven: value !== null,
      notes: new Set<number>(),
      isError: false,
    })),
  );
}

export function GameBoard() {
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);

  const board = useMemo(
    () => createBoardFromPuzzle(HARDCODED_PUZZLE),
    [],
  );

  const handleCellClick = (position: Position) => {
    setSelectedCell(position);
  };

  return (
    <div className="w-full max-w-(--container-game) mx-auto px-4">
      <SudokuGrid
        board={board}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
      />
    </div>
  );
}
