import { useEffect } from 'react';
import { SudokuBoard } from '@/components/SudokuBoard';
import { NumberPad } from '@/components/NumberPad';
import { GameControls } from '@/components/GameControls';
import { GameHeader } from '@/components/GameHeader';
import { MobileControls } from '@/components/MobileControls';
import { useGameStore } from '@/lib/store';

function App() {
  const { isComplete, incrementTimer } = useGameStore();

  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      incrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isComplete, incrementTimer]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-4 md:py-12 px-4 transition-colors duration-500">
      <div className="w-full max-w-5xl flex flex-col items-center md:gap-12">
        
        <GameHeader />

        {/* Main Game Area */}
        <main className="w-full flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-20 mb-60 md:mb-0">
          
          {/* Left Column: Board */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <SudokuBoard />
            </div>
          </div>

          {/* Right Column: Controls (Desktop) */}
          <div className="hidden md:flex flex-1 w-full max-w-md flex-col gap-10 lg:pt-4">
             <GameControls />
             <NumberPad />
          </div>
          
        </main>

        <MobileControls />

        {/* Footer */}
        <footer className="hidden md:block mt-12 text-center text-sm text-muted-foreground font-medium">
          <p>Built by <a href="https://github.com/f1amee-dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Filip</a></p>
        </footer>

      </div>
    </div>
  );
}

export default App;
