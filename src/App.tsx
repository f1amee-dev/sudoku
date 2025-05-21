import { useState } from 'react';
import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import GameControls from './components/GameControls';
import { Difficulty } from './types/sudoku';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-secondary/30 to-primary/20">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-2 text-primary drop-shadow-sm">Sudoku</h1>
        <p className="text-muted-foreground text-lg">Challenge your mind with numbers</p>
      </header>
      
      {!gameStarted ? (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-border/50 transform transition-all hover:shadow-xl">
          <h2 className="text-2xl font-semibold mb-8 text-center text-foreground">Select Difficulty</h2>
          <div className="flex flex-col gap-5">
            <button
              onClick={() => { setDifficulty('easy'); setGameStarted(true); }}
              className="group py-5 px-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-lg">Easy</span>
                <span className="text-xs bg-white/80 px-2 py-1 rounded-full">Beginner friendly</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button
              onClick={() => { setDifficulty('medium'); setGameStarted(true); }}
              className="group py-5 px-6 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-lg">Medium</span>
                <span className="text-xs bg-white/80 px-2 py-1 rounded-full">Balanced challenge</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button
              onClick={() => { setDifficulty('hard'); setGameStarted(true); }}
              className="group py-5 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-sm relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-lg">Hard</span>
                <span className="text-xs bg-white/80 px-2 py-1 rounded-full">Expert only</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
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
      
      <footer className="mt-12 text-sm text-muted-foreground flex items-center gap-2">
        <span>Made with</span>
        <span className="text-primary animate-pulse">♥</span>
        <span>and React + Tailwind</span>
      </footer>
    </div>
  );
}

export default App;