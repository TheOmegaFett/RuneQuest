import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import QuizStats from "../Dashboard/QuizStats";
import { useUserJwt } from "../../hooks/useUserJwt";
import axios from "axios";

// Mock axios
vi.mock("axios");

// Mock the useUserJwt hook
vi.mock("../../hooks/useUserJwt", () => ({
  useUserJwt: vi.fn(),
}));

describe("QuizStats Component", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock user JWT
    useUserJwt.mockReturnValue([
      { userId: "user123", accessToken: "token123" },
    ]);
  });

  it("should render loading state initially", () => {
    // Mock axios get to not resolve immediately
    axios.get.mockImplementation(() => new Promise(() => {}));

    render(<QuizStats />);

    expect(screen.getByText("Loading stats...")).toBeInTheDocument();
  });

  it("should render stats when loaded successfully", async () => {
    // Mock successful response
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          stats: {
            totalPoints: 42,
            quizStreak: 3,
            runesLearned: 12,
          },
        },
      },
    });

    render(<QuizStats />);

    // Wait for stats to load
    await waitFor(() => {
      expect(screen.getByText("Quiz Performance")).toBeInTheDocument();
      expect(screen.getByText("Total Points")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByText("Current Streak")).toBeInTheDocument();
      expect(screen.getByText("3 days")).toBeInTheDocument();
      expect(screen.getByText("Runes Learned")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    // Verify API call
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/users/user123/progress"),
      expect.objectContaining({
        headers: { Authorization: "Bearer token123" },
      })
    );
  });

  it("should render error message when API call fails", async () => {
    // Mock error response
    axios.get.mockRejectedValueOnce(new Error("API error"));

    render(<QuizStats />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Error fetching user stats")).toBeInTheDocument();
    });
  });

  it("should render empty state when no stats are available", async () => {
    // Mock response with no stats
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          stats: null,
        },
      },
    });

    render(<QuizStats />);

    // Wait for empty state message
    await waitFor(() => {
      expect(
        screen.getByText("No quiz stats available yet. Try taking a quiz!")
      ).toBeInTheDocument();
    });
  });

  it("should not make API call when user is not logged in", () => {
    // Mock no user JWT
    useUserJwt.mockReturnValueOnce([{ accessToken: null }]);

    render(<QuizStats />);

    // Check that axios.get was not called
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("should display formatted stats with correct units", async () => {
    // Mock successful response with specific values
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          stats: {
            totalPoints: 100,
            quizStreak: 1, // Test singular form
            runesLearned: 24,
          },
        },
      },
    });

    render(<QuizStats />);

    // Wait for stats to load and check formatting
    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("1 day")).toBeInTheDocument(); // Should be singular
      expect(screen.getByText("24")).toBeInTheDocument();
    });
  });

  it("should handle server error response", async () => {
    // Mock error in response data
    axios.get.mockResolvedValueOnce({
      data: {
        success: false,
        error: "Server error occurred",
        data: null,
      },
    });

    render(<QuizStats />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Server error occurred")).toBeInTheDocument();
    });
  });
});
