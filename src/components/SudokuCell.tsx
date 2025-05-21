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
    isError ? 'error' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      data-row={row}
      data-col={col}
    >
      {value || ''}
    </div>
  );
};

export default SudokuCell; 