import React, { useState } from "react";

function ItemList() {
  // State for items (array)
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // Add item
  const addItem = () => {
    if (input.trim() === "") return;

    const newItem = {
      id: Date.now(), // unique key
      text: input
    };

    setItems([...items, newItem]);
    setInput("");
  };

  // Remove item
  const removeItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
      <h1 className="text-2xl font-bold mb-4 text-center">Item List</h1>

      {/* Input Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter item"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Add
        </button>
      </div>

      {/* List Display */}
      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items available</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>{item.text}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;
