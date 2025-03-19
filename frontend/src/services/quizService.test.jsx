import { describe, it, expect, vi, beforeEach } from "vitest";

// Create mock functions inside the mock factory
vi.mock("axios", () => {
  // Create mock functions
  const get = vi.fn();
  const post = vi.fn();
  const use = vi.fn();

  // Store the interceptor function when it's registered
  let interceptorFunction = null;
  use.mockImplementation((fn) => {
    interceptorFunction = fn;
    return { eject: vi.fn() };
  });

  // Create a mock API object
  const mockApi = {
    get,
    post,
    interceptors: {
      request: {
        use,
      },
    },
  };

  // Expose the mocks and the interceptor function
  vi.stubGlobal("__axiosMocks", {
    get,
    post,
    interceptorFunction: () => interceptorFunction,
  });

  // Return the mock implementation with default export
  return {
    create: () => mockApi,
    default: {
      create: () => mockApi,
    },
  };
});

// Now import the service after axios is mocked
import {
  fetchQuizByDifficulty,
  checkAnswer,
  completeQuiz,
} from "./quizService";

describe("Quiz Service", () => {
  // Get access to our mocks
  const { get, post, interceptorFunction } = globalThis.__axiosMocks;

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();

    // Clear localStorage
    localStorage.clear();
  });

  describe("fetchQuizByDifficulty", () => {
    it("should fetch quiz questions successfully", async () => {
      // Setup
      const mockResponse = {
        data: {
          success: true,
          data: [
            { id: "1", rune: "ᚠ", options: ["wealth", "cattle", "strength"] },
          ],
          error: null,
        },
      };

      get.mockResolvedValue(mockResponse);

      // Execute
      const result = await fetchQuizByDifficulty("easy");

      // Verify
      expect(get).toHaveBeenCalledWith("/quiz/easy?count=10");
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when fetching quiz questions", async () => {
      // Setup
      const mockError = {
        response: {
          data: {
            success: false,
            error: "Failed to fetch questions",
            data: null,
          },
        },
      };

      get.mockRejectedValue(mockError);

      // Execute & Verify
      try {
        await fetchQuizByDifficulty("easy");
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual(mockError.response.data);
      }
    });

    it("should use custom count parameter when provided", async () => {
      // Setup
      const mockResponse = { data: { success: true, data: [] } };
      get.mockResolvedValue(mockResponse);

      // Execute
      await fetchQuizByDifficulty("medium", 5);

      // Verify
      expect(get).toHaveBeenCalledWith("/quiz/medium?count=5");
    });
  });

  describe("checkAnswer", () => {
    it("should check answer successfully", async () => {
      // Setup
      const mockResponse = {
        data: {
          success: true,
          data: {
            isCorrect: true,
            correctAnswer: "wealth",
            additionalInfo: "Represents wealth and abundance",
          },
          error: null,
        },
      };

      post.mockResolvedValue(mockResponse);

      // Execute
      const result = await checkAnswer("1", "wealth");

      // Verify
      expect(post).toHaveBeenCalledWith("/quiz/check", {
        questionId: "1",
        selectedAnswer: "wealth",
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when checking answer", async () => {
      // Setup
      const mockError = {
        response: {
          data: {
            success: false,
            error: "Failed to check answer",
            data: null,
          },
        },
      };

      post.mockRejectedValue(mockError);

      // Execute & Verify
      try {
        await checkAnswer("1", "wealth");
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual(mockError.response.data);
      }
    });
  });

  describe("completeQuiz", () => {
    it("should complete quiz successfully", async () => {
      // Setup
      const mockResponse = {
        data: {
          success: true,
          data: {
            progress: { stats: { totalPoints: 10 } },
            newAchievements: [
              { title: "First Quiz", description: "Completed your first quiz" },
            ],
          },
          error: null,
        },
      };

      const quizData = {
        userId: "user123",
        quizId: "quiz123",
        score: 8,
        correctAnswers: 8,
        totalQuestions: 10,
        difficulty: "medium",
      };

      post.mockResolvedValue(mockResponse);

      // Execute
      const result = await completeQuiz(quizData);

      // Verify
      expect(post).toHaveBeenCalledWith("/quiz/complete", quizData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when completing quiz", async () => {
      // Setup
      const mockError = {
        response: {
          data: {
            success: false,
            error: "Failed to complete quiz",
            data: null,
          },
        },
      };

      post.mockRejectedValue(mockError);

      // Execute & Verify
      try {
        await completeQuiz({});
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual(mockError.response.data);
      }
    });
  });

  describe("Auth token handling", () => {
    it("should add auth token to request headers when available", () => {
      // Setup
      const mockToken = { accessToken: "test-token" };
      localStorage.setItem("userJwt", JSON.stringify(mockToken));

      // Execute
      const req = { headers: {} };
      const result = interceptorFunction()(req);

      // Verify
      expect(result.headers.Authorization).toBe("Bearer test-token");
    });

    it("should not add auth token when not available", () => {
      // Execute
      const req = { headers: {} };
      const result = interceptorFunction()(req);

      // Verify
      expect(result.headers.Authorization).toBeUndefined();
    });
  });
});
