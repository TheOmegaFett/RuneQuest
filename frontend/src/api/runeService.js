const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchRunes = async () => {
  try {
    // Ensure the URL always includes "/api/runes"
    const response = await fetch(`${API_URL}/api/runes`);
    if (!response.ok) {
      const errorMessage = `Failed to fetch runes: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching runes:", error);
    throw error;
  }
};
