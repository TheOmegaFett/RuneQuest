import { useState, useEffect } from "react";
import { useUserJwt } from "./useUserJwt";
import { fetchRunes } from "../api/runeService"; // Corrected import path

export const useRuneCasting = () => {
  // Correct function name
  const [userJwt] = useUserJwt();
  const [runes, setRunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpread, setSelectedSpread] = useState(null); // Initialize as null
  const [castRunes, setCastRunes] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [selectedRunes, setSelectedRunes] = useState([]);
  const [interpretation, setInterpretation] = useState(null);

  // Load runes on initialization
  useEffect(() => {
    const loadRunes = async () => {
      try {
        setLoading(true);
        const response = await fetchRunes();
        if (response.success) {
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

  // Add the missing selectSpread function
  const selectSpread = (spread) => {
    setSelectedSpread(spread);
    setCastRunes([]);
    setIsReading(false);
    setInterpretation(null);
  };
  // Cast runes for a reading
  const castRunesForReading = (count) => {
    setLoading(true);

    // Simulate API call or random selection
    setTimeout(() => {
      // Select 'count' random runes from your rune data
      const selectedRunes = runes
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
        .map((rune, index) => ({
          ...rune,
          position: index + 1,
          reversed: Math.random() > 0.5, // 50% chance of being reversed
        }));

      setCastRunes(selectedRunes);
      setIsReading(true);
      setLoading(false);
    }, 500);
  };
  // Save a reading
  const saveReading = async (notes) => {
    if (!userJwt.accessToken || !isReading || castRunes.length === 0) {
      return {
        success: false,
        error: "Invalid reading state or not logged in",
      };
    }

    try {
      // Format the reading data
      const readingData = {
        userId: userJwt.userId,
        spreadType: selectedSpread.name,
        runes: castRunes.map((rune) => ({
          runeId: rune._id,
          position: rune.position,
          reversed: rune.reversed,
        })),
        notes: notes || "",
        date: new Date().toISOString(),
      };

      // Call API to save reading (implement this in your service)
      // const response = await saveRuneReading(readingData);
      // return response;

      // For now, just return a mock success response
      return { success: true, data: { id: "mock-reading-id" } };
    } catch (err) {
      console.error("Error saving reading:", err);
      return { success: false, error: "Failed to save reading" };
    }
  };

  // Reset the reading
  const resetReading = () => {
    setCastRunes([]);
    setIsReading(false);
    setInterpretation(null);
  };

  // Generate interpretation for the reading
  const generateInterpretation = () => {
    if (!isReading || castRunes.length === 0) return;

    // Generate a simple interpretation based on the runes
    const interpretationText = castRunes
      .map((rune) => {
        const positionText = rune.position;
        const runeText = rune.name;
        const meaningText = rune.meaning;
        const reversedText = rune.reversed ? "reversed" : "upright";

        return `In the position of ${positionText}, ${runeText} (${meaningText}) ${reversedText} suggests ${
          rune.reversed ? "challenges related to" : "the energy of"
        } ${meaningText} influencing your situation.`;
      })
      .join("\n\n");

    setInterpretation(interpretationText);
  };

  // For testing purposes only
  const _setTestRunes = (testRunes) => {
    setCastRunes(testRunes);
  };

  const _setTestIsReading = (value) => {
    setIsReading(value);
  };

  return {
    runes,
    loading,
    error,
    selectedSpread,
    castRunes,
    selectedRunes, // Now properly defined
    isReading,
    interpretation,
    selectSpread,
    castRunesForReading,
    saveReading,
    resetReading,
    generateInterpretation,
    // Testing functions
    _setTestRunes,
    _setTestIsReading,
  };
};
