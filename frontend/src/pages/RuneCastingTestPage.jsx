import { useState } from "react";
import { useRuneCasting } from "../hooks/useRuneCasting";
import RuneCard from "../components/RuneCasting/RuneCard";
import "./RuneCastingTestPage.css";

export const RuneCastingTestPage = () => {
  const { castRunes, selectedRunes, resetCasting, isLoading } =
    useRuneCasting();
  const [castingType, setCastingType] = useState("three");

  const handleCastRunes = () => {
    const count = castingType === "three" ? 3 : castingType === "five" ? 5 : 1;
    castRunes(count);
  };

  return (
    <div className="rune-casting-test-page">
      <h1>Rune Casting Test</h1>

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
            disabled={isLoading}
            className="cast-button"
          >
            {isLoading ? "Casting..." : "Cast Runes"}
          </button>

          <button
            onClick={resetCasting}
            disabled={selectedRunes.length === 0 || isLoading}
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
      <div className="testing-notes">
        <h3>Testing Notes</h3>
        <ul>
          <li>
            Try different spread types and verify correct number of runes appear
          </li>
          <li>Check that runes are randomly selected from the database</li>
          <li>Verify that the reset button clears the current reading</li>
          <li>Test the responsive layout on different screen sizes</li>
        </ul>
      </div>
    </div>
  );
};
