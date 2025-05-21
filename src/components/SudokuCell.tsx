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
  onClick,
}) => {
  const { value, isGiven, isValid, notes } = cell;
  
  const handleClick = () => {
    onClick(position);
  };
  
  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-full h-full text-lg font-medium border border-border',
        'transition-colors duration-150 cursor-pointer select-none',
        isSelected && 'bg-primary/20 border-primary',
        !isSelected && isSameRow && 'bg-muted/50',
        !isSelected && isSameColumn && 'bg-muted/50',
        !isSelected && isSameBox && 'bg-muted/30',
        !isSelected && isSameValue && value && 'bg-secondary/50',
        !isValid && 'text-destructive'
      )}
      onClick={handleClick}
    >
      {value ? (
        <span className={cn(
          isGiven ? 'font-bold' : 'font-normal'
        )}>
          {value}
        </span>
      ) : (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((noteValue) => (
            <div
              key={noteValue}
              className="flex items-center justify-center text-[8px] text-muted-foreground"
            >
              {notes.includes(noteValue) ? noteValue : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 