import { useState } from 'react';
import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import { Difficulty } from './types/sudoku';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [selectedMenuDifficulty, setSelectedMenuDifficulty] = useState<Difficulty | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  const handleBackToMenu = () => {
    setGameStarted(false);
    setSelectedMenuDifficulty(null);
  };

  const handleDifficultySelect = (selected: Difficulty) => {
    setSelectedMenuDifficulty(selected);
  };

  const handleStartGame = () => {
    if (selectedMenuDifficulty) {
      setDifficulty(selectedMenuDifficulty);
      setGameStarted(true);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-secondary/30">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-2 text-primary">Sudoku</h1>
          <p className="text-muted-foreground">Challenge your mind with numbers</p>
        </header>
        
        {!gameStarted ? (
          <div className="w-full max-w-md p-8 rounded-2xl shadow-lg glass-panel">
            <h2 className="text-xl font-semibold mb-6 text-center">Select Difficulty</h2>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleDifficultySelect('easy')}
                className={`py-4 px-6 rounded-xl ${selectedMenuDifficulty === 'easy' ? 'glass-button-primary' : 'glass-button'} font-medium`}
              >
                Easy
              </button>
              <button
                onClick={() => handleDifficultySelect('medium')}
                className={`py-4 px-6 rounded-xl ${selectedMenuDifficulty === 'medium' ? 'glass-button-primary' : 'glass-button'} font-medium`}
              >
                Medium
              </button>
              <button
                onClick={() => handleDifficultySelect('hard')}
                className={`py-4 px-6 rounded-xl ${selectedMenuDifficulty === 'hard' ? 'glass-button-primary' : 'glass-button'} font-medium`}
              >
                Hard
              </button>
            </div>
            <div className="mt-6">
              <button
                onClick={handleStartGame}
                disabled={!selectedMenuDifficulty}
                className={`w-full py-4 px-6 rounded-xl ${!selectedMenuDifficulty ? 'opacity-50 cursor-not-allowed' : ''} glass-button-primary font-medium`}
              >
                Start Game
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
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
    </div>
  );
}

export default App;