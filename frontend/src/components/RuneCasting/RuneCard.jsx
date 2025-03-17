import React, { useState } from "react";
import "./RuneCard.css";

const RuneCard = ({ rune, position, spreadType, allSelectedRunes }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getPositionMeaning = () => {
    if (spreadType === "three" && position >= 1 && position <= 3) {
      return ["Past", "Present", "Future"][position - 1];
    } else if (spreadType === "five" && position >= 1 && position <= 5) {
      return [
        "Center/Self",
        "Above/Influence",
        "Right/Future",
        "Below/Foundation",
        "Left/Past",
      ][position - 1];
    }
    return "Single Rune Reading";
  };

  const getInterpretation = () => {
    const positionContext = getPositionMeaning();
    return `In the position of ${positionContext}, ${rune.name} (${
      rune.meaning
    }) suggests ${getContextualMeaning(positionContext)}.`;
  };

  const getContextualMeaning = (positionContext) => {
    // Add a safety check at the beginning
    if (!positionContext)
      return `the energy of ${rune.meaning.toLowerCase()} influencing your situation`;

    if (positionContext.includes("Past")) {
      return `past influences related to ${rune.meaning.toLowerCase()} that have shaped your current situation`;
    } else if (positionContext.includes("Present")) {
      return `current energies of ${rune.meaning.toLowerCase()} that are active in your life right now`;
    } else if (positionContext.includes("Future")) {
      return `potential developments involving ${rune.meaning.toLowerCase()} that may manifest soon`;
    } else if (positionContext.includes("Self")) {
      return `core aspects of ${rune.meaning.toLowerCase()} that are central to your question`;
    } else if (positionContext.includes("Influence")) {
      return `external forces of ${rune.meaning.toLowerCase()} that are affecting your situation`;
    } else if (positionContext.includes("Foundation")) {
      return `underlying factors of ${rune.meaning.toLowerCase()} that form the basis of your situation`;
    }

    return `the energy of ${rune.meaning.toLowerCase()} influencing your situation`;
  };

  // Find relationships with other runes in the current casting
  const getRelevantRelationships = () => {
    if (!rune.relationships || !allSelectedRunes) return [];

    return rune.relationships.filter((rel) =>
      allSelectedRunes.some(
        (selectedRune) =>
          selectedRune._id === rel.rune._id || selectedRune._id === rel.rune
      )
    );
  };

  const relevantRelationships = getRelevantRelationships();
  const hasRelevantRelationships = relevantRelationships.length > 0;

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

            <div className="rune-interpretation">
              <p>{getInterpretation()}</p>
            </div>

            {hasRelevantRelationships && (
              <div className="rune-relationships">
                <button
                  className="details-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(!showDetails);
                  }}
                >
                  {showDetails
                    ? "Hide Connections"
                    : "Show Connections to Other Runes"}
                </button>

                {showDetails && (
                  <ul className="relationships-list">
                    {relevantRelationships.map((rel, index) => {
                      const relatedRuneName =
                        rel.rune.name ||
                        allSelectedRunes.find((r) => r._id === rel.rune)
                          ?.name ||
                        "Unknown Rune";

                      return (
                        <li key={index}>
                          <span className="relationship-rune">
                            {relatedRuneName}
                          </span>
                          :
                          <span className="relationship-type">
                            {rel.relationshipType}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            <div className="rune-history">
              <p
                className="history-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
              >
                {showDetails ? "▲ Hide History" : "▼ Show History"}
              </p>

              {showDetails && <p className="history-text">{rune.history}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuneCard;
