import { useState } from 'react';
import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import GameControls from './components/GameControls';
import { Difficulty } from './types/sudoku';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-secondary">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">Sudoku</h1>
        <p className="text-muted-foreground">Challenge your mind with numbers</p>
      </header>
      
      {!gameStarted ? (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-border/50">
          <h2 className="text-xl font-semibold mb-6 text-center">Select Difficulty</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { setDifficulty('easy'); setGameStarted(true); }}
              className="py-4 px-6 bg-secondary hover:bg-secondary/70 text-secondary-foreground rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] font-medium"
            >
              Easy
            </button>
            <button
              onClick={() => { setDifficulty('medium'); setGameStarted(true); }}
              className="py-4 px-6 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] font-medium"
            >
              Medium
            </button>
            <button
              onClick={() => { setDifficulty('hard'); setGameStarted(true); }}
              className="py-4 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] font-medium shadow-sm"
            >
              Hard
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center w-full max-w-4xl">
          <GameControls 
            onNewGame={() => setGameStarted(false)} 
            difficulty={difficulty}
          />
          <div className="flex flex-col md:flex-row gap-8 items-center w-full justify-center">
            <SudokuBoard difficulty={difficulty} />
            <NumberPad />
          </div>
        </div>
      )}
      
      <footer className="mt-10 text-sm text-muted-foreground">
        <span>Made with</span>
        <span className="mx-1 text-primary">♥</span>
        <span>and React + Tailwind</span>
      </footer>
    </div>
  );
}

export default App;