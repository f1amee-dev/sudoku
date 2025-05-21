import { CellValue } from '../types/sudoku';

interface SudokuCellProps {
  value: CellValue;
  row: number;
  col: number;
  isReadOnly: boolean;
  isSelected: boolean;
  isError: boolean;
  onClick: () => void;
}

const SudokuCell = ({
  value,
  row,
  col,
  isReadOnly,
  isSelected,
  isError,
  onClick
}: SudokuCellProps) => {
  const classNames = [
    'sudoku-cell',
    isSelected ? 'selected' : '',
    isReadOnly ? 'readonly' : '',
    isError ? 'error' : '',
    // add subtle background color to every other 3x3 box for better visual separation
    ((Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 0) ? 'bg-white' : 'bg-indigo-50'
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      data-row={row}
      data-col={col}
      aria-selected={isSelected}
      role="gridcell"
    >
      {value || ''}
    </div>
  );
};

export default SudokuCell; 