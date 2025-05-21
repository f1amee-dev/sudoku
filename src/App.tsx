import { useState } from 'react';
import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import { Difficulty } from './types/sudoku';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  
  const handleBackToMenu = () => {
    setGameStarted(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-secondary/30">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-2 text-primary">Sudoku</h1>
        <p className="text-muted-foreground">Challenge your mind with numbers</p>
      </header>
      
      {!gameStarted ? (
        <div className="w-full max-w-md p-8 rounded-2xl shadow-lg glass-panel">
          <h2 className="text-xl font-semibold mb-6 text-center">Select Difficulty</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { setDifficulty('easy'); setGameStarted(true); }}
              className="py-4 px-6 rounded-xl glass-button font-medium"
            >
              Easy
            </button>
            <button
              onClick={() => { setDifficulty('medium'); setGameStarted(true); }}
              className="py-4 px-6 rounded-xl glass-button font-medium"
            >
              Medium
            </button>
            <button
              onClick={() => { setDifficulty('hard'); setGameStarted(true); }}
              className="py-4 px-6 rounded-xl glass-button-primary font-medium shadow-sm"
            >
              Hard
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full max-w-4xl">
          <SudokuBoard 
            difficulty={difficulty} 
            onBackToMenu={handleBackToMenu}
          />
          <NumberPad />
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