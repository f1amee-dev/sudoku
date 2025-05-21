import React, { useEffect } from 'react';
import { SudokuCell } from './SudokuCell';
import { useGameStore } from '@/lib/store';
import { CellPosition } from '@/types/sudoku';

export const SudokuBoard: React.FC = () => {
  const { board, selectedCell, selectCell } = useGameStore();
  
  const isInSameBox = (pos1: CellPosition, pos2: CellPosition): boolean => {
    const box1Row = Math.floor(pos1.row / 3);
    const box1Col = Math.floor(pos1.col / 3);
    const box2Row = Math.floor(pos2.row / 3);
    const box2Col = Math.floor(pos2.col / 3);
    
    return box1Row === box2Row && box1Col === box2Col;
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedCell) return;
    
    if (e.key === 'ArrowUp' && selectedCell.row > 0) {
      selectCell({ row: selectedCell.row - 1, col: selectedCell.col });
    } else if (e.key === 'ArrowDown' && selectedCell.row < 8) {
      selectCell({ row: selectedCell.row + 1, col: selectedCell.col });
    } else if (e.key === 'ArrowLeft' && selectedCell.col > 0) {
      selectCell({ row: selectedCell.row, col: selectedCell.col - 1 });
    } else if (e.key === 'ArrowRight' && selectedCell.col < 8) {
      selectCell({ row: selectedCell.row, col: selectedCell.col + 1 });
    }
    
    const { setCellValue, toggleCellNote, isNoteMode } = useGameStore.getState();
    
    if (e.key >= '1' && e.key <= '9') {
      const value = parseInt(e.key);
      if (isNoteMode) {
        toggleCellNote(value);
      } else {
        setCellValue(value);
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
  }, [selectedCell]);
  
  return (
    <div className="grid grid-cols-9 grid-rows-9 w-full max-w-md aspect-square border-2 border-primary">
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
          
          return (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={`
                ${colIndex % 3 === 0 && colIndex !== 0 ? 'border-l-2 border-l-primary' : ''}
                ${rowIndex % 3 === 0 && rowIndex !== 0 ? 'border-t-2 border-t-primary' : ''}
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
                onClick={selectCell}
              />
            </div>
          );
        })
      )}
    </div>
  );
}; 