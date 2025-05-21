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
  const [confetti, setConfetti] = useState(false);

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
      // trigger confetti effect
      setConfetti(true);
      
      // reset confetti after 2 seconds
      setTimeout(() => {
        setConfetti(false);
      }, 2000);
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

  if (grid.length === 0) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary/20 mb-4 animate-spin"></div>
        <div className="text-primary">Loading your puzzle...</div>
      </div>
    </div>
  );

  const startNewGame = () => {
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
  };

  // simple animated dots for confetti effect
  const renderConfetti = () => {
    if (!confetti) return null;
    
    const dots = [];
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    
    for (let i = 0; i < 50; i++) {
      const size = Math.floor(Math.random() * 10) + 5;
      const left = Math.floor(Math.random() * 100);
      const animationDuration = (Math.random() * 1) + 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      dots.push(
        <div 
          key={i}
          className={`absolute rounded-full ${color}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: '-20px',
            animation: `fall ${animationDuration}s linear forwards`
          }}
        />
      );
    }
    
    return dots;
  };

  // add falling confetti animation styles
  useEffect(() => {
    // add keyframes for falling animation
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes fall {
        0% { transform: translateY(-10px); opacity: 1; }
        80% { opacity: 0.8; }
        100% { transform: translateY(400px); opacity: 0; }
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="relative">
      <div className="rounded-xl p-2 bg-white shadow-lg relative overflow-hidden">
        {renderConfetti()}
        <div className="text-xs uppercase tracking-wider text-center font-medium text-muted-foreground mb-2">Sudoku Board</div>
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
      </div>
      
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-xl z-10">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-xs mx-auto border border-primary/20 animate-bounce-once">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Amazing!</h2>
            <p className="text-muted-foreground mb-6">You've successfully completed the puzzle!</p>
            <button 
              onClick={startNewGame}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg transition-all hover:bg-primary/90 font-medium w-full hover:shadow-md"
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