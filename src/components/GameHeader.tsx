import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useGameStore } from '@/lib/store';
import { Clock, AlertCircle } from 'lucide-react';

export const GameHeader: React.FC = () => {
  const { timer, mistakes } = useGameStore();
  const formattedTime = `${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`;

  return (
    <header className="w-full flex flex-col gap-4 mb-4 md:mb-8">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Sudoku</h1>
          <p className="text-muted-foreground text-xs md:text-sm font-medium hidden md:block">Find your focus.</p>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
           {/* Mobile Stats - visible only on small screens */}
           <div className="flex md:hidden items-center gap-3 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/50">
              <div className="flex items-center gap-1.5 text-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-sm font-medium tracking-wider">{formattedTime}</span>
              </div>
              <div className="w-px h-4 bg-border/50" />
              <div className="flex items-center gap-1.5 text-foreground">
                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                <span className="font-mono text-sm font-medium">{mistakes}</span>
              </div>
           </div>

           <ThemeToggle />
        </div>
      </div>

      {/* Desktop Stats - visible only on medium+ screens */}
      <div className="hidden md:flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
        <div className="flex items-center gap-3 text-foreground">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-mono text-xl font-medium tracking-wider">{formattedTime}</span>
        </div>
        
        <div className="flex items-center gap-3 text-foreground">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <span className="font-mono text-xl font-medium">{mistakes}</span>
        </div>
      </div>
    </header>
  );
};
