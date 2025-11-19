import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGameStore } from '@/lib/store';
import { Difficulty, GameMode, GameSettings, GRID_SIZE_OPTIONS } from '@/types/sudoku';
import { Clock, RotateCcw, Trophy, AlertCircle, Plus } from 'lucide-react';

export const GameControls: React.FC = () => {
  const { settings, timer, mistakes, isComplete, resetGame, initializeGame } = useGameStore();
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<GameSettings>(settings);
  
  const formattedTime = `${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`;
  
  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      useGameStore.getState().incrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isComplete]);
  
  const handleStartNewGame = () => {
    initializeGame(pendingSettings);
    setShowNewGameDialog(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Info Card */}
      <div className="flex items-center justify-between p-5 bg-secondary/30 rounded-2xl border border-border">
        <div className="flex items-center gap-3 text-foreground">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-mono text-xl font-medium tracking-wider">{formattedTime}</span>
        </div>
        
        <div className="flex items-center gap-3 text-foreground">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <span className="font-mono text-xl font-medium">{mistakes}</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Dialog open={showNewGameDialog} onOpenChange={setShowNewGameDialog}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full h-14 text-base font-semibold rounded-xl transition-all hover:translate-y-[-2px]">
              <Plus className="w-5 h-5 mr-2" />
              New Game
            </Button>
          </DialogTrigger>
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
        
        <Button variant="outline" size="lg" onClick={resetGame} className="w-full h-14 text-base font-medium rounded-xl border-2 hover:bg-secondary transition-colors">
          <RotateCcw className="w-5 h-5 mr-2" />
          Restart
        </Button>
      </div>
      
      {/* Completion Card */}
      {isComplete && (
        <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/20 text-center animate-in fade-in zoom-in duration-500">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">Puzzle Solved!</h3>
          <p className="text-muted-foreground mb-6">
            You completed the {settings.difficulty} puzzle in {formattedTime}.
          </p>
          <Button size="lg" className="w-full rounded-xl" onClick={() => setShowNewGameDialog(true)}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};