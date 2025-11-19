import { SudokuBoard } from '@/components/SudokuBoard';
import { NumberPad } from '@/components/NumberPad';
import { GameControls } from '@/components/GameControls';
import { ThemeToggle } from '@/components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 transition-colors duration-500">
      <div className="w-full max-w-5xl flex flex-col items-center gap-12">
        
        {/* Header Section */}
        <header className="w-full flex items-center justify-between max-w-md md:max-w-2xl lg:max-w-4xl">
          <div className="flex flex-col gap-1">
            <h1 className="text-5xl font-bold tracking-tighter text-primary">Sudoku</h1>
            <p className="text-muted-foreground font-medium">Find your focus.</p>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Game Area */}
        <main className="w-full flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-20">
          
          {/* Left Column: Board */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <SudokuBoard />
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="flex-1 w-full max-w-md flex flex-col gap-10 lg:pt-4">
             <GameControls />
             <NumberPad />
          </div>
          
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground font-medium">
          <p>Built by <a href="https://github.com/f1amee-dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Filip</a></p>
        </footer>

      </div>
    </div>
  );
}

export default App;