import React from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useGameStore } from '@/lib/store';

export const NumberPad: React.FC = () => {
  const { setCellValue, toggleNoteMode, isNoteMode, toggleCellNote, symbols, settings } = useGameStore();
  
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
  
  const padColumns = Math.min(settings.gridSize, 9);
  
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
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${padColumns}, minmax(0, 1fr))` }}>
        {symbols.map((label, index) => (
          <Button
            key={`${label}-${index}`}
            variant="secondary"
            className="h-10 w-full"
            onClick={() => handleNumberClick(index + 1)}
          >
            {label}
          </Button>
        ))}
      </div>

      {settings.gridSize > 9 && (
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Keyboard shortcuts follow the order shown on the pad (1-9, then A-Z).
        </p>
      )}
    </div>
  );
};
