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
    <div className="number-pad grid grid-cols-3 gap-3 w-full max-w-xs">
      {numbers.map(number => (
        <button
          key={number}
          className="p-4 bg-white hover:bg-secondary rounded-xl text-lg font-medium transition-all shadow-sm border border-border/30 text-primary"
          onClick={() => handleNumberClick(number)}
        >
          {number}
        </button>
      ))}
      <button
        className="p-4 bg-white hover:bg-destructive/10 text-destructive rounded-xl col-span-3 font-medium transition-all shadow-sm border border-border/30"
        onClick={handleClearClick}
      >
        Clear
      </button>
    </div>
  );
};

export default NumberPad; 