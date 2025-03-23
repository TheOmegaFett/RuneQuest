import { useState } from "react";
import { useRuneCasting } from "../hooks/useRuneCasting";
import RuneCard from "../components/RuneCasting/RuneCard";
import "./styles/RuneCastingPage.css";

export const RuneCastingPage = () => {
  const {
    castRunesForReading,
    resetReading,
    castRunes: selectedRunes,
    loading,
  } = useRuneCasting();

  const [castingType, setCastingType] = useState("three");

  const handleCastRunes = () => {
    const count = castingType === "three" ? 3 : castingType === "five" ? 5 : 1;
    castRunesForReading(count);
  };

  return (
    <div className="rune-casting-test-page">
      <h1>Rune Casting</h1>

      <div className="casting-controls">
        <div className="casting-options">
          <label>
            <input
              type="radio"
              value="one"
              checked={castingType === "one"}
              onChange={() => setCastingType("one")}
            />
            Single Rune
          </label>
          <label>
            <input
              type="radio"
              value="three"
              checked={castingType === "three"}
              onChange={() => setCastingType("three")}
            />
            Three Rune Spread
          </label>
          <label>
            <input
              type="radio"
              value="five"
              checked={castingType === "five"}
              onChange={() => setCastingType("five")}
            />
            Five Rune Cross
          </label>
        </div>

        <div className="action-buttons">
          <button
            onClick={handleCastRunes}
            disabled={loading}
            className="cast-button"
          >
            {loading ? "Casting..." : "Cast Runes"}
          </button>

          <button
            onClick={resetReading}
            disabled={selectedRunes.length === 0 || loading}
            className="reset-button"
          >
            Reset
          </button>
        </div>
      </div>
      {selectedRunes.length > 0 && (
        <div className="casting-results">
          <h2>Your Reading</h2>
          <div className={`rune-spread spread-${castingType}`}>
            {selectedRunes.map((rune, index) => (
              <div key={index} className={`position-${index + 1}`}>
                <RuneCard
                  rune={rune}
                  position={index + 1}
                  spreadType={castingType}
                  allSelectedRunes={selectedRunes}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RuneCastingPage;
