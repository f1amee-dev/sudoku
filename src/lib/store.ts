import { create } from 'zustand';
import { CellPosition, Difficulty, GameState, SudokuBoardState, SudokuGrid } from '@/types/sudoku';
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

const createInitialState = (difficulty: Difficulty): GameState => {
  const solution = generateSolvedGrid();
  const puzzle = createPuzzle(solution, difficulty);
  const board = createInitialBoard(puzzle);
  
  return {
    board,
    originalBoard: puzzle,
    solution,
    selectedCell: null,
    difficulty,
    isComplete: false,
    timer: 0,
    mistakes: 0,
    isNoteMode: false
  };
};

export const useGameStore = create<
  GameState & {
    initializeGame: (difficulty: Difficulty) => void;
    selectCell: (position: CellPosition) => void;
    setCellValue: (value: number | null) => void;
    toggleNoteMode: () => void;
    toggleCellNote: (value: number) => void;
    checkCompletion: () => void;
    incrementTimer: () => void;
    resetGame: () => void;
  }
>((set, get) => ({
  ...createInitialState(Difficulty.Medium),
  
  initializeGame: (difficulty) => {
    set(createInitialState(difficulty));
  },
  
  selectCell: (position) => {
    set({ selectedCell: position });
  },
  
  setCellValue: (value) => {
    const { selectedCell, board, solution } = get();
    
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const cell = board[row][col];
    
    if (cell.isGiven) return;
    
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
    const { selectedCell, board, isNoteMode } = get();
    
    if (!selectedCell || !isNoteMode) return;
    
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
    const { difficulty } = get();
    set(createInitialState(difficulty));
  }
})); 