import React from "react";

const ReadingInterpretation = ({ interpretation }) => {
  return (
    <div className="reading-interpretation">
      <h2>Your Reading</h2>
      <div className="interpretation-content">
        <p className="overall-meaning">{interpretation.overall}</p>

        {interpretation.positions.map((pos, index) => (
          <div key={index} className="position-interpretation">
            <h3>{pos.title}</h3>
            <p>{pos.meaning}</p>
          </div>
        ))}

        <div className="advice-section">
          <h3>Guidance</h3>
          <p>{interpretation.advice}</p>
        </div>
      </div>
    </div>
  );
};

export default ReadingInterpretation;
