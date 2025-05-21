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
          className="p-4 rounded-xl glass-button text-lg font-medium text-primary"
          onClick={() => handleNumberClick(number)}
          aria-label={`Enter ${number}`}
        >
          {number}
        </button>
      ))}
      <button
        className="p-4 rounded-xl glass-button text-destructive col-span-3 font-medium"
        onClick={handleClearClick}
        aria-label="Clear selected cell"
      >
        Clear
      </button>
    </div>
  );
};

export default NumberPad; 