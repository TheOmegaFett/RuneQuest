import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import * as useQuizModule from "../useQuiz";
import * as useUserJwtModule from "../useUserJwt";
import * as quizServiceModule from "../../services/quizService";

// Mock the useUserJwt hook
vi.mock("../useUserJwt", () => ({
  useUserJwt: () => [{ userId: "user123", accessToken: "token123" }],
}));

// Mock the quiz service functions
vi.mock("../../services/quizService", () => ({
  fetchQuizByDifficulty: vi.fn(),
  checkAnswer: vi.fn(),
  completeQuiz: vi.fn(),
}));

describe("useQuiz Hook", () => {
  const { fetchQuizByDifficulty, checkAnswer, completeQuiz } =
    quizServiceModule;
  const { useQuiz } = useQuizModule;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    // Mock API call to not resolve immediately
    fetchQuizByDifficulty.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useQuiz("easy"));

    expect(result.current.quizState).toBe("loading");
    expect(result.current.questions).toEqual([]);
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.error).toBe(null);
  });

  it("should load quiz questions successfully", async () => {
    // Mock successful API response
    const mockQuestions = [
      {
        id: "1",
        rune: "ᚠ",
        options: ["wealth", "strength"],
        difficulty: "easy",
        category: "elder-futhark",
      },
    ];

    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: mockQuestions,
    });

    const { result } = renderHook(() => useQuiz("easy"));

    // Wait for the hook to process the API response
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.quizState).toBe("active");
    expect(result.current.questions).toEqual(mockQuestions);
    expect(result.current.currentQuestion).toEqual(mockQuestions[0]);
    expect(result.current.totalQuestions).toBe(1);
    expect(fetchQuizByDifficulty).toHaveBeenCalledWith("easy");
  });

  it("should handle API errors when loading questions", async () => {
    // Mock API error
    fetchQuizByDifficulty.mockResolvedValue({
      success: false,
      error: "Failed to fetch quiz questions",
      data: null,
    });

    const { result } = renderHook(() => useQuiz("easy"));

    // Wait for the hook to process the API response
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.quizState).toBe("error");
    expect(result.current.error).toBe("Failed to fetch quiz questions");
  });

  it("should handle empty question list", async () => {
    // Mock empty question list
    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: [],
    });

    const { result } = renderHook(() => useQuiz("easy"));

    // Wait for the hook to process the API response
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.quizState).toBe("error");
    expect(result.current.error).toBe(
      "No questions available for this difficulty level"
    );
  });

  it("should handle answer selection correctly", async () => {
    // Setup
    const mockQuestions = [
      {
        id: "1",
        rune: "ᚠ",
        options: ["wealth", "strength"],
        difficulty: "easy",
        category: "elder-futhark",
      },
    ];

    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: mockQuestions,
    });

    checkAnswer.mockResolvedValue({
      success: true,
      data: {
        isCorrect: true,
        correctAnswer: "wealth",
        additionalInfo: "Represents prosperity",
      },
    });

    const { result } = renderHook(() => useQuiz("easy"));

    // Wait for questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Select an answer
    await act(async () => {
      await result.current.handleAnswerSelection("wealth");
    });

    expect(result.current.selectedAnswer).toBe("wealth");
    expect(result.current.answerResult).toEqual({
      isCorrect: true,
      correctAnswer: "wealth",
      additionalInfo: "Represents prosperity",
    });
    expect(result.current.score).toBe(1); // Easy difficulty = 1 point
    expect(result.current.correctAnswers).toBe(1);
  });

  it("should handle incorrect answers", async () => {
    // Setup
    const mockQuestions = [
      {
        id: "1",
        rune: "ᚠ",
        options: ["wealth", "strength"],
        difficulty: "easy",
        category: "elder-futhark",
      },
    ];

    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: mockQuestions,
    });

    checkAnswer.mockResolvedValue({
      success: true,
      data: {
        isCorrect: false,
        correctAnswer: "wealth",
        additionalInfo: "Represents prosperity",
      },
    });

    const { result } = renderHook(() => useQuiz("easy"));

    // Wait for questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Select an incorrect answer
    await act(async () => {
      await result.current.handleAnswerSelection("strength");
    });

    expect(result.current.selectedAnswer).toBe("strength");
    expect(result.current.answerResult.isCorrect).toBe(false);
    expect(result.current.score).toBe(0); // No points for incorrect answer
    expect(result.current.correctAnswers).toBe(0);
  });

  it("should move to next question", async () => {
    // Setup
    const mockQuestions = [
      {
        id: "1",
        rune: "ᚠ",
        options: ["wealth", "strength"],
        difficulty: "easy",
      },
      {
        id: "2",
        rune: "ᚢ",
        options: ["strength", "wealth"],
        difficulty: "easy",
      },
    ];

    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: mockQuestions,
    });

    checkAnswer.mockResolvedValue({
      success: true,
      data: {
        isCorrect: true,
        correctAnswer: "wealth",
      },
    });

    const { result } = renderHook(() => useQuiz("easy"));

    // Wait for questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Answer the first question
    await act(async () => {
      await result.current.handleAnswerSelection("wealth");
    });

    // Move to next question
    act(() => {
      result.current.handleNextQuestion();
    });

    expect(result.current.currentQuestionIndex).toBe(1);
    expect(result.current.currentQuestion).toEqual(mockQuestions[1]);
    expect(result.current.selectedAnswer).toBe(null);
    expect(result.current.answerResult).toBe(null);
  });

  it("should complete quiz when all questions are answered", async () => {
    // Setup
    const mockQuestions = [
      {
        id: "1",
        rune: "ᚠ",
        options: ["wealth", "strength"],
        difficulty: "easy",
      },
    ];

    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: mockQuestions,
    });

    checkAnswer.mockResolvedValue({
      success: true,
      data: {
        isCorrect: true,
        correctAnswer: "wealth",
      },
    });

    completeQuiz.mockResolvedValue({
      success: true,
      data: {
        newAchievements: [
          {
            id: "ach1",
            title: "First Quiz",
            description: "Completed your first quiz",
          },
        ],
      },
    });

    const { result } = renderHook(() => useQuiz("easy"));

    // Wait for questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Answer the question
    await act(async () => {
      await result.current.handleAnswerSelection("wealth");
    });

    // Complete the quiz
    await act(async () => {
      await result.current.handleNextQuestion();
    });

    expect(result.current.quizState).toBe("completed");
    expect(result.current.achievements).toEqual([
      {
        id: "ach1",
        title: "First Quiz",
        description: "Completed your first quiz",
      },
    ]);
    expect(completeQuiz).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 1,
        correctAnswers: 1,
        totalQuestions: 1,
        difficulty: "easy",
      })
    );
  });

  it("should reset quiz state", async () => {
    // Setup
    const mockQuestions = [
      {
        id: "1",
        rune: "ᚠ",
        options: ["wealth", "strength"],
        difficulty: "easy",
      },
    ];

    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: mockQuestions,
    });

    const { result } = renderHook(() => useQuiz("easy"));

    // Wait for questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Answer a question to change state
    await act(async () => {
      checkAnswer.mockResolvedValueOnce({
        success: true,
        data: { isCorrect: true, correctAnswer: "wealth" },
      });
      await result.current.handleAnswerSelection("wealth");
    });

    // Reset the quiz
    act(() => {
      result.current.resetQuiz();
    });

    expect(result.current.quizState).toBe("active");
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.correctAnswers).toBe(0);
    expect(result.current.selectedAnswer).toBe(null);
    expect(result.current.answerResult).toBe(null);
  });

  it("should calculate progress percentage correctly", async () => {
    // Setup
    const mockQuestions = [
      { id: "1", rune: "ᚠ", options: ["wealth", "strength"] },
      { id: "2", rune: "ᚢ", options: ["strength", "wealth"] },
      { id: "3", rune: "ᚦ", options: ["thorn", "giant"] },
      { id: "4", rune: "ᚨ", options: ["mouth", "god"] },
    ];

    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: mockQuestions,
    });

    const { result } = renderHook(() => useQuiz("easy"));

    // Wait for questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Initial progress (1/4)
    expect(result.current.progressPercentage).toBe(25);

    // Answer first question and move to second
    await act(async () => {
      checkAnswer.mockResolvedValueOnce({
        success: true,
        data: { isCorrect: true, correctAnswer: "wealth" },
      });
      await result.current.handleAnswerSelection("wealth");
    });

    act(() => {
      result.current.handleNextQuestion();
    });

    // Progress should be 2/4 = 50%
    expect(result.current.progressPercentage).toBe(50);
  });

  it("should award different points based on difficulty", async () => {
    // Test for medium difficulty
    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: [{ id: "1", rune: "ᚠ", options: ["wealth", "strength", "cattle"] }],
    });

    checkAnswer.mockResolvedValue({
      success: true,
      data: { isCorrect: true, correctAnswer: "wealth" },
    });

    const { result: mediumResult } = renderHook(() => useQuiz("medium"));

    // Wait for questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Answer correctly
    await act(async () => {
      await mediumResult.current.handleAnswerSelection("wealth");
    });

    // Medium difficulty = 2 points
    expect(mediumResult.current.score).toBe(2);

    // Test for hard difficulty
    fetchQuizByDifficulty.mockResolvedValue({
      success: true,
      data: [
        {
          id: "2",
          rune: "ᚢ",
          options: ["strength", "wealth", "cattle", "power"],
        },
      ],
    });

    const { result: hardResult } = renderHook(() => useQuiz("hard"));

    // Wait for questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Answer correctly
    await act(async () => {
      await hardResult.current.handleAnswerSelection("strength");
    });

    // Hard difficulty = 3 points
    expect(hardResult.current.score).toBe(3);
  });
});
