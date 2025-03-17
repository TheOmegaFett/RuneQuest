import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RuneLearningPage } from "../RuneLearningPage";
import { fetchRunes } from "../../api/runeService";
import { act } from "react-dom/test-utils";

// Mock the API service
vi.mock("../../api/runeService", () => ({
  fetchRunes: vi.fn(),
}));

describe("RuneLearningPage", () => {
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
  ];

  beforeEach(() => {
    fetchRunes.mockReset();
    // Return just the data array
    fetchRunes.mockResolvedValue(mockRunesData);
  });

  it("renders the learning page with flashcards", async () => {
    render(<RuneLearningPage />);

    // Initially should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should display the first rune's symbol
    expect(screen.getByText("ᚠ")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    // Setup an error response
    fetchRunes.mockRejectedValueOnce(new Error("Failed to fetch runes"));

    render(<RuneLearningPage />);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch runes/i)).toBeInTheDocument();
    });
  });
});
