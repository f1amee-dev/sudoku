import { useState, useEffect } from 'react';
import { Difficulty, CellPosition, SudokuGrid } from '../types/sudoku';
import { generateSudoku, isValidSolution, canPlaceNumber } from '../lib/sudokuGenerator';
import { triggerConfetti } from '../lib/confetti';
import SudokuCell from './SudokuCell';
import GameControls from './GameControls';

interface SudokuBoardProps {
  difficulty: Difficulty;
  onBackToMenu?: () => void;
}

const SudokuBoard = ({ difficulty, onBackToMenu }: SudokuBoardProps) => {
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [solution, setSolution] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [readOnlyCells, setReadOnlyCells] = useState<Record<string, boolean>>({});
  const [errorCells, setErrorCells] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showSolveAnimation, setShowSolveAnimation] = useState(false);

  // generate a new puzzle when difficulty changes
  useEffect(() => {
    const { puzzle, solution } = generateSudoku(difficulty);
    setGrid(puzzle);
    setSolution(solution);
    setSelectedCell(null);
    setErrorCells({});
    setIsComplete(false);
    setShowSolveAnimation(false);
    
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
    if (grid.length === 0 || showSolveAnimation) return;
    
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
      triggerConfetti();
    }
  }, [grid, errorCells, showSolveAnimation]);

  const handleCellClick = (row: number, col: number) => {
    if (readOnlyCells[`${row},${col}`] || isComplete || showSolveAnimation) return;
    
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number: number) => {
    if (!selectedCell || isComplete || showSolveAnimation) return;
    
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
    if (!selectedCell || isComplete || showSolveAnimation) return;
    
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
      if (!selectedCell || isComplete || showSolveAnimation) return;
      
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
  }, [selectedCell, readOnlyCells, isComplete, showSolveAnimation]);

  const handleSolve = () => {
    // set solving animation flag
    setShowSolveAnimation(true);
    
    // Gradually fill in the solution with animation
    const emptyCells: {row: number, col: number}[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null || errorCells[`${row},${col}`]) {
          emptyCells.push({row, col});
        }
      }
    }
    
    // Shuffle the empty cells for a more random fill animation
    emptyCells.sort(() => Math.random() - 0.5);
    
    // Start filling in cells one by one
    const newGrid = [...grid.map(row => [...row])];
    let i = 0;
    
    const fillInterval = setInterval(() => {
      if (i >= emptyCells.length) {
        clearInterval(fillInterval);
        setShowSolveAnimation(false);
        setErrorCells({});
        setTimeout(() => {
          setIsComplete(true);
          triggerConfetti();
        }, 500);
        return;
      }
      
      const {row, col} = emptyCells[i];
      newGrid[row][col] = solution[row][col];
      setGrid([...newGrid]);
      i++;
    }, 50);
  };

  if (grid.length === 0) return <div className="flex items-center justify-center p-8"><div className="animate-pulse text-primary">Loading...</div></div>;

  const startNewGame = () => {
    const { puzzle, solution } = generateSudoku(difficulty);
    setGrid(puzzle);
    setSolution(solution);
    setSelectedCell(null);
    setErrorCells({});
    setIsComplete(false);
    setShowSolveAnimation(false);
    
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
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <GameControls 
        difficulty={difficulty}
        onNewGame={onBackToMenu || startNewGame}
        onSolve={handleSolve}
      />
      
      <div className="relative">
        <div className="sudoku-grid w-full aspect-square mx-auto">
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
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl z-10">
            <div className="glass-panel p-8 rounded-xl shadow-lg text-center max-w-xs mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2">Congratulations!</h2>
              <p className="text-muted-foreground mb-6">You've successfully completed the puzzle!</p>
              <button 
                onClick={onBackToMenu || startNewGame}
                className="px-6 py-3 rounded-lg glass-button-primary font-medium w-full"
              >
                {onBackToMenu ? 'Back to Menu' : 'Play Again'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SudokuBoard; 