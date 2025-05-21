import React from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useGameStore } from '@/lib/store';

export const NumberPad: React.FC = () => {
  const { setCellValue, toggleNoteMode, isNoteMode, toggleCellNote } = useGameStore();
  
  const handleNumberClick = (value: number) => {
    if (isNoteMode) {
      toggleCellNote(value);
    } else {
      setCellValue(value);
    }
  };
  
  const handleEraseClick = () => {
    setCellValue(null);
  };
  
  return (
    <div className="w-full max-w-md mt-4">
      <div className="flex justify-between items-center mb-2">
        <Toggle
          pressed={isNoteMode}
          onPressedChange={toggleNoteMode}
          aria-label="Toggle notes mode"
          className="text-sm"
        >
          Notes
        </Toggle>
        <Button
          variant="outline"
          onClick={handleEraseClick}
          className="text-sm"
        >
          Erase
        </Button>
      </div>
      <div className="grid grid-cols-9 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            variant="secondary"
            className="h-10 w-full"
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </Button>
        ))}
      </div>
    </div>
  );
}; 