import React, { useState } from "react";

const RuneCard = ({ rune, position, spreadType }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getPositionMeaning = () => {
    if (spreadType === "three-rune") {
      return ["Past", "Present", "Future"][position];
    }
    // Add position meanings for other spread types
    return `Position ${position + 1}`;
  };

  return (
    <div
      className={`rune-card ${isFlipped ? "flipped" : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
      data-testid="rune-card"
    >
      <div className="rune-card-inner">
        <div className="rune-card-front">
          <div className="rune-back-design"></div>
        </div>

        {isFlipped && (
          <div className="rune-card-back">
            <h3>{rune.name}</h3>
            <div className="rune-symbol">{rune.symbol}</div>
            <p className="position-meaning">{getPositionMeaning()}</p>
            <p className="rune-meaning">{rune.meaning}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default RuneCard;
