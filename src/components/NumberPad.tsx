import React from 'react';

const NumberPad = () => {
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

  return (
    <div className="number-pad grid grid-cols-3 gap-2 w-full max-w-xs">
      {numbers.map(number => (
        <button
          key={number}
          className="p-3 bg-card hover:bg-accent text-foreground rounded-md text-lg font-medium transition-colors"
          onClick={() => handleNumberClick(number)}
        >
          {number}
        </button>
      ))}
      <button
        className="p-3 bg-destructive/10 hover:bg-destructive/20 text-destructive-foreground rounded-md col-span-3 text-sm font-medium transition-colors"
        onClick={handleClearClick}
      >
        Clear
      </button>
    </div>
  );
};

export default NumberPad; 