import React, { useState } from "react";

function Counter() {
  // useState Hook to store counter value
  const [count, setCount] = useState(0); // initial value = 0

  // Increment function
  const increment = () => {
    setCount(count + 1);
  };

  // Decrement function
  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
      <h1 className="text-2xl font-bold mb-4">Counter App</h1>

      {/* Display counter value */}
      <p className="text-3xl font-semibold mb-6">{count}</p>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Decrease
        </button>

        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Increase
        </button>
      </div>
    </div>
  );
}

export default Counter;
