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
  const getBorderStyles = () => {
    let classes = "";
    
    // right borders for 3x3 grid
    if (col === 2 || col === 5) {
      classes += " border-r-2 border-r-indigo-200";
    }
    
    // bottom borders for 3x3 grid
    if (row === 2 || row === 5) {
      classes += " border-b-2 border-b-indigo-200";
    }
    
    return classes;
  };

  return (
    <div
      className={`
        flex items-center justify-center aspect-square
        text-lg font-medium transition-all duration-200
        ${isSelected ? 'bg-indigo-100' : 'bg-white hover:bg-indigo-50'}
        ${isReadOnly ? 'font-bold text-indigo-600' : 'text-indigo-800'}
        ${isError ? 'text-red-500' : ''}
        ${getBorderStyles()}
      `}
      onClick={onClick}
      data-row={row}
      data-col={col}
    >
      {value || ''}
    </div>
  );
};

export default SudokuCell; 