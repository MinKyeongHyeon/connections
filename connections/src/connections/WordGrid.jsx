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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="grid">
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
            className={`py-3 px-2 rounded-md text-center border ${isSelected ? "bg-indigo-600 text-white shadow-lg scale-[0.98] animate-pop" : "bg-white text-gray-800 shadow-sm hover:shadow-md hover:scale-[1.02] animate-press"} ${isFocused ? "ring-2 ring-offset-2 ring-indigo-300" : ""} min-h-[60px] sm:min-h-[80px] flex items-center justify-center`}
          >
            {word}
          </button>
        );
      })}
    </div>
  );
}
