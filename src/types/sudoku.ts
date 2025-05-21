export type CellValue = number | null;

export type SudokuGrid = CellValue[][];

export type CellPosition = {
  row: number;
  col: number;
};

export type CellState = {
  value: CellValue;
  isGiven: boolean;
  isValid: boolean;
  notes: number[];
};

export type SudokuBoardState = CellState[][];

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Expert = "expert"
}

export type GameState = {
  board: SudokuBoardState;
  originalBoard: SudokuGrid;
  solution: SudokuGrid;
  selectedCell: CellPosition | null;
  difficulty: Difficulty;
  isComplete: boolean;
  timer: number;
  mistakes: number;
  isNoteMode: boolean;
}; 