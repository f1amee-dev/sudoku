import { useState, useEffect } from 'react';
import { Difficulty } from '../types/sudoku';

interface GameControlsProps {
  onNewGame: () => void;
  difficulty: Difficulty;
  onSolve?: () => void;
}

const GameControls = ({ onNewGame, difficulty, onSolve }: GameControlsProps) => {
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
    <div className="w-full max-w-md mx-auto p-5 rounded-xl glass-panel flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Difficulty</span>
        <span className="font-medium text-foreground capitalize">{difficulty}</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Time</span>
        <span className="font-mono font-medium text-foreground">{formatTime(timeElapsed)}</span>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className="py-2 px-4 rounded-lg glass-button text-sm font-medium"
          aria-label={isTimerRunning ? 'Pause game' : 'Resume game'}
        >
          {isTimerRunning ? 'Pause' : 'Resume'}
        </button>
        
        {onSolve && (
          <button
            onClick={onSolve}
            className="py-2 px-4 rounded-lg glass-button text-sm font-medium"
            aria-label="Solve the puzzle automatically"
          >
            Solve
          </button>
        )}
        
        <button
          onClick={onNewGame}
          className="py-2 px-4 rounded-lg glass-button-primary text-sm font-medium"
          aria-label="Start a new game"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameControls; 