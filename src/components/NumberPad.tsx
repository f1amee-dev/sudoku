import React from 'react';

interface NumberPadProps {}

const NumberPad: React.FC<NumberPadProps> = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleNumberClick = (number: number) => {
    // simulate keyboard press event to reuse existing logic
    const event = new KeyboardEvent('keydown', {
      key: number.toString(),
      bubbles: true
    });
    document.dispatchEvent(event);
  };

  const handleClearClick = () => {
    // simulate keyboard delete event
    const event = new KeyboardEvent('keydown', {
      key: 'Delete',
      bubbles: true
    });
    document.dispatchEvent(event);
  };

  // color variations for number buttons
  const getButtonColor = (number: number) => {
    const colors = [
      'from-blue-50 to-blue-100 text-blue-600',
      'from-purple-50 to-purple-100 text-purple-600',
      'from-indigo-50 to-indigo-100 text-indigo-600',
    ];
    return colors[number % 3];
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <div className="text-xs uppercase tracking-wider text-center font-medium text-muted-foreground">Number Pad</div>
      <div className="number-pad grid grid-cols-3 gap-3">
        {numbers.map(number => (
          <button
            key={number}
            className={`p-4 bg-gradient-to-br ${getButtonColor(number)} rounded-xl text-lg font-bold transition-all shadow-sm hover:shadow-md border border-border/10 hover:scale-105 active:scale-95`}
            onClick={() => handleNumberClick(number)}
            aria-label={`Enter number ${number}`}
          >
            {number}
          </button>
        ))}
      </div>
      <button
        className="p-4 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-destructive rounded-xl font-medium transition-all shadow-sm hover:shadow-md border border-border/30 hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleClearClick}
        aria-label="Clear cell"
      >
        <span className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Clear
        </span>
      </button>
    </div>
  );
};

export default NumberPad; 