import { useState } from "react";
import PropTypes from "prop-types";
import "./RuneFlashcard.css";

export const RuneFlashcard = ({ rune, englishLetters, isFlipped, onFlip }) => {
  return (
    <div className={`flashcard ${isFlipped ? "flipped" : ""}`} onClick={onFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="rune-symbol">{rune}</div>
        </div>
        <div className="flashcard-back">
          <div className="english-letters">{englishLetters}</div>
        </div>
      </div>
    </div>
  );
};

RuneFlashcard.propTypes = {
  rune: PropTypes.string.isRequired,
  englishLetters: PropTypes.string.isRequired,
  isFlipped: PropTypes.bool.isRequired,
  onFlip: PropTypes.func.isRequired,
};
