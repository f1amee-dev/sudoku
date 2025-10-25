# Sudoku Game

A modern Sudoku web application built with React, TypeScript, Tailwind CSS, and Shadcn/ui.

## Features

- Multiple grid sizes (4x4, 9x9, 16x16) tailored to 2x2, 3x3, or 4x4 boxes
- Three game modes: Classic, Diagonal, and Knight (anti-knight training rule)
- Guaranteed-solvable puzzles for every difficulty
- Note-taking mode, mistake tracking, and in-game timer
- Dark/light theme toggle and responsive layout

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: Zustand

## Project Structure

```
src/
├── components/         # UI components
│   ├── ui/             # Shadcn UI components
│   ├── SudokuBoard.tsx # Main game board
│   ├── SudokuCell.tsx  # Individual cell component
│   ├── NumberPad.tsx   # Number input controls
│   ├── GameControls.tsx # Game controls and status
│   └── ThemeToggle.tsx # Dark/light mode toggle
├── lib/
│   ├── store.ts        # Zustand state management
│   ├── sudokuGenerator.ts # Puzzle generation logic
│   └── utils.ts        # Utility functions
├── types/
│   └── sudoku.ts       # TypeScript type definitions
└── App.tsx             # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/f1amee-dev/sudoku.git
cd sudoku
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Game Logic

- Solved grids are produced with a backtracking generator, honoring the selected constraints (Classic, Diagonal, or Knight)
- Puzzles are carved from solved boards while re-checking that exactly one solution remains per difficulty
- Diagonal mode enforces both main diagonals; Knight mode bans matching digits a knight move away (great for spotting L-shaped conflicts)
- Notes mode allows players to mark potential values for empty cells

## Performance Optimizations

- Component memoization to prevent unnecessary re-renders
- Efficient state management with Zustand
- CSS optimizations with Tailwind's JIT compiler

## License

MIT
