import { useState } from "react";
import { fetchRunes } from "../api/runeService";

export const useRuneCasting = () => {
  const [selectedRunes, setSelectedRunes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const castRunes = async (count) => {
    setIsLoading(true);
    try {
      // Use the working endpoint with a query parameter for count
      const response = await fetch(`/api/runes?count=${count}`);
      // Or potentially:
      // const response = await fetch(`/api/runes/random?count=${count}`);

      const data = await response.json();

      if (data.success) {
        // If the API returns all runes, we can select random ones client-side
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          const randomRunes = selectRandomRunes(data.data, count);
          setSelectedRunes(randomRunes);
        } else if (data.runes) {
          // If the API already returns random runes
          setSelectedRunes(data.runes);
        }
      } else {
        console.error("Error casting runes:", data.error);
      }
    } catch (error) {
      console.error("Failed to cast runes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to select random runes client-side if needed
  const selectRandomRunes = (allRunes, count) => {
    const shuffled = [...allRunes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const resetCasting = () => {
    setSelectedRunes([]);
  };

  return {
    selectedRunes,
    isLoading,
    error,
    castRunes,
    resetCasting,
  };
};
