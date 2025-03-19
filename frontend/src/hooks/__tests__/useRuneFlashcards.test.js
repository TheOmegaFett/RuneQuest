import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRuneFlashcards } from "../useRuneFlashcards";
import { fetchRunes } from "../../api/runeService"; // Corrected import path

// Mock the runeService
vi.mock("../../api/runeService", () => ({
  fetchRunes: vi.fn(),
}));

describe("useRuneFlashcards", () => {
  const mockRunesData = [
    { _id: "1", name: "Fehu", meaning: "Wealth", symbol: "ᚠ" },
    { _id: "2", name: "Uruz", meaning: "Strength", symbol: "ᚢ" },
    { _id: "3", name: "Thurisaz", meaning: "Thor", symbol: "ᚦ" },
  ];

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock successful rune fetch
    fetchRunes.mockResolvedValue({
      success: true,
      data: mockRunesData,
    });
  });

  it("should load runes on initialization", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    // Wait for the async effect to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchRunes).toHaveBeenCalled();
    expect(result.current.runes).toEqual(mockRunesData);
  });

  it("should flip the card when flipCard is called", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    // Wait for the async effect to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Initially not flipped
    expect(result.current.isFlipped).toBe(false);

    // Flip the card
    act(() => {
      result.current.flipCard();
    });

    // Should be flipped now
    expect(result.current.isFlipped).toBe(true);
  });

  it("should navigate to the next card", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    // Wait for the async effect to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Initially at index 0
    expect(result.current.currentIndex).toBe(0);

    // Navigate to next card
    act(() => {
      result.current.nextCard();
    });

    // Should be at index 1
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentRune).toEqual(mockRunesData[1]);
  });

  it("should navigate to the previous card", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    // Wait for the async effect to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Set to index 1 first
    act(() => {
      result.current.nextCard();
    });

    expect(result.current.currentIndex).toBe(1);

    // Then navigate to previous card
    act(() => {
      result.current.prevCard();
    });

    // Should be back at index 0
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentRune).toEqual(mockRunesData[0]);
  });

  it("should handle circular navigation", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    // Wait for the async effect to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Navigate to the last card
    act(() => {
      result.current.prevCard(); // From index 0 to last index (2)
    });

    // Should be at the last index
    expect(result.current.currentIndex).toBe(2);
    expect(result.current.currentRune).toEqual(mockRunesData[2]);

    // Navigate past the end
    act(() => {
      result.current.nextCard(); // From last index to 0
    });

    // Should wrap around to the beginning
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentRune).toEqual(mockRunesData[0]);
  });

  it("should shuffle the cards", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    // Wait for the async effect to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Mock Math.random to get predictable results
    const originalRandom = Math.random;
    Math.random = vi.fn().mockReturnValue(0.5);

    // Shuffle the cards
    act(() => {
      result.current.shuffleCards();
    });

    // Restore Math.random
    Math.random = originalRandom;

    // Should reset to index 0
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isFlipped).toBe(false);
  });

  it("should handle API errors", async () => {
    // Mock API error
    fetchRunes.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useRuneFlashcards());

    // Wait for the async effect to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to load runes");
  });
});
