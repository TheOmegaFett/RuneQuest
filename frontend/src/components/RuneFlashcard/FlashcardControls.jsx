import PropTypes from "prop-types";
import "./FlashcardControls.css";

export const FlashcardControls = ({
  onPrevious,
  onNext,
  onShuffle,
  currentIndex,
  totalRunes,
}) => {
  // Determine if buttons should be disabled
  const isDisabled = totalRunes <= 1;

  return (
    <div className="flashcard-controls">
      <button
        className="control-btn"
        onClick={onPrevious}
        disabled={isDisabled}
      >
        Previous
      </button>

      <div className="progress-indicator">
        {totalRunes > 0 ? `${currentIndex + 1} / ${totalRunes}` : "0 / 0"}
      </div>

      <button className="control-btn" onClick={onNext} disabled={isDisabled}>
        Next
      </button>

      <button
        className="control-btn shuffle-btn"
        onClick={onShuffle}
        disabled={isDisabled}
      >
        Shuffle
      </button>
    </div>
  );
};

FlashcardControls.propTypes = {
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onShuffle: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  totalRunes: PropTypes.number.isRequired,
};
