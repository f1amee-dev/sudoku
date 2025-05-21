import { useState } from 'react';
import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import GameControls from './components/GameControls';
import { generateSudoku, solveSudoku } from './lib/sudokuGenerator';
import { Difficulty } from './types/sudoku';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Sudoku Game</h1>
        <p className="text-muted-foreground">Challenge your mind with a puzzle</p>
      </header>
      
      {!gameStarted ? (
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Select Difficulty</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { setDifficulty('easy'); setGameStarted(true); }}
              className="py-3 px-4 bg-primary/10 hover:bg-primary/20 text-primary-foreground rounded-md transition-colors"
            >
              Easy
            </button>
            <button
              onClick={() => { setDifficulty('medium'); setGameStarted(true); }}
              className="py-3 px-4 bg-primary/10 hover:bg-primary/20 text-primary-foreground rounded-md transition-colors"
            >
              Medium
            </button>
            <button
              onClick={() => { setDifficulty('hard'); setGameStarted(true); }}
              className="py-3 px-4 bg-primary/10 hover:bg-primary/20 text-primary-foreground rounded-md transition-colors"
            >
              Hard
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center">
          <GameControls 
            onNewGame={() => setGameStarted(false)} 
            difficulty={difficulty}
          />
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <SudokuBoard difficulty={difficulty} />
            <NumberPad />
          </div>
        </div>
      )}
      
      <footer className="mt-8 text-sm text-muted-foreground">
        Made with ♥ and React + Tailwind
      </footer>
    </div>
  );
}

export default App;