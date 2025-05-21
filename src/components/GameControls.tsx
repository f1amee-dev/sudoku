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
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-md border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-indigo-400">Difficulty</span>
        <span className="font-medium text-indigo-600 capitalize">{difficulty}</span>
      </div>

      <div className="flex flex-col text-center">
        <span className="text-sm text-indigo-400">Time</span>
        <span className="font-mono font-medium text-indigo-600">{formatTime(timeElapsed)}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-600 text-sm font-medium transition-colors"
        >
          {isTimerRunning ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={onNewGame}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameControls; 