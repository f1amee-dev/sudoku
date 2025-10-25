import { create } from 'zustand';
import {
  CellPosition,
  Difficulty,
  GameMode,
  GameSettings,
  GameState,
  GridSize,
  SudokuBoardState,
  SudokuGrid,
} from '@/types/sudoku';
import { createPuzzle, generateSolvedGrid } from './sudokuGenerator';

const createInitialBoard = (puzzle: SudokuGrid): SudokuBoardState => {
  return puzzle.map((row) =>
    row.map((cell) => ({
      value: cell,
      isGiven: cell !== null,
      isValid: true,
      notes: []
    }))
  );
};

const DEFAULT_SETTINGS: GameSettings = {
  difficulty: Difficulty.Medium,
  gridSize: GridSize.Nine,
  mode: GameMode.Classic,
};

const baseSymbols = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const buildSymbolSet = (gridSize: GridSize): string[] => {
  if (gridSize <= 0) return [];
  if (gridSize <= baseSymbols.length) {
    return baseSymbols
      .slice(0, gridSize)
      .split('');
  }

  return Array.from({ length: gridSize }, (_, idx) => String(idx + 1));
};

const createInitialState = (settings: GameSettings): GameState => {
  const solution = generateSolvedGrid(settings);
  const puzzle = createPuzzle(solution, settings);
  const board = createInitialBoard(puzzle);
  const symbols = buildSymbolSet(settings.gridSize);
  
  return {
    board,
    originalBoard: puzzle,
    solution,
    selectedCell: null,
    settings,
    isComplete: false,
    timer: 0,
    mistakes: 0,
    isNoteMode: false,
    symbols,
  };
};

export const useGameStore = create<
  GameState & {
    initializeGame: (settings: GameSettings) => void;
    selectCell: (position: CellPosition) => void;
    setCellValue: (value: number | null) => void;
    toggleNoteMode: () => void;
    toggleCellNote: (value: number) => void;
    checkCompletion: () => void;
    incrementTimer: () => void;
    resetGame: () => void;
  }
>((set, get) => ({
  ...createInitialState(DEFAULT_SETTINGS),
  
  initializeGame: (settings) => {
    set(createInitialState(settings));
  },
  
  selectCell: (position) => {
    set({ selectedCell: position });
  },
  
  setCellValue: (value) => {
    const { selectedCell, board, solution, settings } = get();
    
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const cell = board[row][col];
    
    if (cell.isGiven) return;
    if (value !== null && (value < 1 || value > settings.gridSize)) return;
    
    const isValid = value === null || value === solution[row][col];
    const newMistakes = !isValid ? get().mistakes + 1 : get().mistakes;
    
    const newBoard = [...board];
    newBoard[row][col] = {
      ...cell,
      value,
      isValid,
      notes: []
    };
    
    set({
      board: newBoard,
      mistakes: newMistakes
    });
    
    get().checkCompletion();
  },
  
  toggleNoteMode: () => {
    set(state => ({ isNoteMode: !state.isNoteMode }));
  },
  
  toggleCellNote: (value) => {
    const { selectedCell, board, isNoteMode, settings } = get();
    
    if (!selectedCell || !isNoteMode) return;
    
    if (value < 1 || value > settings.gridSize) return;
    
    const { row, col } = selectedCell;
    const cell = board[row][col];
    
    if (cell.isGiven || cell.value !== null) return;
    
    const newNotes = cell.notes.includes(value)
      ? cell.notes.filter(n => n !== value)
      : [...cell.notes, value];
    
    const newBoard = [...board];
    newBoard[row][col] = {
      ...cell,
      notes: newNotes
    };
    
    set({ board: newBoard });
  },
  
  checkCompletion: () => {
    const { board, solution } = get();
    
    const isComplete = board.every((row, rowIndex) =>
      row.every((cell, colIndex) => 
        cell.value === solution[rowIndex][colIndex]
      )
    );
    
    set({ isComplete });
  },
  
  incrementTimer: () => {
    set(state => ({ timer: state.timer + 1 }));
  },
  
  resetGame: () => {
    const { settings } = get();
    set(createInitialState(settings));
  }
}));
