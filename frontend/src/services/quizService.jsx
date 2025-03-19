import axios from "axios";
// Use your API URL from environment variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// Create axios instance with base URL
const API = axios.create({ baseURL: API_URL });

// Add auth token to requests using your existing userJwt pattern
API.interceptors.request.use((req) => {
  const userJwt = JSON.parse(localStorage.getItem("userJwt") || "{}");
  if (userJwt.accessToken) {
    req.headers.Authorization = `Bearer ${userJwt.accessToken}`;
  }
  return req;
});

/** * Fetch quiz questions by difficulty level
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @param {number} count - Number of questions to fetch (default: 10)
 * @returns {Promise} - API response with quiz questions
 */
export const fetchQuizByDifficulty = async (difficulty, count = 10) => {
  try {
    // Change from /quizzes/ to /api/quiz/
    const response = await API.get(`/api/quizzes/${difficulty}?count=${count}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw (
      error.response?.data || {
        success: false,
        error: "Failed to fetch quiz questions",
        data: null,
      }
    );
  }
};
/**
 * Check if the selected answer is correct
 * @param {string} questionId - ID of the question
 * @param {string} selectedAnswer - User's selected answer
 * @returns {Promise} - API response with result
 */
export const checkAnswer = async (questionId, selectedAnswer) => {
  try {
    const response = await API.post("/api/quizzes/check", {
      questionId,
      selectedAnswer,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking answer:", error);
    throw (
      error.response?.data || {
        success: false,
        error: "Failed to check answer",
        data: null,
      }
    );
  }
};

/**
 * Complete a quiz and save results
 * @param {Object} quizData - Quiz completion data
 * @param {string} quizData.userId - User ID
 * @param {string} quizData.quizId - Quiz ID
 * @param {number} quizData.score - Total score
 * @param {number} quizData.correctAnswers - Number of correct answers
 * @param {number} quizData.totalQuestions - Total number of questions
 * @param {string} quizData.difficulty - Quiz difficulty
 * @returns {Promise} - API response with updated user progress and achievements
 */
export const completeQuiz = async (quizData) => {
  try {
    const response = await API.post("/quizzes/complete", quizData);
    return response.data;
  } catch (error) {
    console.error("Error completing quiz:", error);
    throw (
      error.response?.data || {
        success: false,
        error: "Failed to complete quiz",
        data: null,
      }
    );
  }
};
