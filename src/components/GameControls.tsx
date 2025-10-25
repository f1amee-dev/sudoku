import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGameStore } from '@/lib/store';
import { Difficulty, GameMode, GameSettings, GRID_SIZE_OPTIONS } from '@/types/sudoku';

export const GameControls: React.FC = () => {
  const { settings, timer, mistakes, isComplete, resetGame, initializeGame } = useGameStore();
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [dialogStep, setDialogStep] = useState<'difficulty' | 'grid' | 'mode'>('difficulty');
  const [pendingSettings, setPendingSettings] = useState<GameSettings>(settings);
  
  const modeLabels: Record<GameMode, string> = {
    [GameMode.Classic]: 'Classic',
    [GameMode.Diagonal]: 'Diagonal',
  };

  const modeSummaries: Record<GameMode, string> = {
    [GameMode.Classic]: 'Standard Sudoku rules — keep each row, column, and box unique.',
    [GameMode.Diagonal]: 'Classic rules plus both main diagonals must also contain every symbol once.',
  };
  
  // Format timer as MM:SS
  const formattedTime = `${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`;
  
  // Increment timer every second
  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      useGameStore.getState().incrementTimer();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isComplete]);
  
  // Calculate difficulty progress
  const difficultyProgress = (() => {
    switch (settings.difficulty) {
      case Difficulty.Easy:
        return 25;
      case Difficulty.Medium:
        return 50;
      case Difficulty.Hard:
        return 75;
      case Difficulty.Expert:
        return 100;
      default:
        return 50;
    }
  })();
  
  const handleDialogOpenChange = (open: boolean) => {
    setShowNewGameDialog(open);
    if (open) {
      setDialogStep('difficulty');
      setPendingSettings(settings);
    }
  };

  const handleNextStep = () => {
    if (dialogStep === 'difficulty') {
      setDialogStep('grid');
    } else if (dialogStep === 'grid') {
      setDialogStep('mode');
    }
  };

  const handlePreviousStep = () => {
    if (dialogStep === 'mode') {
      setDialogStep('grid');
    } else if (dialogStep === 'grid') {
      setDialogStep('difficulty');
    }
  };

  const handleStartNewGame = () => {
    initializeGame(pendingSettings);
    setShowNewGameDialog(false);
  };

  const renderStepOptions = () => {
    if (dialogStep === 'difficulty') {
      return (
        <div className="grid grid-cols-2 gap-2">
          {[Difficulty.Easy, Difficulty.Medium, Difficulty.Hard, Difficulty.Expert].map((option) => (
            <Button
              key={option}
              variant={pendingSettings.difficulty === option ? 'default' : 'outline'}
              onClick={() => setPendingSettings(prev => ({ ...prev, difficulty: option }))}
            >
              {option}
            </Button>
          ))}
        </div>
      );
    }
    
    if (dialogStep === 'grid') {
      return (
        <div className="grid gap-2">
          {GRID_SIZE_OPTIONS.map(({ value, label }) => (
            <Button
              key={value}
              variant={pendingSettings.gridSize === value ? 'default' : 'outline'}
              className="justify-center"
              onClick={() => setPendingSettings(prev => ({ ...prev, gridSize: value }))}
            >
              {label}
            </Button>
          ))}
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <div className="grid gap-2">
          {[GameMode.Classic, GameMode.Diagonal].map((mode) => (
            <Button
              key={mode}
              variant={pendingSettings.mode === mode ? 'default' : 'outline'}
              className="justify-center"
              onClick={() => setPendingSettings(prev => ({ ...prev, mode }))}
            >
              {modeLabels[mode]}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          {modeSummaries[pendingSettings.mode]}
        </p>
      </div>
    );
  };
  
  const renderDialogDescription = () => {
    switch (dialogStep) {
      case 'difficulty':
        return 'Start by choosing how intense you want the puzzle to be.';
      case 'grid':
        return 'Change the canvas size to train on minis or tackle giant boards.';
      case 'mode':
        return 'Pick the rule set: Classic or Diagonal.';
      default:
        return '';
    }
  };
  
  return (
    <div className="w-full max-w-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm">Time: {formattedTime}</div>
        <div className="text-sm">Mistakes: {mistakes}</div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">Difficulty</span>
          <span className="text-xs font-medium">{settings.difficulty}</span>
        </div>
        <Progress value={difficultyProgress} className="h-2" />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{settings.gridSize} x {settings.gridSize}</span>
          <span className="capitalize">{settings.mode}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Dialog open={showNewGameDialog} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">New Game</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="capitalize">{dialogStep} selection</DialogTitle>
              <DialogDescription>{renderDialogDescription()}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {renderStepOptions()}
              <div className="flex justify-between">
                <Button variant="ghost" disabled={dialogStep === 'difficulty'} onClick={handlePreviousStep}>Back</Button>
                {dialogStep === 'mode' ? (
                  <Button onClick={handleStartNewGame}>Start game</Button>
                ) : (
                  <Button onClick={handleNextStep}>Next</Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button variant="secondary" className="flex-1" onClick={resetGame}>
          Reset
        </Button>
      </div>
      
      {isComplete && (
        <div className="mt-4 p-4 bg-primary/10 rounded-md text-center">
          <h3 className="font-bold text-lg">Puzzle Complete!</h3>
          <p className="text-sm">Time: {formattedTime} | Mistakes: {mistakes}</p>
          <Button className="mt-2" onClick={() => setShowNewGameDialog(true)}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}; 
