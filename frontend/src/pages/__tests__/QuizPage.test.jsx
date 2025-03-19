import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { QuizPage } from "../QuizPage";
import {
  fetchQuizByDifficulty,
  checkAnswer,
  completeQuiz,
} from "../../services/quizService";
import { useUserJwt } from "../../hooks/useUserJwt";

// Mock the dependencies
vi.mock("../../services/quizService", () => ({
  fetchQuizByDifficulty: vi.fn(),
  checkAnswer: vi.fn(),
  completeQuiz: vi.fn(),
}));

// Mock the useUserJwt hook
vi.mock("../../hooks/useUserJwt", () => ({
  useUserJwt: vi.fn(),
}));

// Mock window.location
const mockLocation = {
  href: "",
  search: "",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

describe("QuizPage", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock user JWT
    useUserJwt.mockReturnValue([
      { userId: "user123", accessToken: "token123" },
    ]);

    // Reset location
    window.location.search = "";
  });

  it("renders quiz selection when no difficulty is provided", () => {
    render(<QuizPage />);

    expect(screen.getByText("Rune Quiz Challenge")).toBeInTheDocument();
    expect(screen.getByText("Easy Difficulty")).toBeInTheDocument();
    expect(screen.getByText("Medium Difficulty")).toBeInTheDocument();
    expect(screen.getByText("Hard Difficulty")).toBeInTheDocument();
  });
});
