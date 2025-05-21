import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGameStore } from '@/lib/store';
import { Difficulty } from '@/types/sudoku';

export const GameControls: React.FC = () => {
  const { difficulty, timer, mistakes, isComplete, resetGame, initializeGame } = useGameStore();
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  
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
    switch (difficulty) {
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
  
  const handleNewGame = (newDifficulty: Difficulty) => {
    initializeGame(newDifficulty);
    setShowNewGameDialog(false);
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
          <span className="text-xs font-medium">{difficulty}</span>
        </div>
        <Progress value={difficultyProgress} className="h-2" />
      </div>
      
      <div className="flex gap-2">
        <Dialog open={showNewGameDialog} onOpenChange={setShowNewGameDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">New Game</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Difficulty</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button onClick={() => handleNewGame(Difficulty.Easy)}>Easy</Button>
              <Button onClick={() => handleNewGame(Difficulty.Medium)}>Medium</Button>
              <Button onClick={() => handleNewGame(Difficulty.Hard)}>Hard</Button>
              <Button onClick={() => handleNewGame(Difficulty.Expert)}>Expert</Button>
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