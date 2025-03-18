import { useState } from "react";
import { fetchRunes } from "../api/runeService";

export const useRuneCasting = () => {
  const [selectedRunes, setSelectedRunes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const castRunes = async (count) => {
    setIsLoading(true);
    try {
      // Use relative URL to work with the proxy
      const response = await fetch(`/api/runes/cast?count=${count}`);
      const data = await response.json();

      if (data.success) {
        setSelectedRunes(data.runes);
      } else {
        console.error("Error casting runes:", data.error);
      }
    } catch (error) {
      console.error("Failed to cast runes:", error);
    } finally {
      setIsLoading(false);
    }
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
