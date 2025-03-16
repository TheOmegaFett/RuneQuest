import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RuneCard from "../RuneCard";

describe("RuneCard", () => {
  const mockRune = {
    id: 1,
    name: "Fehu",
    symbol: "ᚠ",
    meaning: "Wealth, prosperity, abundance",
  };

  it("renders correctly with initial state (not flipped)", () => {
    render(<RuneCard rune={mockRune} position={0} spreadType="three-rune" />);

    // Card should start unflipped, so we shouldn't see the rune details yet
    expect(screen.queryByText("Fehu")).not.toBeInTheDocument();
    expect(screen.queryByText("ᚠ")).not.toBeInTheDocument();
  });

  it("flips when clicked and shows rune details", () => {
    render(<RuneCard rune={mockRune} position={0} spreadType="three-rune" />);

    // Initially not showing rune details
    expect(screen.queryByText("Fehu")).not.toBeInTheDocument();

    // Click to flip the card
    const card = screen.getByTestId("rune-card");
    fireEvent.click(card);

    // Now we should see the rune details
    expect(screen.getByText("Fehu")).toBeInTheDocument();
    expect(screen.getByText("ᚠ")).toBeInTheDocument();
    expect(
      screen.getByText("Wealth, prosperity, abundance")
    ).toBeInTheDocument();
    expect(screen.getByText("Past")).toBeInTheDocument(); // Position 0 in three-rune spread is "Past"
  });

  it("displays the correct position meaning based on spread type", () => {
    render(<RuneCard rune={mockRune} position={1} spreadType="three-rune" />);

    // Click to flip the card
    const card = screen.getByTestId("rune-card");
    fireEvent.click(card);

    // Position 1 in three-rune spread should be "Present"
    expect(screen.getByText("Present")).toBeInTheDocument();
  });
});
