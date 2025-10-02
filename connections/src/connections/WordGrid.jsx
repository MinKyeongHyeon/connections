import React from "react";

export default function WordGrid({
  words,
  selected,
  toggleWord,
  handleKeyDown,
  focusedIndex,
  setFocusedIndex,
}) {
  return (
    <div className="grid grid-cols-4 gap-3" role="grid">
      {words.map((word, i) => {
        const isSelected = selected.includes(word);
        const isFocused = focusedIndex === i;
        return (
          <button
            key={word}
            role="gridcell"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, word)}
            onClick={() => toggleWord(word, i)}
            onFocus={() => setFocusedIndex(i)}
            className={`py-3 px-2 rounded-md text-center border ${isSelected ? "bg-blue-600 text-white" : "bg-white text-gray-800"} ${isFocused ? "ring-2 ring-offset-2 ring-blue-300" : ""}`}
          >
            {word}
          </button>
        );
      })}
    </div>
  );
}
