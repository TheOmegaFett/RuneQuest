import { useState, useEffect } from "react";

export const useRuneDatabase = () => {
  const [runes, setRunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRunes = async () => {
      try {
        setLoading(true);

        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/runes`);

        if (!response.ok) {
          throw new Error("Failed to fetch runes");
        }

        const data = await response.json();
        setRunes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRunes();
  }, []);

  return { runes, loading, error };
};
