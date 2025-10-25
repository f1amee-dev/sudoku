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

export enum GridSize {
  Four = 4,
  Nine = 9,
  Sixteen = 16
}

export const GRID_SIZE_OPTIONS = [
  { value: GridSize.Four, label: "4 x 4", description: "2x2 boxes" },
  { value: GridSize.Nine, label: "9 x 9", description: "3x3 boxes" },
  { value: GridSize.Sixteen, label: "16 x 16", description: "4x4 boxes" }
] as const;

export enum GameMode {
  Classic = "classic",
  Diagonal = "diagonal"
}

export type GameSettings = {
  difficulty: Difficulty;
  gridSize: GridSize;
  mode: GameMode;
};

export type GameState = {
  board: SudokuBoardState;
  originalBoard: SudokuGrid;
  solution: SudokuGrid;
  selectedCell: CellPosition | null;
  settings: GameSettings;
  isComplete: boolean;
  timer: number;
  mistakes: number;
  isNoteMode: boolean;
  symbols: string[];
};
