import { useState, useEffect } from "react";
import { useRuneDatabase } from "./useRuneDatabase";
import { useSavedReadings } from "./useSavedReadings";

export const useRuneCasting = () => {
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [castRunes, setCastRunes] = useState([]);
  const [interpretation, setInterpretation] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const { runes, loading: runesLoading } = useRuneDatabase();
  const { saveReading: saveReadingToStorage } = useSavedReadings();

  const selectSpread = (spread) => {
    setSelectedSpread(spread);
  };

  const castRunesForReading = () => {
    if (!selectedSpread || runesLoading) return;

    // Determine how many runes to cast based on spread type
    let runeCount = 3; // default
    if (selectedSpread.id === "five-rune") runeCount = 5;
    if (selectedSpread.id === "single-rune") runeCount = 1;

    // Randomly select runes
    const selectedRunes = [];
    const runesCopy = [...runes];

    for (let i = 0; i < runeCount; i++) {
      const randomIndex = Math.floor(Math.random() * runesCopy.length);
      selectedRunes.push(runesCopy[randomIndex]);
      runesCopy.splice(randomIndex, 1); // Remove selected rune to avoid duplicates
    }

    setCastRunes(selectedRunes);
    generateInterpretation(selectedRunes, selectedSpread);
    setIsReading(true);
  };

  const generateInterpretation = (selectedRunes, spread) => {
    // This would be more complex in a real implementation
    // Potentially could use AI or predefined interpretations

    const positions = selectedRunes.map((rune, index) => {
      let title = `Position ${index + 1}`;

      if (spread.id === "three-rune") {
        title = ["Past", "Present", "Future"][index];
      }

      return {
        title,
        meaning: `${rune.name} in this position suggests ${rune.meaning}`,
      };
    });

    setInterpretation({
      overall: "The runes have spoken. This reading suggests...",
      positions,
      advice: "Consider how these runes reflect your current situation.",
    });
  };

  const saveReading = () => {
    const readingToSave = {
      id: Date.now(),
      date: new Date().toISOString(),
      spread: selectedSpread,
      runes: castRunes,
      interpretation,
    };

    saveReadingToStorage(readingToSave);
    setSaveMessage("Your reading has been saved!");

    // Only use alert in browser environment, not in tests
    if (typeof window !== "undefined" && window.alert) {
      window.alert("Your reading has been saved!");
    }
  };

  const resetReading = () => {
    setIsReading(false);
    setSelectedSpread(null);
    setCastRunes([]);
    setInterpretation(null);
  };

  return {
    selectedSpread,
    castRunes,
    interpretation,
    isReading,
    saveMessage,
    selectSpread,
    castRunesForReading,
    saveReading,
    resetReading,
  };
};
