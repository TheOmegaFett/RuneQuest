import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RuneFlashcard } from "../RuneFlashcard";

describe("RuneFlashcard", () => {
  const defaultProps = {
    rune: "ᚠ", // Use string instead of object
    englishLetters: "F", // Use string instead of object
    isFlipped: false,
    onFlip: vi.fn(),
  };

  it("should render the rune symbol when not flipped", () => {
    render(<RuneFlashcard {...defaultProps} />);
    expect(screen.getByText("ᚠ")).toBeInTheDocument();
  });

  it("should show the rune details when flipped", () => {
    render(<RuneFlashcard {...defaultProps} isFlipped={true} />);
    expect(screen.getByText("F")).toBeInTheDocument();
  });

  it("should call onFlip when clicked", () => {
    render(<RuneFlashcard {...defaultProps} />);
    fireEvent.click(screen.getByText("ᚠ"));
    expect(defaultProps.onFlip).toHaveBeenCalledTimes(1);
  });
});
