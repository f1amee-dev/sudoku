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
    <div className="number-pad grid grid-cols-3 gap-2 w-full max-w-xs bg-white p-4 rounded-xl shadow-md border border-indigo-100">
      {numbers.map(number => (
        <button
          key={number}
          className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-lg font-medium transition-colors"
          onClick={() => handleNumberClick(number)}
        >
          {number}
        </button>
      ))}
      <button
        className="p-3 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-500 rounded-lg col-span-3 text-sm font-medium transition-colors"
        onClick={handleClearClick}
      >
        Clear
      </button>
    </div>
  );
};

export default NumberPad; 