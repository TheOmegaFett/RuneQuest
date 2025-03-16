import { useState, useEffect } from "react";

export const useSavedReadings = () => {
  const [savedReadings, setSavedReadings] = useState([]);

  useEffect(() => {
    // Load saved readings from localStorage on component mount
    const loadSavedReadings = () => {
      const storedReadings = localStorage.getItem("runeReadings");
      if (storedReadings) {
        setSavedReadings(JSON.parse(storedReadings));
      }
    };

    loadSavedReadings();
  }, []);

  const saveReading = (reading) => {
    const updatedReadings = [...savedReadings, reading];
    setSavedReadings(updatedReadings);
    localStorage.setItem("runeReadings", JSON.stringify(updatedReadings));
  };

  const deleteReading = (readingId) => {
    const updatedReadings = savedReadings.filter(
      (reading) => reading.id !== readingId
    );
    setSavedReadings(updatedReadings);
    localStorage.setItem("runeReadings", JSON.stringify(updatedReadings));
  };

  return {
    savedReadings,
    saveReading,
    deleteReading,
  };
};
