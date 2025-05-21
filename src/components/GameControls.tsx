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

  // get difficulty color based on selected level
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-primary';
      case 'hard': return 'text-red-600';
      default: return 'text-primary';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-border/30 transform transition-all hover:shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Difficulty</span>
          <span className={`font-medium text-lg capitalize ${getDifficultyColor()}`}>{difficulty}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Time</span>
          <div className="bg-secondary/50 px-4 py-2 rounded-lg font-mono font-medium text-foreground">
            {formatTime(timeElapsed)}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`py-2 px-4 ${isTimerRunning ? 'bg-secondary' : 'bg-primary/10'} hover:bg-secondary/70 text-secondary-foreground rounded-lg transition-all text-sm font-medium flex items-center gap-2 hover:scale-105 active:scale-95`}
            aria-label={isTimerRunning ? 'Pause game' : 'Resume game'}
          >
            {isTimerRunning ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Resume
              </>
            )}
          </button>
          <button
            onClick={onNewGame}
            className="py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all text-sm font-medium flex items-center gap-2 hover:scale-105 active:scale-95"
            aria-label="Start a new game"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls; 