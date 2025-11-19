import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/lib/store';
import { RotateCcw, Trophy, Plus } from 'lucide-react';
import { NewGameDialog } from './NewGameDialog';

export const GameControls: React.FC = () => {
  const { settings, timer, isComplete, resetGame } = useGameStore();
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  
  const formattedTime = `${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`;
  
  return (
    <div className="w-full space-y-6">
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
            size="lg" 
            className="w-full h-14 text-base font-semibold rounded-xl transition-all hover:translate-y-[-2px]"
            onClick={() => setShowNewGameDialog(true)}
        >
            <Plus className="w-5 h-5 mr-2" />
            New Game
        </Button>

        <Button variant="outline" size="lg" onClick={resetGame} className="w-full h-14 text-base font-medium rounded-xl border-2 hover:bg-secondary transition-colors">
          <RotateCcw className="w-5 h-5 mr-2" />
          Restart
        </Button>
      </div>
      
      <NewGameDialog open={showNewGameDialog} onOpenChange={setShowNewGameDialog} />

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
