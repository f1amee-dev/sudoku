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
  
  // Dynamic text size based on grid size
  const textSize = gridSize <= 4 ? 'text-4xl' : gridSize <= 9 ? 'text-3xl' : 'text-lg';
  
  const handleClick = () => {
    onClick(position);
  };
  
  return (
    <div
      className={cn(
        'flex items-center justify-center w-full h-full cursor-pointer select-none',
        'transition-all duration-200 ease-in-out',
        
        // Background states
        isSelected && 'bg-primary text-primary-foreground shadow-inner scale-100 z-10',
        !isSelected && isSameValue && value && 'bg-primary/20 text-foreground font-semibold',
        !isSelected && !isSameValue && (isSameRow || isSameColumn || isSameBox) && 'bg-muted/80',
        !isSelected && !isSameValue && !isSameRow && !isSameColumn && !isSameBox && 'bg-card hover:bg-muted/50',
        
        // Diagonal mode special styling
        !isSelected && isDiagonal && 'bg-primary/5',
        
        // Error state
        !isValid && 'text-destructive bg-destructive/10 animate-pulse'
      )}
      onClick={handleClick}
      role="button"
      aria-label={`Cell ${position.row + 1}, ${position.col + 1}. ${value ? `Value: ${displayValue}` : 'Empty'}`}
    >
      {value ? (
        <span className={cn(
          textSize,
          'leading-none transform transition-transform duration-300',
          isSelected ? 'scale-110' : 'scale-100',
          isGiven ? 'font-bold' : 'font-medium',
          // If selected, color is handled by parent div (text-primary-foreground)
          // If not selected but given, maybe different color?
          !isSelected && isGiven && 'text-primary',
          !isSelected && !isGiven && 'text-foreground'
        )}>
          {displayValue}
        </span>
      ) : (
        <div className="grid gap-0.5 w-full h-full p-1 content-center justify-center" style={{ gridTemplateColumns: `repeat(${noteCols}, minmax(0, 1fr))` }}>
          {noteValues.map((noteValue) => (
            <div
              key={noteValue}
              className="flex items-center justify-center"
            >
              <span className={cn(
                "text-[9px] leading-none font-medium transition-opacity duration-200",
                notes.includes(noteValue) ? "opacity-100 text-muted-foreground" : "opacity-0"
              )}>
                {symbols[noteValue - 1] ?? noteValue}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};