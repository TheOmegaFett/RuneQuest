const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchRunes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/runes`);
    if (!response.ok) {
      throw new Error(`Failed to fetch runes: ${response.status}`);
    }
    const data = await response.json();
    console.log("API response:", data); // Add this to debug
    return data.success ? data : { success: true, data: data };
  } catch (error) {
    console.error("Error fetching runes:", error);
    return { success: false, error: error.message };
  }
};
