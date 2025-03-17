import { useState, useEffect } from "react";
import { fetchRunes } from "../api/runeService";

export const useRuneFlashcards = () => {
  const [runes, setRunes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRunes = async () => {
      try {
        setIsLoading(true);
        const runeData = await fetchRunes();
        console.log("Rune data from API:", runeData);
        setRunes(runeData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadRunes();
  }, []);

  const flipCard = () => setIsFlipped(!isFlipped);

  const nextCard = () => {
    // First set flipped to false, then change the card in the next render cycle
    setIsFlipped(false);

    // Use setTimeout to ensure the flip happens first
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % runes.length);
    }, 300); // Half the flip animation duration
  };

  const previousCard = () => {
    // First set flipped to false, then change the card in the next render cycle
    setIsFlipped(false);

    // Use setTimeout to ensure the flip happens first
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + runes.length) % runes.length
      );
    }, 300); // Half the flip animation duration
  };

  const shuffleCards = () => {
    setIsFlipped(false);
    setRunes([...runes].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  return {
    currentRune: runes[currentIndex],
    isFlipped,
    isLoading,
    error,
    totalRunes: runes.length,
    currentIndex,
    flipCard,
    nextCard,
    previousCard,
    shuffleCards,
  };
};
