import { useRuneFlashcards } from "../hooks/useRuneFlashcards";
import { RuneFlashcard } from "../components/RuneFlashcard/RuneFlashcard";
import { FlashcardControls } from "../components/RuneFlashcard/FlashcardControls";
import "./RuneLearningPage.css";

export const RuneLearningPage = () => {
  const {
    currentRune,
    isFlipped,
    loading: isLoading,
    error,
    runes,
    currentIndex,
    flipCard,
    nextCard,
    prevCard: previousCard,
    shuffleCards,
  } = useRuneFlashcards();

  if (isLoading) {
    return <div className="loading">Loading runes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!currentRune) {
    return <div className="no-runes">No runes available</div>;
  }

  return (
    <div className="rune-learning-page">
      <h1>Learn the Runes</h1>
      <p className="instructions">
        Click on the card to reveal the English letter equivalent.
      </p>
      <RuneFlashcard
        rune={currentRune.symbol}
        englishLetters={currentRune.englishEquivalent}
        isFlipped={isFlipped}
        onFlip={flipCard}
      />

      <FlashcardControls
        onPrevious={previousCard}
        onNext={nextCard}
        onShuffle={shuffleCards}
        currentIndex={currentIndex}
        totalRunes={runes.length}
      />
    </div>
  );
};
