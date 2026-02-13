import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  cleanup();
});
import { SudokuCell } from './SudokuCell';
import type { Cell, Position } from '@/types';

function makeCell(value: Cell['value'] = null, isGiven = false): Cell {
  return { value, isGiven, notes: new Set<number>(), isError: false };
}

describe('SudokuCell', () => {
  it('renders given cell value in bold', () => {
    const cell = makeCell(5, true);
    render(
      <SudokuCell
        cell={cell}
        position={{ row: 0, col: 0 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('5');
    expect(button.className).toContain('font-bold');
  });

  it('renders empty cell as blank', () => {
    const cell = makeCell(null);
    render(
      <SudokuCell
        cell={cell}
        position={{ row: 0, col: 0 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('');
  });

  it('fires onClick with correct position when clicked', () => {
    const onClick = vi.fn();
    const position: Position = { row: 3, col: 5 };

    render(
      <SudokuCell
        cell={makeCell()}
        position={position}
        isSelected={false}
        isHighlighted={false}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledWith({ row: 3, col: 5 });
  });

  it('has appropriate aria-label for cell with value', () => {
    render(
      <SudokuCell
        cell={makeCell(7, true)}
        position={{ row: 2, col: 4 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Cell row 3 column 5, value 7',
    );
  });

  it('has appropriate aria-label for empty cell', () => {
    render(
      <SudokuCell
        cell={makeCell()}
        position={{ row: 0, col: 0 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Cell row 1 column 1, empty',
    );
  });

  it('applies thicker left border at box boundary (col % 3 === 0)', () => {
    const { container: c0 } = render(
      <SudokuCell
        cell={makeCell()}
        position={{ row: 0, col: 0 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );
    expect(c0.firstElementChild!.className).toContain('border-l-2');

    const { container: c1 } = render(
      <SudokuCell
        cell={makeCell()}
        position={{ row: 0, col: 3 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );
    expect(c1.firstElementChild!.className).toContain('border-l-2');
  });

  it('applies thicker top border at box boundary (row % 3 === 0)', () => {
    const { container: c0 } = render(
      <SudokuCell
        cell={makeCell()}
        position={{ row: 0, col: 0 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );
    expect(c0.firstElementChild!.className).toContain('border-t-2');

    const { container: c3 } = render(
      <SudokuCell
        cell={makeCell()}
        position={{ row: 3, col: 0 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );
    expect(c3.firstElementChild!.className).toContain('border-t-2');
  });

  it('applies regular border for non-boundary cells', () => {
    const { container } = render(
      <SudokuCell
        cell={makeCell()}
        position={{ row: 1, col: 1 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );
    const className = container.firstElementChild!.className;
    expect(className).toContain('border-l');
    expect(className).toContain('border-t');
    expect(className).not.toContain('border-l-2');
    expect(className).not.toContain('border-t-2');
  });

  it('uses player color for non-given cells', () => {
    render(
      <SudokuCell
        cell={makeCell(3, false)}
        position={{ row: 0, col: 0 }}
        isSelected={false}
        isHighlighted={false}
        onClick={() => {}}
      />,
    );

    const button = screen.getByRole('button');
    expect(button.className).toContain('text-game-player');
    expect(button.className).not.toContain('font-bold');
  });
});
