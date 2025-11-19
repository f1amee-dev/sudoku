import React from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Pencil, Eraser } from 'lucide-react';

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
  
  return (
    <div className="w-full space-y-5">
      {/* Tools Row */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={isNoteMode ? "default" : "outline"}
          size="lg"
          onClick={toggleNoteMode}
          className={cn(
            "h-12 rounded-xl transition-all duration-200 border-2",
            isNoteMode ? "border-primary" : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Pencil className="w-5 h-5 mr-2" />
          Notes {isNoteMode ? "On" : "Off"}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleEraseClick}
          className="h-12 rounded-xl border-2 text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/5 transition-colors"
        >
          <Eraser className="w-5 h-5 mr-2" />
          Erase
        </Button>
      </div>

      {/* Number Grid */}
      <div className="grid grid-cols-5 gap-3">
        {symbols.map((label, index) => (
          <Button
            key={`${label}-${index}`}
            variant="secondary"
            className="h-14 w-full rounded-xl text-2xl font-medium bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-colors border-2 border-transparent hover:border-primary"
            onClick={() => handleNumberClick(index + 1)}
          >
            {label}
          </Button>
        ))}
      </div>

      {settings.gridSize > 9 && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Keyboard: 1-9, then A-Z
        </p>
      )}
    </div>
  );
};