import React, { useState } from "react";
import RuneSelector from "./RuneSelector";
import RuneSpread from "./RuneSpread";
import ReadingInterpretation from "./ReadingInterpretation";
import SaveReadingButton from "./SaveReadingButton";
import { useRuneCasting } from "../../hooks/useRuneCasting";

const RuneCastingPage = () => {
  const {
    selectedSpread,
    castRunes,
    interpretation,
    isReading,
    selectSpread,
    castRunesForReading,
    saveReading,
  } = useRuneCasting();

  return (
    <div className="rune-casting-container">
      <h1>Rune Casting</h1>

      {!isReading ? (
        <RuneSelector
          onSelectSpread={selectSpread}
          onCastRunes={castRunesForReading}
        />
      ) : (
        <>
          <RuneSpread spread={selectedSpread} runes={castRunes} />
          <ReadingInterpretation interpretation={interpretation} />
          <SaveReadingButton onSave={saveReading} />
        </>
      )}
    </div>
  );
};

export default RuneCastingPage;
