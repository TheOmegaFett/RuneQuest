import { renderHook, act } from "@testing-library/react";
import { useRuneFlashcards } from "../useRuneFlashcards";
import { fetchRunes } from "../../api/runeService";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the API service
vi.mock("../../api/runeService", () => ({
  fetchRunes: vi.fn(),
}));

describe("useRuneFlashcards", () => {
  // Create mock data that matches the structure expected by the hook
  const mockRunesData = [
    {
      _id: "67d3aa5f584c5a05591bd3fb",
      name: "Fehu",
      meaning: "Cattle, Wealth",
      symbol: "ᚠ",
      pronunciation: "feh-who",
      history: "Represents mobile wealth, earned income, and luck.",
      englishEquivalent: "F",
      category: { name: "Elder Futhark" },
    },
    {
      _id: "67d3aa5f584c5a05591bd3fe",
      name: "Uruz",
      meaning: "Aurochs, Strength",
      symbol: "ᚢ",
      pronunciation: "oo-rooz",
      history: "Symbolizes physical strength, speed, and untamed potential.",
      englishEquivalent: "U",
      category: { name: "Elder Futhark" },
    },
    {
      _id: "67d3aa5f584c5a05591bd3ff",
      name: "Thurisaz",
      meaning: "Thor, Giant",
      symbol: "ᚦ",
      pronunciation: "thur-ee-saz",
      history: "Represents chaos, destruction and defense.",
      englishEquivalent: "Th",
      category: { name: "Elder Futhark" },
    },
  ];

  beforeEach(() => {
    fetchRunes.mockReset();
    // Mock the API to return just the data array
    fetchRunes.mockResolvedValue(mockRunesData);
  });

  it("should load runes on initialization", async () => {
    const { result, rerender } = renderHook(() => useRuneFlashcards());

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the data to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    rerender();

    // Verify the data is loaded
    expect(result.current.totalRunes).toBe(3);
    expect(result.current.currentRune).toEqual(mockRunesData[0]);
  });

  it("should flip the card when flipCard is called", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isFlipped).toBe(false);

    act(() => {
      result.current.flipCard();
    });

    expect(result.current.isFlipped).toBe(true);

    act(() => {
      result.current.flipCard();
    });

    expect(result.current.isFlipped).toBe(false);
  });

  it("should navigate to the next card", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentRune).toEqual(mockRunesData[0]);

    act(() => {
      result.current.nextCard();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentRune).toEqual(mockRunesData[1]);
  });

  it("should navigate to the previous card", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.nextCard();
      result.current.nextCard();
    });

    expect(result.current.currentIndex).toBe(2);

    act(() => {
      result.current.previousCard();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentRune).toEqual(mockRunesData[1]);
  });

  it("should handle circular navigation", async () => {
    const { result } = renderHook(() => useRuneFlashcards());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.previousCard();
    });

    expect(result.current.currentIndex).toBe(2);
    expect(result.current.currentRune).toEqual(mockRunesData[2]);

    act(() => {
      result.current.nextCard();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentRune).toEqual(mockRunesData[0]);
  });

  it("should shuffle the cards", async () => {
    const originalRandom = Math.random;
    Math.random = vi.fn().mockReturnValue(0.5);

    const { result } = renderHook(() => useRuneFlashcards());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.shuffleCards();
    });

    expect(result.current.currentIndex).toBe(0);

    Math.random = originalRandom;
  });

  it("should handle API errors", async () => {
    fetchRunes.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useRuneFlashcards());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe("API error");
  });
});
