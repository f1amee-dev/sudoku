import { useState, useEffect } from 'react';
import { Difficulty } from '../types/sudoku';

interface GameControlsProps {
  onNewGame: () => void;
  difficulty: Difficulty;
}

const GameControls = ({ onNewGame, difficulty }: GameControlsProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // start timer when component mounts
  useEffect(() => {
    let interval: number | null = null;
    
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-white rounded-xl shadow-md border border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Difficulty</span>
        <span className="font-medium text-foreground capitalize">{difficulty}</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Time</span>
        <span className="font-mono font-medium text-foreground">{formatTime(timeElapsed)}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className="py-2 px-4 bg-secondary hover:bg-secondary/70 text-secondary-foreground rounded-lg transition-all text-sm font-medium"
          aria-label={isTimerRunning ? 'Pause game' : 'Resume game'}
        >
          {isTimerRunning ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={onNewGame}
          className="py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all text-sm font-medium"
          aria-label="Start a new game"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameControls; 