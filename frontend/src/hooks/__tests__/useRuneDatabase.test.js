import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRuneDatabase } from "../useRuneDatabase";

// Mock fetch
global.fetch = vi.fn();

describe("useRuneDatabase", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Mock environment variable
    vi.stubEnv("VITE_API_URL", "https://runequest-3po3.onrender.com");
  });

  it("fetches runes successfully", async () => {
    const mockRunes = [
      { id: 1, name: "Fehu", symbol: "ᚠ", meaning: "Wealth" },
      { id: 2, name: "Uruz", symbol: "ᚢ", meaning: "Strength" },
    ];

    // Mock successful fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRunes,
    });

    const { result } = renderHook(() => useRuneDatabase());

    // Initially should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.runes).toEqual([]);

    // Wait for the fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify results
    expect(result.current.runes).toEqual(mockRunes);
    expect(result.current.error).toBeNull();

    // Verify fetch was called with correct URL
    expect(fetch).toHaveBeenCalledWith(
      "https://runequest-3po3.onrender.com/api/runes"
    );
  });

  it("handles fetch errors correctly", async () => {
    // Mock failed fetch
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const { result } = renderHook(() => useRuneDatabase());

    // Wait for the fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify error state
    expect(result.current.error).toBe("Failed to fetch runes");
    expect(result.current.runes).toEqual([]);
  });

  it("handles network errors correctly", async () => {
    // Mock network error
    fetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useRuneDatabase());

    // Wait for the fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify error state
    expect(result.current.error).toBe("Network error");
    expect(result.current.runes).toEqual([]);
  });
});
