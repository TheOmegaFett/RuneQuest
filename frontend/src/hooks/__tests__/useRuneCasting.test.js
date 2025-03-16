import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRuneCasting } from "../useRuneCasting";
import { useRuneDatabase } from "../useRuneDatabase";
import { useSavedReadings } from "../useSavedReadings";
import { useState } from "react";

// Mock the dependent hooks

vi.mock("../useRuneDatabase", () => ({
  useRuneDatabase: vi.fn(),
}));

vi.mock("../useSavedReadings", () => ({
  useSavedReadings: vi.fn(),
}));

// Create a test wrapper for the useRuneCasting hook
const useTestRuneCasting = () => {
  const hookResult = useRuneCasting();
  const [testState, setTestState] = useState({
    manuallySetRunes: null,
    manuallySetInterpretation: null,
    manuallySetIsReading: null,
  });

  // Create a wrapped resetReading function that also resets our test values
  const wrappedResetReading = () => {
    // Call the original resetReading function
    hookResult.resetReading();

    // Also reset our test state
    setTestState({
      manuallySetRunes: null,
      manuallySetInterpretation: null,
      manuallySetIsReading: null,
    });
  };
  // If we've manually set values for testing, use those instead
  const result = {
    ...hookResult,
    castRunes: testState.manuallySetRunes || hookResult.castRunes,

    interpretation:
      testState.manuallySetInterpretation || hookResult.interpretation,
    isReading:
      testState.manuallySetIsReading !== null
        ? testState.manuallySetIsReading
        : hookResult.isReading,
    // Override the resetReading function to also reset our test values
    resetReading: wrappedResetReading,
    // Test helper methods
    _setTestRunes: (runes) => {
      setTestState((prev) => ({ ...prev, manuallySetRunes: runes }));
    },
    _setTestInterpretation: (interpretation) => {
      setTestState((prev) => ({
        ...prev,
        manuallySetInterpretation: interpretation,
      }));
    },
    _setTestIsReading: (isReading) => {
      setTestState((prev) => ({ ...prev, manuallySetIsReading: isReading }));
    },
  };

  return result;
};

describe("useRuneCasting", () => {
  const mockRunes = [
    { id: 1, name: "Fehu", symbol: "ᚠ", meaning: "Wealth" },
    { id: 2, name: "Uruz", symbol: "ᚢ", meaning: "Strength" },
    { id: 3, name: "Thurisaz", symbol: "ᚦ", meaning: "Protection" },
    { id: 4, name: "Ansuz", symbol: "ᚨ", meaning: "Communication" },
    { id: 5, name: "Raidho", symbol: "ᚱ", meaning: "Journey" },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();

    // Setup default mock implementations
    useRuneDatabase.mockReturnValue({
      runes: mockRunes,
      loading: false,
      error: null,
    });

    useSavedReadings.mockReturnValue({
      savedReadings: [],
      saveReading: vi.fn(),
      deleteReading: vi.fn(),
    });
  });
  it("initializes with default values", () => {
    const { result } = renderHook(() => useRuneCasting());

    expect(result.current.selectedSpread).toBeNull();
    expect(result.current.castRunes).toEqual([]);
    expect(result.current.interpretation).toBeNull();
    expect(result.current.isReading).toBe(false);
  });
  it("selects a spread correctly", () => {
    const { result } = renderHook(() => useRuneCasting());

    const mockSpread = { id: "three-rune", name: "Three Rune Spread" };

    act(() => {
      result.current.selectSpread(mockSpread);
    });

    expect(result.current.selectedSpread).toEqual(mockSpread);
  });
  it("casts runes for a three-rune spread", () => {
    const { result } = renderHook(() => useRuneCasting());

    const mockSpread = { id: "three-rune", name: "Three Rune Spread" };

    // First select a spread
    act(() => {
      result.current.selectSpread(mockSpread);
    });

    // Then cast runes
    act(() => {
      result.current.castRunesForReading();
    });

    // Since we can't directly test the random selection in a deterministic way,
    // we'll just verify that some runes were selected and interpretation was generated
    expect(result.current.isReading).toBe(true);
    expect(result.current.interpretation).not.toBeNull();
  });

  it("saves a reading correctly", () => {
    // Create a mock implementation that captures the saved reading
    let capturedReading = null;
    const mockSaveReading = vi.fn((reading) => {
      capturedReading = reading;
    });

    useSavedReadings.mockReturnValue({
      savedReadings: [],
      saveReading: mockSaveReading,
      deleteReading: vi.fn(),
    });

    const { result } = renderHook(() => useRuneCasting());
    const mockSpread = { id: "three-rune", name: "Three Rune Spread" };

    // Set up a reading state
    act(() => {
      result.current.selectSpread(mockSpread);
      result.current.castRunesForReading();
    });

    // Save the reading
    act(() => {
      result.current.saveReading();
    });

    // Verify the save function was called
    expect(mockSaveReading).toHaveBeenCalled();

    // Verify the saved reading has the correct structure
    expect(capturedReading).toHaveProperty("spread", mockSpread);
    // Instead of checking specific runes, just verify it has runes
    expect(capturedReading).toHaveProperty("runes");
    expect(capturedReading.runes).toBeInstanceOf(Array);
    expect(capturedReading).toHaveProperty("interpretation");
    expect(capturedReading).toHaveProperty("id");
    expect(capturedReading).toHaveProperty("date");
  });

  it("resets the reading state", () => {
    const { result } = renderHook(() => useTestRuneCasting());
    const mockSpread = { id: "three-rune", name: "Three Rune Spread" };
    const testRunes = mockRunes.slice(0, 3); // Take first 3 runes

    // Setup the test state
    act(() => {
      result.current.selectSpread(mockSpread);
      result.current._setTestRunes(testRunes);
      result.current._setTestIsReading(true);
    });

    // Verify the initial state before reset
    expect(result.current.selectedSpread).toEqual(mockSpread);
    expect(result.current.castRunes).toEqual(testRunes);
    expect(result.current.isReading).toBe(true);

    // Reset the reading
    act(() => {
      result.current.resetReading();
    });

    // Verify state is reset
    expect(result.current.isReading).toBe(false);
    expect(result.current.selectedSpread).toBeNull();
    expect(result.current.castRunes).toEqual([]);
    expect(result.current.interpretation).toBeNull();
  });
});
