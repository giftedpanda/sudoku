import { cn } from '@/lib/utils';
import type { Cell, Position } from '@/types';

export interface SudokuCellProps {
  cell: Cell;
  position: Position;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: (position: Position) => void;
}

export function SudokuCell({
  cell,
  position,
  isSelected,
  isHighlighted,
  onClick,
}: SudokuCellProps) {
  const { row, col } = position;

  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center tabular-nums',
        'w-full aspect-square text-lg sm:text-2xl',
        'border-grid-border transition-colors motion-reduce:transition-none',
        // Box border logic: thicker borders at 3x3 box boundaries
        col % 3 === 0 ? 'border-l-2' : 'border-l',
        col === 8 && 'border-r-2',
        row % 3 === 0 ? 'border-t-2' : 'border-t',
        row === 8 && 'border-b-2',
        // Cell state styling
        isSelected && 'bg-cell-selected',
        !isSelected && isHighlighted && 'bg-cell-peer',
        cell.isError && 'bg-cell-error',
        // Text styling
        cell.isGiven
          ? 'font-bold text-text-primary'
          : 'text-game-player',
        // Focus
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600',
      )}
      onClick={() => onClick(position)}
      aria-label={`Cell row ${row + 1} column ${col + 1}${cell.value ? `, value ${cell.value}` : ', empty'}`}
      data-row={row}
      data-col={col}
    >
      {cell.value}
    </button>
  );
}
