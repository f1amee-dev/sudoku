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
    <div className="game-controls w-full max-w-md mx-auto p-4 bg-card rounded-lg shadow flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">Difficulty</span>
        <span className="font-medium capitalize">{difficulty}</span>
      </div>

      <div className="flex flex-col text-center">
        <span className="text-sm text-muted-foreground">Time</span>
        <span className="font-mono font-medium">{formatTime(timeElapsed)}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className="p-2 bg-accent/50 hover:bg-accent text-accent-foreground rounded-md text-sm"
        >
          {isTimerRunning ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={onNewGame}
          className="p-2 bg-primary/10 hover:bg-primary/20 text-primary-foreground rounded-md text-sm"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameControls; 