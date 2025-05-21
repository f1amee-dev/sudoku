import { SudokuBoard } from '@/components/SudokuBoard';
import { NumberPad } from '@/components/NumberPad';
import { GameControls } from '@/components/GameControls';
import { ThemeToggle } from '@/components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <ThemeToggle />
      
      <h1 className="text-3xl font-bold mb-6">Sudoku</h1>
      
      <div className="w-full max-w-md flex flex-col items-center">
        <GameControls />
        <SudokuBoard />
        <NumberPad />
      </div>
      
      <footer className="mt-8 text-xs text-muted-foreground flex flex-col items-center">
        <div>
          Built with React, TypeScript, Tailwind CSS, and Shadcn/ui
        </div>
        <div className="mt-2">
          Made with <span className="text-red-500">❤</span> by <a href="https://github.com/f1amee-dev/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Filip</a>
        </div>
        <div className="mt-1">
          &copy; {new Date().getFullYear()} All rights reserved
        </div>
      </footer>
    </div>
  );
}

export default App;
