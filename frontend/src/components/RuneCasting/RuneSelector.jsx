import React from "react";

const spreadTypes = [
  {
    id: "three-rune",
    name: "Three Rune Spread",
    description: "Past, Present, Future",
  },
  {
    id: "five-rune",
    name: "Five Rune Cross",
    description: "Detailed situation analysis",
  },
  { id: "single-rune", name: "Single Rune", description: "Quick guidance" },
];

const RuneSelector = ({ onSelectSpread, onCastRunes }) => {
  return (
    <div className="rune-selector">
      <h2>Select Your Spread</h2>
      <div className="spread-options">
        {spreadTypes.map((spread) => (
          <div
            key={spread.id}
            className="spread-option"
            onClick={() => onSelectSpread(spread)}
          >
            <h3>{spread.name}</h3>
            <p>{spread.description}</p>
          </div>
        ))}
      </div>
      <button className="cast-runes-button" onClick={onCastRunes}>
        Cast Runes
      </button>
    </div>
  );
};

export default RuneSelector;
