import { Difficulty, GameMode, GameSettings, SudokuGrid } from "@/types/sudoku";

const REMOVAL_RATES: Record<Difficulty, number> = {
  [Difficulty.Easy]: 0.4,
  [Difficulty.Medium]: 0.5,
  [Difficulty.Hard]: 0.6,
  [Difficulty.Expert]: 0.7,
};

// generate a solved sudoku grid for the requested settings
export function generateSolvedGrid(settings: GameSettings): SudokuGrid {
  const size = settings.gridSize as number;
  const boxSize = getBoxSize(size);

  if (!Number.isInteger(boxSize)) {
    throw new Error(`Grid size ${size} does not have a whole-number box edge.`);
  }

  const grid: SudokuGrid = createEmptyGrid(size);
  fillDiagonalBoxes(grid, size, boxSize, settings.mode);
  const solved = solveGrid(grid, size, boxSize, settings.mode);

  if (!solved) {
    throw new Error('Failed to generate a solved grid for the requested settings.');
  }

  return grid;
}

export function createPuzzle(solution: SudokuGrid, settings: GameSettings): SudokuGrid {
  const size = settings.gridSize as number;
  const totalCells = size * size;
  const removalRate = REMOVAL_RATES[settings.difficulty] ?? 0.5;
  const cellsToRemove = Math.floor(totalCells * removalRate);

  const puzzle: SudokuGrid = solution.map(row => [...row]);
  const positions: [number, number][] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      positions.push([row, col]);
    }
  }

  const shuffled = shuffle(positions);
  let removed = 0;

  for (let i = 0; i < shuffled.length && removed < cellsToRemove; i++) {
    const [row, col] = shuffled[i];
    const currentValue = puzzle[row][col];
    if (currentValue === null) continue;

    puzzle[row][col] = null;

    if (hasUniqueSolution(puzzle, settings)) {
      removed++;
    } else {
      puzzle[row][col] = currentValue;
    }
  }

  return puzzle;
}

export function isValidValue(grid: SudokuGrid, row: number, col: number, value: number, sizeOverride?: number): boolean {
  const size = sizeOverride ?? grid.length;
  const boxSize = getBoxSize(size);

  // check row
  for (let c = 0; c < size; c++) {
    if (c !== col && grid[row][c] === value) return false;
  }

  // check column
  for (let r = 0; r < size; r++) {
    if (r !== row && grid[r][col] === value) return false;
  }

  // check box
  const boxStartRow = Math.floor(row / boxSize) * boxSize;
  const boxStartCol = Math.floor(col / boxSize) * boxSize;

  for (let r = 0; r < boxSize; r++) {
    for (let c = 0; c < boxSize; c++) {
      const currentRow = boxStartRow + r;
      const currentCol = boxStartCol + c;
      if ((currentRow !== row || currentCol !== col) && grid[currentRow][currentCol] === value) {
        return false;
      }
    }
  }

  return true;
}

export function isPuzzleComplete(grid: SudokuGrid, settings: GameSettings): boolean {
  const size = settings.gridSize as number;
  const boxSize = getBoxSize(size);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === null) return false;
    }
  }

  for (let row = 0; row < size; row++) {
    const values = new Set<number>();
    for (let col = 0; col < size; col++) {
      const value = grid[row][col];
      if (value === null || values.has(value)) return false;
      values.add(value);
    }
  }

  for (let col = 0; col < size; col++) {
    const values = new Set<number>();
    for (let row = 0; row < size; row++) {
      const value = grid[row][col];
      if (value === null || values.has(value)) return false;
      values.add(value);
    }
  }

  for (let boxRow = 0; boxRow < boxSize; boxRow++) {
    for (let boxCol = 0; boxCol < boxSize; boxCol++) {
      const values = new Set<number>();
      for (let row = 0; row < boxSize; row++) {
        for (let col = 0; col < boxSize; col++) {
          const value = grid[boxRow * boxSize + row][boxCol * boxSize + col];
          if (value === null || values.has(value)) return false;
          values.add(value);
        }
      }
    }
  }

  if (settings.mode === GameMode.Diagonal) {
    const mainDiag = new Set<number>();
    const antiDiag = new Set<number>();

    for (let i = 0; i < size; i++) {
      const mainValue = grid[i][i];
      const antiValue = grid[i][size - 1 - i];
      if (mainValue === null || mainDiag.has(mainValue)) return false;
      if (antiValue === null || antiDiag.has(antiValue)) return false;
      mainDiag.add(mainValue);
      antiDiag.add(antiValue);
    }
  }

  return true;
}

function createEmptyGrid(size: number): SudokuGrid {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function fillDiagonalBoxes(grid: SudokuGrid, size: number, boxSize: number, mode: GameMode): void {
  for (let box = 0; box < size; box += boxSize) {
    const seeded = fillBox(grid, box, box, boxSize, size, mode);
    if (!seeded) {
      throw new Error('Failed to seed diagonal boxes for the requested settings.');
    }
  }
}

function fillBox(
  grid: SudokuGrid,
  startRow: number,
  startCol: number,
  boxSize: number,
  size: number,
  mode: GameMode
): boolean {
  const numbers = Array.from({ length: size }, (_, idx) => idx + 1);
  const cellPositions: Array<[number, number]> = [];

  for (let row = 0; row < boxSize; row++) {
    for (let col = 0; col < boxSize; col++) {
      cellPositions.push([startRow + row, startCol + col]);
      grid[startRow + row][startCol + col] = null;
    }
  }

  const used = new Set<number>();
  const candidates = shuffle(numbers);

  const fillCell = (index: number): boolean => {
    if (index === cellPositions.length) {
      return true;
    }

    const [row, col] = cellPositions[index];

    for (const num of candidates) {
      if (used.has(num)) continue;
      if (!isValidPlacement(grid, row, col, num, size, boxSize, mode)) continue;

      grid[row][col] = num;
      used.add(num);

      if (fillCell(index + 1)) {
        return true;
      }

      grid[row][col] = null;
      used.delete(num);
    }

    return false;
  };

  return fillCell(0);
}

function solveGrid(grid: SudokuGrid, size: number, boxSize: number, mode: GameMode): boolean {
  const emptyCell = findEmptyCell(grid, size);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;
  const candidates = shuffle(Array.from({ length: size }, (_, idx) => idx + 1));

  for (const num of candidates) {
    if (isValidPlacement(grid, row, col, num, size, boxSize, mode)) {
      grid[row][col] = num;
      if (solveGrid(grid, size, boxSize, mode)) {
        return true;
      }
      grid[row][col] = null;
    }
  }

  return false;
}

function findEmptyCell(grid: SudokuGrid, size: number): [number, number] | null {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === null) {
        return [row, col];
      }
    }
  }
  return null;
}

function isValidPlacement(
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number,
  size: number,
  boxSize: number,
  mode: GameMode
): boolean {
  for (let c = 0; c < size; c++) {
    if (grid[row][c] === num) return false;
  }

  for (let r = 0; r < size; r++) {
    if (grid[r][col] === num) return false;
  }

  const boxStartRow = Math.floor(row / boxSize) * boxSize;
  const boxStartCol = Math.floor(col / boxSize) * boxSize;

  for (let r = 0; r < boxSize; r++) {
    for (let c = 0; c < boxSize; c++) {
      if (grid[boxStartRow + r][boxStartCol + c] === num) return false;
    }
  }

  if (mode === GameMode.Diagonal) {
    if (row === col) {
      for (let i = 0; i < size; i++) {
        if (grid[i][i] === num) return false;
      }
    }

    if (row + col === size - 1) {
      for (let i = 0; i < size; i++) {
        if (grid[i][size - 1 - i] === num) return false;
      }
    }
  }

  return true;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getBoxSize(size: number): number {
  return Math.sqrt(size);
}

function hasUniqueSolution(puzzle: SudokuGrid, settings: GameSettings): boolean {
  const workingGrid: SudokuGrid = puzzle.map(row => [...row]);
  const size = workingGrid.length;
  const boxSize = getBoxSize(size);
  let solutionCount = 0;

  const search = (): void => {
    if (solutionCount > 1) {
      return;
    }

    const emptyCell = findEmptyCell(workingGrid, size);
    if (!emptyCell) {
      solutionCount += 1;
      return;
    }

    const [row, col] = emptyCell;
    for (let num = 1; num <= size; num++) {
      if (isValidPlacement(workingGrid, row, col, num, size, boxSize, settings.mode)) {
        workingGrid[row][col] = num;
        search();
        if (solutionCount > 1) {
          return;
        }
        workingGrid[row][col] = null;
      }
    }
  };

  search();
  return solutionCount === 1;
}
