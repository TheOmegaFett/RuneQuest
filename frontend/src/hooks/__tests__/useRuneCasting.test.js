import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRuneCasting } from "../useRuneCasting";
import { fetchRunes } from "../../api/runeService";

// Mock the runeService
vi.mock("../../api/runeService", () => ({
  fetchRunes: vi.fn(),
}));

// Mock the useUserJwt hook
vi.mock("../useUserJwt", () => ({
  useUserJwt: () => [{ accessToken: "mock-token", userId: "user123" }],
}));

describe("useRuneCasting", () => {
  const mockRunes = [
    { _id: "1", name: "Fehu", meaning: "Wealth", symbol: "ᚠ" },
    { _id: "2", name: "Uruz", meaning: "Strength", symbol: "ᚢ" },
    { _id: "3", name: "Thurisaz", meaning: "Thor", symbol: "ᚦ" },
  ];

  const mockSpread = {
    name: "Three Rune Spread",
    positions: ["Past", "Present", "Future"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    fetchRunes.mockResolvedValue({
      success: true,
      data: mockRunes,
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useRuneCasting());

    expect(result.current.runes).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.selectedSpread).toBeNull();
    expect(result.current.castRunes).toEqual([]);
    expect(result.current.isReading).toBe(false);
    expect(result.current.interpretation).toBeNull();
  });

  it("should load runes on initialization", async () => {
    const { result, rerender } = renderHook(() => useRuneCasting());

    // Wait for the useEffect to complete
    await vi.waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchRunes).toHaveBeenCalledTimes(1);
    expect(result.current.runes).toEqual(mockRunes);
    expect(result.current.error).toBeNull();
  });

  it("should handle API errors when loading runes", async () => {
    // Mock API error
    fetchRunes.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useRuneCasting());

    // Wait for the useEffect to complete
    await vi.waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to load runes");
    expect(result.current.runes).toEqual([]);
  });

  it("should select a spread correctly", async () => {
    const { result } = renderHook(() => useRuneCasting());

    // Wait for runes to load
    await vi.waitFor(() => expect(result.current.loading).toBe(false));

    // Select a spread
    act(() => {
      result.current.selectSpread(mockSpread);
    });

    expect(result.current.selectedSpread).toEqual(mockSpread);
    expect(result.current.castRunes).toEqual([]);
    expect(result.current.isReading).toBe(false);
    expect(result.current.interpretation).toBeNull();
  });

  it("should cast runes for a reading", async () => {
    const { result } = renderHook(() => useRuneCasting());

    // Wait for runes to load
    await vi.waitFor(() => expect(result.current.loading).toBe(false));

    // Select a spread
    act(() => {
      result.current.selectSpread(mockSpread);
    });

    // Cast runes
    act(() => {
      result.current.castRunesForReading(mockSpread.positions.length);
    });

    // Wait for the setTimeout in castRunesForReading to complete
    await vi.waitFor(
      () =>
        expect(result.current.castRunes.length).toBe(
          mockSpread.positions.length
        ),
      {
        timeout: 1000,
      }
    );

    expect(result.current.castRunes.length).toBe(mockSpread.positions.length);
    expect(result.current.isReading).toBe(true);

    // Verify each cast rune has the expected properties
    result.current.castRunes.forEach((rune, index) => {
      expect(rune).toHaveProperty("_id");
      expect(rune).toHaveProperty("name");
      expect(rune).toHaveProperty("meaning");
      expect(rune).toHaveProperty("position", mockSpread.positions[index]);
      expect(rune).toHaveProperty("reversed");
    });
  });

  it("should generate interpretation for a reading", async () => {
    const { result } = renderHook(() => useRuneCasting());

    // Wait for runes to load
    await vi.waitFor(() => expect(result.current.loading).toBe(false));

    // Set up test data using the test helper methods
    act(() => {
      result.current._setTestRunes([
        { ...mockRunes[0], position: "Past", reversed: false },
        { ...mockRunes[1], position: "Present", reversed: true },
        { ...mockRunes[2], position: "Future", reversed: false },
      ]);
      result.current._setTestIsReading(true);
    });

    // Generate interpretation
    act(() => {
      result.current.generateInterpretation();
    });

    expect(result.current.interpretation).toBeTruthy();
    expect(typeof result.current.interpretation).toBe("string");
    expect(result.current.interpretation).toContain("Past");
    expect(result.current.interpretation).toContain("Present");
    expect(result.current.interpretation).toContain("Future");
  });

  it("should reset reading state", async () => {
    const { result } = renderHook(() => useRuneCasting());

    // Wait for runes to load
    await vi.waitFor(() => expect(result.current.loading).toBe(false));

    // Set up test data
    act(() => {
      result.current._setTestRunes([
        { ...mockRunes[0], position: "Past", reversed: false },
      ]);
      result.current._setTestIsReading(true);
      // Generate an interpretation
      result.current.generateInterpretation();
    });

    // Reset reading
    act(() => {
      result.current.resetReading();
    });

    expect(result.current.castRunes).toEqual([]);
    expect(result.current.isReading).toBe(false);
    expect(result.current.interpretation).toBeNull();
  });

  it("should save a reading successfully", async () => {
    const { result } = renderHook(() => useRuneCasting());

    // Wait for runes to load
    await vi.waitFor(() => expect(result.current.loading).toBe(false));

    // Set up test data - need to set selectedSpread first
    act(() => {
      result.current.selectSpread(mockSpread); // Add this line
      result.current._setTestRunes([
        { ...mockRunes[0], position: "Past", reversed: false },
      ]);
      result.current._setTestIsReading(true);
    });

    // Save reading
    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveReading("Test notes");
    });

    expect(saveResult.success).toBe(true);
    expect(saveResult.data).toHaveProperty("id", "mock-reading-id");
  });
});
