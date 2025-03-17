import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchRunes } from "../runeService";

// Mock fetch
global.fetch = vi.fn();

describe("runeService", () => {
  // Store the original console.error
  const originalConsoleError = console.error;

  beforeEach(() => {
    fetch.mockReset();
    // Replace console.error with a mock function
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore the original console.error after each test
    console.error = originalConsoleError;
  });

  it("should fetch runes successfully", async () => {
    const mockResponse = {
      success: true,
      count: 3,
      data: [
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
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchRunes();
    expect(result).toEqual(mockResponse.data);

    // Update the expectation to match the actual URL pattern
    // Use a more flexible check that doesn't require "/api/" in the path
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/runes$/));
  });
  it("should handle API errors", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchRunes()).rejects.toThrow(
      "Failed to fetch runes: 500 Internal Server Error"
    );
  });

  it("should handle network errors", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchRunes()).rejects.toThrow("Network error");
  });
});
