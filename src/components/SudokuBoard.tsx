import React, { useEffect, useMemo } from 'react';
import { SudokuCell } from './SudokuCell';
import { useGameStore } from '@/lib/store';
import { CellPosition, GameMode } from '@/types/sudoku';

export const SudokuBoard: React.FC = () => {
  const { board, selectedCell, selectCell, settings, symbols } = useGameStore();
  const size = board.length;
  const boxSize = Math.sqrt(size);
  
  const keyboardMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = 0; i < Math.min(size, 9); i++) {
      map[String(i + 1)] = i + 1;
    }
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 9; i < size; i++) {
      const letter = letters[i - 9];
      if (!letter) break;
      map[letter] = i + 1;
    }
    return map;
  }, [size]);
  
  const isInSameBox = (pos1: CellPosition, pos2: CellPosition): boolean => {
    const box1Row = Math.floor(pos1.row / boxSize);
    const box1Col = Math.floor(pos1.col / boxSize);
    const box2Row = Math.floor(pos2.row / boxSize);
    const box2Col = Math.floor(pos2.col / boxSize);
    
    return box1Row === box2Row && box1Col === box2Col;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedCell) return;
    const maxIndex = size - 1;
    
    if (e.key === 'ArrowUp' && selectedCell.row > 0) {
      selectCell({ row: selectedCell.row - 1, col: selectedCell.col });
    } else if (e.key === 'ArrowDown' && selectedCell.row < maxIndex) {
      selectCell({ row: selectedCell.row + 1, col: selectedCell.col });
    } else if (e.key === 'ArrowLeft' && selectedCell.col > 0) {
      selectCell({ row: selectedCell.row, col: selectedCell.col - 1 });
    } else if (e.key === 'ArrowRight' && selectedCell.col < maxIndex) {
      selectCell({ row: selectedCell.row, col: selectedCell.col + 1 });
    }
    
    const { setCellValue, toggleCellNote, isNoteMode } = useGameStore.getState();
    const key = e.key.toUpperCase();
    const mappedValue = keyboardMap[key];
    
    if (mappedValue) {
      if (isNoteMode) {
        toggleCellNote(mappedValue);
      } else {
        setCellValue(mappedValue);
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      setCellValue(null);
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, keyboardMap, size]);
  
  const boardStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
  };
  
  return (
    <div 
      className="grid w-full aspect-square bg-card border-4 border-primary rounded-[var(--radius)] overflow-hidden" 
      style={boardStyle}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const position = { row: rowIndex, col: colIndex };
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const isSameRow = selectedCell?.row === rowIndex;
          const isSameColumn = selectedCell?.col === colIndex;
          const isSameBox = selectedCell ? isInSameBox(selectedCell, position) : false;
          const isSameValue = cell.value !== null && selectedCell ? 
            board[selectedCell.row][selectedCell.col].value === cell.value : 
            false;
          const isDiagonalCell = settings.mode === GameMode.Diagonal && (rowIndex === colIndex || rowIndex + colIndex === size - 1);
          
          // Calculate borders
          const isBoxRight = (colIndex + 1) % boxSize === 0 && colIndex !== size - 1;
          const isBoxBottom = (rowIndex + 1) % boxSize === 0 && rowIndex !== size - 1;
          
          return (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={`
                relative border-r border-b border-border/50
                ${isBoxRight ? '!border-r-primary/30 border-r-2' : ''}
                ${isBoxBottom ? '!border-b-primary/30 border-b-2' : ''}
                ${colIndex === size - 1 ? 'border-r-0' : ''}
                ${rowIndex === size - 1 ? 'border-b-0' : ''}
              `}
            >
              <SudokuCell
                cell={cell}
                position={position}
                isSelected={isSelected}
                isSameValue={isSameValue}
                isSameRow={isSameRow}
                isSameColumn={isSameColumn}
                isSameBox={isSameBox}
                isDiagonal={isDiagonalCell}
                symbols={symbols}
                gridSize={size}
                onClick={selectCell}
              />
            </div>
          );
        })
      )}
    </div>
  );
};