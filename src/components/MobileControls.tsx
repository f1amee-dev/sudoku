import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Pencil, Eraser, Plus, RotateCcw } from 'lucide-react';
import { NewGameDialog } from './NewGameDialog';

export const MobileControls: React.FC = () => {
  const { setCellValue, toggleNoteMode, isNoteMode, toggleCellNote, symbols, settings, resetGame } = useGameStore();
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);

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

  const is9x9 = settings.gridSize === 9;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 pb-8 z-50 md:hidden">
        <div className="max-w-md mx-auto space-y-3">
            
            {/* Tools Row */}
            <div className="flex items-center justify-between gap-2">
                <Button
                  variant={isNoteMode ? "default" : "secondary"}
                  size="sm"
                  onClick={toggleNoteMode}
                  className={cn(
                    "flex-1 h-10 rounded-lg text-sm font-medium transition-all",
                     isNoteMode ? "" : "bg-secondary/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Notes
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowNewGameDialog(true)}
                    className="flex-1 h-10 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={resetGame}
                     className="flex-1 h-10 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart
                </Button>
            </div>

            {/* Number Grid */}
            <div className={cn(
                "grid gap-2",
                is9x9 ? "grid-cols-5" : "grid-cols-6"
            )}>
                {symbols.map((label, index) => (
                    <Button
                        key={`${label}-${index}`}
                        variant="ghost"
                        className="h-12 w-full p-0 rounded-lg text-xl font-semibold bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-colors border border-border/50"
                        onClick={() => handleNumberClick(index + 1)}
                    >
                        {label}
                    </Button>
                ))}
                
                {/* Erase Button */}
                 <Button
                    variant="ghost"
                    onClick={handleEraseClick}
                    className={cn(
                        "h-12 w-full p-0 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors border border-destructive/20",
                        !is9x9 && "col-span-2" 
                    )}
                >
                    <Eraser className="w-5 h-5" />
                </Button>
            </div>
        </div>
      </div>
      
      <NewGameDialog open={showNewGameDialog} onOpenChange={setShowNewGameDialog} />
    </>
  );
};
