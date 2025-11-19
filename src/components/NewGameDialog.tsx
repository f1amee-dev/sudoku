import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGameStore } from '@/lib/store';
import { Difficulty, GameMode, GameSettings, GRID_SIZE_OPTIONS } from '@/types/sudoku';

interface NewGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewGameDialog: React.FC<NewGameDialogProps> = ({ open, onOpenChange }) => {
  const { settings, initializeGame } = useGameStore();
  const [pendingSettings, setPendingSettings] = useState<GameSettings>(settings);

  const handleStartNewGame = () => {
    initializeGame(pendingSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-2 border-muted bg-background p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">New Game</DialogTitle>
          <DialogDescription className="text-center text-base">
            Customize your next challenge.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          {/* Difficulty */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider text-center">Difficulty</h4>
            <div className="grid grid-cols-2 gap-3">
              {[Difficulty.Easy, Difficulty.Medium, Difficulty.Hard, Difficulty.Expert].map((d) => (
                <Button
                  key={d}
                  variant={pendingSettings.difficulty === d ? "default" : "outline"}
                  onClick={() => setPendingSettings(s => ({...s, difficulty: d}))}
                  className="h-11 rounded-lg capitalize border-2"
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid Size */}
           <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider text-center">Grid Size</h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {GRID_SIZE_OPTIONS.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={pendingSettings.gridSize === value ? "default" : "outline"}
                  onClick={() => setPendingSettings(s => ({...s, gridSize: value}))}
                  className="h-11 rounded-lg whitespace-nowrap flex-1 border-2"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="space-y-3">
             <h4 className="text-sm font-bold text-primary uppercase tracking-wider text-center">Mode</h4>
             <div className="grid grid-cols-2 gap-3">
                {[GameMode.Classic, GameMode.Diagonal].map(m => (
                  <Button
                    key={m}
                    variant={pendingSettings.mode === m ? "default" : "outline"}
                    onClick={() => setPendingSettings(s => ({...s, mode: m}))}
                    className="h-11 rounded-lg capitalize border-2"
                  >
                    {m}
                  </Button>
                ))}
             </div>
          </div>

          <Button size="lg" className="w-full h-14 rounded-xl text-lg mt-4" onClick={handleStartNewGame}>
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
