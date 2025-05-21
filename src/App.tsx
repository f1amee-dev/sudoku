import { useState } from 'react';
import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import GameControls from './components/GameControls';
import { Difficulty } from './types/sudoku';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-indigo-50 to-white">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-indigo-600">Sudoku</h1>
        <p className="text-indigo-400">Challenge your mind with a puzzle</p>
      </header>
      
      {!gameStarted ? (
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md border border-indigo-100">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Select Difficulty</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { setDifficulty('easy'); setGameStarted(true); }}
              className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors font-medium"
            >
              Easy
            </button>
            <button
              onClick={() => { setDifficulty('medium'); setGameStarted(true); }}
              className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
            >
              Medium
            </button>
            <button
              onClick={() => { setDifficulty('hard'); setGameStarted(true); }}
              className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors font-medium"
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
      
      <footer className="mt-8 text-sm text-indigo-400">
        Made with ♥ and React + Tailwind
      </footer>
    </div>
  );
}

export default App;