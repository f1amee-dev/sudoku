import { useState, useEffect } from 'react';
import { Difficulty, CellPosition, SudokuGrid } from '../types/sudoku';
import { generateSudoku, isValidSolution, canPlaceNumber } from '../lib/sudokuGenerator';
import SudokuCell from './SudokuCell';

interface SudokuBoardProps {
  difficulty: Difficulty;
}

const SudokuBoard = ({ difficulty }: SudokuBoardProps) => {
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [solution, setSolution] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [readOnlyCells, setReadOnlyCells] = useState<Record<string, boolean>>({});
  const [errorCells, setErrorCells] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);

  // generate a new puzzle when difficulty changes
  useEffect(() => {
    const { puzzle, solution } = generateSudoku(difficulty);
    setGrid(puzzle);
    setSolution(solution);
    setSelectedCell(null);
    setErrorCells({});
    setIsComplete(false);
    
    // mark initial cells as read-only
    const readOnly: Record<string, boolean> = {};
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== null) {
          readOnly[`${row},${col}`] = true;
        }
      }
    }
    setReadOnlyCells(readOnly);
  }, [difficulty]);

  // check if the game is complete
  useEffect(() => {
    if (grid.length === 0) return;
    
    let complete = true;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null || errorCells[`${row},${col}`]) {
          complete = false;
          break;
        }
      }
      if (!complete) break;
    }
    
    if (complete) {
      setIsComplete(true);
    }
  }, [grid, errorCells]);

  const handleCellClick = (row: number, col: number) => {
    if (readOnlyCells[`${row},${col}`] || isComplete) return;
    
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number: number) => {
    if (!selectedCell || isComplete) return;
    
    const { row, col } = selectedCell;
    
    // check if the number is valid
    const isValid = canPlaceNumber(grid, row, col, number);
    const newGrid = [...grid.map(row => [...row])];
    newGrid[row][col] = number;
    
    // update the grid
    setGrid(newGrid);
    
    // check if the number is correct according to the solution
    const isCorrect = number === solution[row][col];
    
    // update error cells
    if (!isCorrect) {
      setErrorCells(prev => ({ ...prev, [`${row},${col}`]: true }));
    } else {
      const newErrors = { ...errorCells };
      delete newErrors[`${row},${col}`];
      setErrorCells(newErrors);
    }
  };

  const handleClearCell = () => {
    if (!selectedCell || isComplete) return;
    
    const { row, col } = selectedCell;
    if (readOnlyCells[`${row},${col}`]) return;
    
    const newGrid = [...grid.map(row => [...row])];
    newGrid[row][col] = null;
    setGrid(newGrid);
    
    // clear error for this cell
    const newErrors = { ...errorCells };
    delete newErrors[`${row},${col}`];
    setErrorCells(newErrors);
  };

  // pass number input and clear cell functions to parent
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleClearCell();
      } else if (e.key === 'ArrowUp' && selectedCell.row > 0) {
        setSelectedCell({ row: selectedCell.row - 1, col: selectedCell.col });
      } else if (e.key === 'ArrowDown' && selectedCell.row < 8) {
        setSelectedCell({ row: selectedCell.row + 1, col: selectedCell.col });
      } else if (e.key === 'ArrowLeft' && selectedCell.col > 0) {
        setSelectedCell({ row: selectedCell.row, col: selectedCell.col - 1 });
      } else if (e.key === 'ArrowRight' && selectedCell.col < 8) {
        setSelectedCell({ row: selectedCell.row, col: selectedCell.col + 1 });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, readOnlyCells, isComplete]);

  if (grid.length === 0) return <div>Loading...</div>;

  return (
    <div className="relative">
      <div className="sudoku-grid w-full max-w-md mx-auto">
        {grid.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex},${colIndex}`}
              value={cell}
              row={rowIndex}
              col={colIndex}
              isReadOnly={readOnlyCells[`${rowIndex},${colIndex}`] || false}
              isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
              isError={errorCells[`${rowIndex},${colIndex}`] || false}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <div className="bg-card p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Congratulations!</h2>
            <p className="mb-4">You've completed the puzzle!</p>
            <button 
              onClick={() => {
                const { puzzle, solution } = generateSudoku(difficulty);
                setGrid(puzzle);
                setSolution(solution);
                setSelectedCell(null);
                setErrorCells({});
                setIsComplete(false);
                
                // mark initial cells as read-only
                const readOnly: Record<string, boolean> = {};
                for (let row = 0; row < 9; row++) {
                  for (let col = 0; col < 9; col++) {
                    if (puzzle[row][col] !== null) {
                      readOnly[`${row},${col}`] = true;
                    }
                  }
                }
                setReadOnlyCells(readOnly);
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudokuBoard; 