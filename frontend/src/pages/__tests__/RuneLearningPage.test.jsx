import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RuneLearningPage } from "../RuneLearningPage";
import { fetchRunes } from "../../api/runeService";
import { act } from "react"; // Import from react instead of react-dom/test-utils

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
    // Return the proper response structure with success and data fields
    fetchRunes.mockResolvedValue({
      success: true,
      data: mockRunesData,
      error: null,
    });
  });

  it("renders the learning page with flashcards", async () => {
    // Use act to handle async rendering
    await act(async () => {
      render(<RuneLearningPage />);
    });

    // The component is already showing the rune data, so we can directly check for it
    expect(screen.getByText("ᚠ")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();

    // Verify other UI elements are present
    expect(screen.getByText("Learn the Runes")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Click on the card to reveal the English letter equivalent."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Shuffle")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    // Setup an error response
    fetchRunes.mockRejectedValueOnce(new Error("Failed to fetch runes"));

    await act(async () => {
      render(<RuneLearningPage />);
    });

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });
});
