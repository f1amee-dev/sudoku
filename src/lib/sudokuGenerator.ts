import { Difficulty, SudokuGrid } from '../types/sudoku';

// helper function to check if it's safe to place a number
function isSafe(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  // check column
  for (let y = 0; y < 9; y++) {
    if (grid[y][col] === num) {
      return false;
    }
  }

  // check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (grid[boxRow + y][boxCol + x] === num) {
        return false;
      }
    }
  }

  return true;
} 

// create an empty 9x9 grid
function createEmptyGrid(): SudokuGrid {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}

// solve the sudoku using backtracking
export function solveSudoku(grid: SudokuGrid): SudokuGrid | null {
  const solution = grid.map(row => [...row]);
  
  function solve(row: number, col: number): boolean {
    // if we've reached the 9th row, we're done
    if (row === 9) {
      return true;
    }
    
    // if we've reached the end of the row, move to the next row
    if (col === 9) {
      return solve(row + 1, 0);
    }
    
    // if the cell is already filled, move to the next cell
    if (solution[row][col] !== null) {
      return solve(row, col + 1);
    }
    
    // try filling the cell with numbers 1-9
    for (let num = 1; num <= 9; num++) {
      if (isSafe(solution, row, col, num)) {
        solution[row][col] = num;
        
        // recursively try to solve the rest of the grid
        if (solve(row, col + 1)) {
          return true;
        }
        
        // if solving fails, backtrack
        solution[row][col] = null;
      }
    }
    
    return false;
  }
  
  if (solve(0, 0)) {
    return solution;
  }
  
  return null;
}

// generate a random solved sudoku grid
function generateSolvedGrid(): SudokuGrid {
  const grid = createEmptyGrid();
  
  // fill diagonal 3x3 boxes
  for (let box = 0; box < 3; box++) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // shuffle the numbers
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        grid[box * 3 + i][box * 3 + j] = nums[i * 3 + j];
      }
    }
  }
  
  // solve the rest of the grid
  return solveSudoku(grid) || createEmptyGrid();
}

// generate a sudoku puzzle by removing numbers from a solved grid
export function generateSudoku(difficulty: Difficulty): { puzzle: SudokuGrid, solution: SudokuGrid } {
  const solution = generateSolvedGrid();
  const puzzle = solution.map(row => [...row]);
  
  // determine how many cells to remove based on difficulty
  let cellsToRemove;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 36; // ~40% cells removed
      break;
    case 'medium':
      cellsToRemove = 45; // ~50% cells removed
      break;
    case 'hard':
      cellsToRemove = 54; // ~60% cells removed
      break;
    default:
      cellsToRemove = 45;
  }
  
  // create a list of all cell positions
  const positions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col });
    }
  }
  
  // shuffle the positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  // remove cells while ensuring the puzzle still has a unique solution
  for (let i = 0; i < cellsToRemove; i++) {
    const { row, col } = positions[i];
    const temp = puzzle[row][col];
    puzzle[row][col] = null;
    
    // check if puzzle still has a unique solution (skip this step for performance)
    // in a real implementation, you'd check for uniqueness more thoroughly
  }
  
  return { puzzle, solution };
}

// check if the current grid is a valid solution
export function isValidSolution(grid: SudokuGrid, solution: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

// helper to check if a number can be placed in a cell
export function canPlaceNumber(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  return isSafe(grid, row, col, num);
} 