import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  cleanup();
});
import { SudokuGrid } from './SudokuGrid';
import type { Board, CellValue } from '@/types';

function createTestBoard(puzzle: CellValue[][]): Board {
  return puzzle.map((row) =>
    row.map((value) => ({
      value,
      isGiven: value !== null,
      notes: new Set<number>(),
      isError: false,
    })),
  );
}

const TEST_PUZZLE: CellValue[][] = [
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

describe('SudokuGrid', () => {
  it('renders 81 cells', () => {
    const board = createTestBoard(TEST_PUZZLE);
    render(
      <SudokuGrid
        board={board}
        selectedCell={null}
        onCellClick={() => {}}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(81);
  });

  it('renders given cell values', () => {
    const board = createTestBoard(TEST_PUZZLE);
    render(
      <SudokuGrid
        board={board}
        selectedCell={null}
        onCellClick={() => {}}
      />,
    );

    // Check that the value 5 appears at [0][0]
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('5');
    expect(buttons[1]).toHaveTextContent('3');
    // [0][2] is null — should be empty
    expect(buttons[2]).toHaveTextContent('');
  });

  it('has grid role and aria-label', () => {
    const board = createTestBoard(TEST_PUZZLE);
    render(
      <SudokuGrid
        board={board}
        selectedCell={null}
        onCellClick={() => {}}
      />,
    );

    expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'Sudoku grid');
  });

  it('calls onCellClick with correct position when a cell is clicked', () => {
    const onCellClick = vi.fn();
    const board = createTestBoard(TEST_PUZZLE);

    render(
      <SudokuGrid
        board={board}
        selectedCell={null}
        onCellClick={onCellClick}
      />,
    );

    // Click cell at row 2, col 1 (index = 2*9 + 1 = 19)
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[19]);

    expect(onCellClick).toHaveBeenCalledOnce();
    expect(onCellClick).toHaveBeenCalledWith({ row: 2, col: 1 });
  });

  it('applies box boundary borders at correct cells', () => {
    const board = createTestBoard(TEST_PUZZLE);
    render(
      <SudokuGrid
        board={board}
        selectedCell={null}
        onCellClick={() => {}}
      />,
    );

    const buttons = screen.getAllByRole('button');

    // Cell [0][0]: top-left corner — should have border-l-2 and border-t-2
    expect(buttons[0].className).toContain('border-l-2');
    expect(buttons[0].className).toContain('border-t-2');

    // Cell [0][3]: col 3 boundary — should have border-l-2
    expect(buttons[3].className).toContain('border-l-2');

    // Cell [3][0]: row 3 boundary — should have border-t-2
    expect(buttons[27].className).toContain('border-t-2');

    // Cell [1][1]: interior — should not have thick borders
    expect(buttons[10].className).not.toContain('border-l-2');
    expect(buttons[10].className).not.toContain('border-t-2');
  });
});
