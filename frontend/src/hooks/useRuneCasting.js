import { useState } from "react";
import { fetchRunes } from "../api/runeService";

export const useRuneCasting = () => {
  const [selectedRunes, setSelectedRunes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const castRunes = async (count) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all runes from the API
      const allRunes = await fetchRunes();

      // Randomly select the requested number of runes
      const shuffled = [...allRunes].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      setSelectedRunes(selected);
    } catch (err) {
      setError(err.message);
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
