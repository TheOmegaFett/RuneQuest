import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FlashcardControls } from "../FlashcardControls";

describe("FlashcardControls", () => {
  const defaultProps = {
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    onShuffle: vi.fn(),
    currentIndex: 2,
    totalRunes: 24,
  };

  it("should render all controls", () => {
    render(<FlashcardControls {...defaultProps} />);

    // Buttons should be rendered
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Shuffle")).toBeInTheDocument();

    // Progress indicator should show the correct values (1-based for display)
    expect(screen.getByText("3 / 24")).toBeInTheDocument();
  });

  it("should call onPrevious when Previous button is clicked", () => {
    render(<FlashcardControls {...defaultProps} />);

    fireEvent.click(screen.getByText("Previous"));
    expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1);
  });

  it("should call onNext when Next button is clicked", () => {
    render(<FlashcardControls {...defaultProps} />);

    fireEvent.click(screen.getByText("Next"));
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  it("should call onShuffle when Shuffle button is clicked", () => {
    render(<FlashcardControls {...defaultProps} />);

    fireEvent.click(screen.getByText("Shuffle"));
    expect(defaultProps.onShuffle).toHaveBeenCalledTimes(1);
  });

  it("should display the correct current position", () => {
    render(<FlashcardControls {...defaultProps} />);

    // Index is 0-based internally but should be displayed as 1-based
    expect(screen.getByText("3 / 24")).toBeInTheDocument();

    // Test with different values
    render(
      <FlashcardControls {...defaultProps} currentIndex={0} totalRunes={10} />
    );
    expect(screen.getByText("1 / 10")).toBeInTheDocument();
  });
  it("should disable buttons when appropriate", () => {
    // Clear any previous renders
    render(<div></div>);

    // When there are no runes
    const { unmount } = render(
      <FlashcardControls {...defaultProps} totalRunes={0} />
    );

    const previousButton = screen.getByText("Previous");
    const nextButton = screen.getByText("Next");
    const shuffleButton = screen.getByText("Shuffle");

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(shuffleButton).toBeDisabled();

    // Clean up before next render
    unmount();
  });
});
