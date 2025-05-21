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
    <div className="w-full max-w-[200px] mx-auto">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {numbers.map(number => (
          <button
            key={number}
            className="p-3 rounded-lg glass-button text-lg font-medium text-primary aspect-square flex items-center justify-center"
            onClick={() => handleNumberClick(number)}
            aria-label={`Enter ${number}`}
          >
            {number}
          </button>
        ))}
      </div>
      <button
        className="p-2 rounded-lg glass-button text-destructive w-full font-medium"
        onClick={handleClearClick}
        aria-label="Clear selected cell"
      >
        Clear
      </button>
    </div>
  );
};

export default NumberPad; 