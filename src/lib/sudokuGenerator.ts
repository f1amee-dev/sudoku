import { CellValue, Difficulty, SudokuGrid } from "@/types/sudoku";

// generate a solved sudoku grid
export function generateSolvedGrid(): SudokuGrid {
  const grid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // fill diagonal boxes first (these can be filled independently)
  fillDiagonalBoxes(grid);
  
  // solve the rest of the grid
  solveGrid(grid);
  
  return grid;
}

// fill the three diagonal 3x3 boxes
function fillDiagonalBoxes(grid: SudokuGrid): void {
  for (let box = 0; box < 9; box += 3) {
    fillBox(grid, box, box);
  }
}

// fill a 3x3 box starting at the given row and column
function fillBox(grid: SudokuGrid, startRow: number, startCol: number): void {
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let numIndex = 0;
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      grid[startRow + row][startCol + col] = numbers[numIndex++];
    }
  }
}

// solve the grid using backtracking
function solveGrid(grid: SudokuGrid): boolean {
  const emptyCell = findEmptyCell(grid);
  
  // if no empty cells, the grid is solved
  if (!emptyCell) return true;
  
  const [row, col] = emptyCell;
  
  // try each number 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;
      
      if (solveGrid(grid)) {
        return true;
      }
      
      // if this number doesn't lead to a solution, backtrack
      grid[row][col] = null;
    }
  }
  
  return false;
}

// find an empty cell in the grid
function findEmptyCell(grid: SudokuGrid): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return [row, col];
      }
    }
  }
  return null;
}

// check if a number can be placed in a given position
function isValidPlacement(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // check row
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num) return false;
  }
  
  // check column
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }
  
  // check 3x3 box
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;
  
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[boxStartRow + r][boxStartCol + c] === num) return false;
    }
  }
  
  return true;
}

// shuffle an array using Fisher-Yates algorithm
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

// create a puzzle by removing numbers from a solved grid
export function createPuzzle(solvedGrid: SudokuGrid, difficulty: Difficulty): SudokuGrid {
  // create a deep copy of the solved grid
  const puzzle: SudokuGrid = JSON.parse(JSON.stringify(solvedGrid));
  
  // determine how many cells to remove based on difficulty
  let cellsToRemove: number;
  switch (difficulty) {
    case Difficulty.Easy:
      cellsToRemove = 36; // ~40% removed
      break;
    case Difficulty.Medium:
      cellsToRemove = 45; // ~50% removed
      break;
    case Difficulty.Hard:
      cellsToRemove = 54; // ~60% removed
      break;
    case Difficulty.Expert:
      cellsToRemove = 63; // ~70% removed
      break;
    default:
      cellsToRemove = 45;
  }
  
  // create a list of all cell positions
  const positions: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  
  // shuffle the positions
  const shuffledPositions = shuffle(positions);
  
  // remove cells
  for (let i = 0; i < cellsToRemove; i++) {
    const [row, col] = shuffledPositions[i];
    puzzle[row][col] = null;
  }
  
  return puzzle;
}

// check if a value is valid for a given position
export function isValidValue(grid: SudokuGrid, row: number, col: number, value: number): boolean {
  // create a temporary grid with the value inserted
  const tempGrid = JSON.parse(JSON.stringify(grid));
  tempGrid[row][col] = value;
  
  // check if the value is valid in the row
  for (let c = 0; c < 9; c++) {
    if (c !== col && tempGrid[row][c] === value) return false;
  }
  
  // check if the value is valid in the column
  for (let r = 0; r < 9; r++) {
    if (r !== row && tempGrid[r][col] === value) return false;
  }
  
  // check if the value is valid in the 3x3 box
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;
  
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currentRow = boxStartRow + r;
      const currentCol = boxStartCol + c;
      if ((currentRow !== row || currentCol !== col) && 
          tempGrid[currentRow][currentCol] === value) {
        return false;
      }
    }
  }
  
  return true;
}

// check if the puzzle is complete
export function isPuzzleComplete(grid: SudokuGrid): boolean {
  // check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) return false;
    }
  }
  
  // check if all rows are valid
  for (let row = 0; row < 9; row++) {
    const values = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col];
      if (value !== null) {
        if (values.has(value)) return false;
        values.add(value);
      }
    }
  }
  
  // check if all columns are valid
  for (let col = 0; col < 9; col++) {
    const values = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const value = grid[row][col];
      if (value !== null) {
        if (values.has(value)) return false;
        values.add(value);
      }
    }
  }
  
  // check if all 3x3 boxes are valid
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const values = new Set<number>();
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const value = grid[boxRow * 3 + row][boxCol * 3 + col];
          if (value !== null) {
            if (values.has(value)) return false;
            values.add(value);
          }
        }
      }
    }
  }
  
  return true;
} 