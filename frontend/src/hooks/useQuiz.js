import { useState, useEffect } from "react";
import { useUserJwt } from "./useUserJwt";
import {
  fetchQuizByDifficulty,
  checkAnswer,
  completeQuiz,
} from "../services/quizService";

/**
 * Custom hook for managing quiz state and interactions
 * @param {string} difficulty - The quiz difficulty level (easy, medium, hard)
 * @returns {Object} Quiz state and functions
 */
export const useQuiz = (difficulty) => {
  const [userJwt] = useUserJwt();

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizState, setQuizState] = useState("loading"); // loading, active, completed
  const [error, setError] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [quizResults, setQuizResults] = useState(null);

  // Load quiz questions when difficulty changes
  useEffect(() => {
    if (difficulty) {
      loadQuiz();
    }
  }, [difficulty]);

  /**
   * Load quiz questions for the specified difficulty
   */
  const loadQuiz = async () => {
    try {
      setQuizState("loading");
      setError(null);

      const response = await fetchQuizByDifficulty(difficulty);

      if (response.success && response.data.length > 0) {
        setQuestions(response.data);
        setQuizState("active");

        // Reset quiz state
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setAnswerResult(null);
        setScore(0);
        setCorrectAnswers(0);
        setAchievements([]);
        setQuizResults(null);
      } else {
        setError(
          response.error || "No questions available for this difficulty level"
        );
        setQuizState("error");
      }
    } catch (err) {
      console.error("Error loading quiz:", err);
      setError("Failed to load quiz questions. Please try again.");
      setQuizState("error");
    }
  };

  /**
   * Handle user selecting an answer
   * @param {string} answer - The selected answer
   */
  const handleAnswerSelection = async (answer) => {
    if (answerResult) return; // Prevent multiple selections

    setSelectedAnswer(answer);

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const response = await checkAnswer(currentQuestion.id, answer);

      if (response.success) {
        const result = response.data;
        setAnswerResult(result);

        if (result.isCorrect) {
          // Calculate points based on difficulty
          const pointsMap = { easy: 1, medium: 2, hard: 3 };
          const points = pointsMap[difficulty] || 1;

          setScore((prevScore) => prevScore + points);
          setCorrectAnswers((prev) => prev + 1);
        }
      } else {
        setError(response.error || "Failed to check answer");
      }
    } catch (err) {
      console.error("Error checking answer:", err);
      setError("Failed to check answer. Please try again.");
    }
  };

  /**
   * Move to the next question or complete the quiz
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setAnswerResult(null);
    } else {
      handleQuizCompletion();
    }
  };

  /**
   * Complete the quiz and save results
   */
  const handleQuizCompletion = async () => {
    try {
      // Prepare results data
      const resultsData = {
        score,
        correctAnswers,
        totalQuestions: questions.length,
        difficulty,
      };

      setQuizResults(resultsData);

      // If user is logged in, save results to server
      if (userJwt.accessToken) {
        const quizData = {
          userId: userJwt.userId,
          quizId: `${difficulty}-${Date.now()}`, // Generate a unique ID
          ...resultsData,
        };

        const response = await completeQuiz(quizData);

        if (response.success) {
          if (response.data.newAchievements?.length > 0) {
            setAchievements(response.data.newAchievements);
          }
        } else {
          setError(response.error || "Failed to save quiz results");
        }
      }

      // Show results screen
      setQuizState("completed");
    } catch (err) {
      console.error("Error completing quiz:", err);
      setError("Failed to complete quiz. Your results may not be saved.");
      // Still show results even if saving failed
      setQuizState("completed");
    }
  };

  /**
   * Reset the quiz to start over
   */
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setScore(0);
    setCorrectAnswers(0);
    setQuizState("active");
    setError(null);
    setAchievements([]);
    setQuizResults(null);
  };

  /**
   * Get the current question
   */
  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex] || null;
  };

  /**
   * Calculate the current progress percentage
   */
  const getProgressPercentage = () => {
    return questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;
  };

  return {
    // State
    quizState,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    answerResult,
    score,
    correctAnswers,
    error,
    achievements,
    quizResults,

    // Computed values
    currentQuestion: getCurrentQuestion(),
    progressPercentage: getProgressPercentage(),
    totalQuestions: questions.length,

    // Actions
    loadQuiz,
    handleAnswerSelection,
    handleNextQuestion,
    resetQuiz,
  };
};
