import { useState } from 'react';
import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import GameControls from './components/GameControls';
import { Difficulty } from './types/sudoku';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-indigo-50/40">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-1 text-indigo-600">Sudoku</h1>
        <p className="text-gray-500">challenge your mind with numbers</p>
      </header>
      
      {!gameStarted ? (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200/50">
          <h2 className="text-xl font-semibold mb-6 text-center">select difficulty</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { setDifficulty('easy'); setGameStarted(true); }}
              className="py-4 px-6 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] font-medium"
            >
              Easy
            </button>
            <button
              onClick={() => { setDifficulty('medium'); setGameStarted(true); }}
              className="py-4 px-6 bg-indigo-100/50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] font-medium"
            >
              Medium
            </button>
            <button
              onClick={() => { setDifficulty('hard'); setGameStarted(true); }}
              className="py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] font-medium shadow-sm"
            >
              Hard
            </button>
          </div>
        </div>
      ) : (
        <div className="game-container">
          <GameControls 
            onNewGame={() => setGameStarted(false)} 
            difficulty={difficulty}
          />
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-6">
            <div className="relative">
              <SudokuBoard difficulty={difficulty} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 text-center md:text-left">number pad</h3>
              <NumberPad />
            </div>
          </div>
        </div>
      )}
      
      <footer className="mt-8 text-sm text-gray-500 flex items-center gap-1">
        <span>made with</span>
        <span className="text-indigo-600">♥</span>
        <span>and react + tailwind</span>
      </footer>
    </div>
  );
}

export default App;