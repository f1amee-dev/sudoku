import React from 'react';
import { CellPosition, CellState } from '@/types/sudoku';
import { cn } from '@/lib/utils';

interface SudokuCellProps {
  cell: CellState;
  position: CellPosition;
  isSelected: boolean;
  isSameValue: boolean;
  isSameRow: boolean;
  isSameColumn: boolean;
  isSameBox: boolean;
  isDiagonal?: boolean;
  symbols: string[];
  gridSize: number;
  onClick: (position: CellPosition) => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  position,
  isSelected,
  isSameValue,
  isSameRow,
  isSameColumn,
  isSameBox,
  isDiagonal,
  symbols,
  gridSize,
  onClick,
}) => {
  const { value, isGiven, isValid, notes } = cell;
  const displayValue = typeof value === 'number' ? symbols[value - 1] ?? String(value) : '';
  const noteValues = Array.from({ length: gridSize }, (_, idx) => idx + 1);
  const noteCols = Math.ceil(Math.sqrt(gridSize));
  const textSize = gridSize <= 4 ? 'text-3xl' : gridSize <= 9 ? 'text-xl' : 'text-sm';
  
  const handleClick = () => {
    onClick(position);
  };
  
  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-full h-full font-medium border border-border',
        'transition-colors duration-150 cursor-pointer select-none',
        textSize,
        isSelected && 'bg-primary/20 border-primary',
        !isSelected && isSameRow && 'bg-muted/50',
        !isSelected && isSameColumn && 'bg-muted/50',
        !isSelected && isSameBox && 'bg-muted/30',
        !isSelected && isSameValue && value && 'bg-secondary/50',
        !isSelected && isDiagonal && 'bg-primary/5',
        !isValid && 'text-destructive'
      )}
      onClick={handleClick}
    >
      {value ? (
        <span className={cn(
          isGiven ? 'font-bold' : 'font-normal'
        )}>
          {displayValue}
        </span>
      ) : (
        <div className="grid gap-0 w-full h-full p-0.5" style={{ gridTemplateColumns: `repeat(${noteCols}, minmax(0, 1fr))` }}>
          {noteValues.map((noteValue) => (
            <div
              key={noteValue}
              className="flex items-center justify-center text-[8px] text-muted-foreground"
            >
              {notes.includes(noteValue) ? (symbols[noteValue - 1] ?? noteValue) : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
