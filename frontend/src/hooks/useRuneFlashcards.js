import { useState, useEffect } from "react";
import { fetchRunes } from "../api/runeService"; // Corrected import path

export const useRuneFlashcards = () => {
  const [runes, setRunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Load runes on initialization
  useEffect(() => {
    const loadRunes = async () => {
      try {
        setLoading(true);
        const response = await fetchRunes();
        if (response.success) {
          console.log("Rune data from API:", response.data);
          setRunes(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError("Failed to load runes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRunes();
  }, []);

  // Flip the current card
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Navigate to the next card
  const nextCard = () => {
    // Fix: Properly update the current index
    setCurrentIndex((prevIndex) => {
      // If we're at the end, loop back to the beginning
      if (prevIndex >= runes.length - 1) {
        return 0;
      }
      // Otherwise, go to the next card
      return prevIndex + 1;
    });
    setIsFlipped(false);
  };

  // Navigate to the previous card
  const prevCard = () => {
    // Fix: Properly update the current index
    setCurrentIndex((prevIndex) => {
      // If we're at the beginning, loop to the end
      if (prevIndex <= 0) {
        return runes.length - 1;
      }
      // Otherwise, go to the previous card
      return prevIndex - 1;
    });
    setIsFlipped(false);
  };

  // Shuffle the cards
  const shuffleCards = () => {
    const shuffled = [...runes].sort(() => Math.random() - 0.5);
    setRunes(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return {
    runes,
    loading,
    error,
    currentIndex,
    currentRune: runes[currentIndex] || null,
    isFlipped,
    flipCard,
    nextCard,
    prevCard,
    shuffleCards,
  };
};
