export type Difficulty = 'easy' | 'medium' | 'hard';

export type CellValue = number | null;

export type SudokuGrid = CellValue[][];

export interface CellPosition {
  row: number;
  col: number;
}

export interface Cell extends CellPosition {
  value: CellValue;
  isReadOnly: boolean;
  isSelected: boolean;
  isError: boolean;
}

export interface GameState {
  grid: SudokuGrid;
  solution: SudokuGrid;
  selectedCell: CellPosition | null;
  notes: Record<string, number[]>;
  completed: boolean;
  timeElapsed: number;
  mistakes: number;
} 