import axios from "axios";
// At the top of your file, add this debug line
console.log("API URL:", import.meta.env.VITE_API_URL);

// And update your API creation to be more explicit
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("Using API URL:", API_URL);

// Create axios instance with base URL
const API = axios.create({
  baseURL: API_URL,
  // Add timeout to avoid hanging requests
  timeout: 10000,
});

// Improved interceptor for authentication
API.interceptors.request.use((req) => {
  try {
    // Get the JWT from localStorage
    const userJwtString = localStorage.getItem("userJwt");
    if (userJwtString) {
      const userJwt = JSON.parse(userJwtString);
      if (userJwt && userJwt.accessToken) {
        req.headers.Authorization = `Bearer ${userJwt.accessToken}`;
      }
    }
  } catch (error) {
    console.error("Error setting auth header:", error);
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
    const response = await API.get(`/api/quizzes/${difficulty}?count=${count}`);

    // Process the questions to ensure each has a correctAnswer property
    if (response.data.success && response.data.data) {
      const questions = response.data.data;

      // Ensure each question has a correctAnswer property
      questions.forEach((question) => {
        if (!question.correctAnswer && question.meaning) {
          question.correctAnswer = question.meaning;
        }
      });

      return response.data;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch quiz questions",
      data: null,
    };
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
    // Let's manually add the token for this specific request
    const userJwtString = localStorage.getItem("userJwt");
    let token = null;
    if (userJwtString) {
      const userJwt = JSON.parse(userJwtString);
      token = userJwt?.accessToken;
    }

    const response = await API.post(
      "/api/quizzes/check",
      { questionId, selectedAnswer },
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return response.data;
  } catch (error) {
    console.error("Error checking answer:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to check answer",
      data: null,
    };
  }
};

/**
 * Check if the selected answer is correct using direct fetch
 * @param {string} questionId - ID of the question
 * @param {string} selectedAnswer - User's selected answer
 * @returns {Promise} - API response with result
 */
export const checkAnswerDirect = async (questionId, selectedAnswer) => {
  try {
    // Debug the JWT token in localStorage
    const userJwtString = localStorage.getItem("userJwt");
    console.log("Raw JWT from localStorage:", userJwtString);

    let token = null;
    if (userJwtString) {
      try {
        const userJwt = JSON.parse(userJwtString);
        console.log("Parsed JWT object:", userJwt);
        token = userJwt?.accessToken;
        console.log("Access token:", token);
      } catch (e) {
        console.error("Error parsing JWT:", e);
      }
    } else {
      console.log("No JWT found in localStorage");
    }

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("Request headers:", headers);
    console.log("Request body:", { questionId, selectedAnswer });

    const response = await fetch(`${API_URL}/api/quizzes/check`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ questionId, selectedAnswer }),
    });

    console.log("Response status:", response.status);

    // Try to get more information about the error
    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.log("Error response data:", errorData);
      } catch (e) {
        console.log("Could not parse error response");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error in direct fetch:", error);
    return {
      success: false,
      error: error.message || "Failed to check answer",
      data: null,
    };
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
export const completeQuiz = async (quizData, token) => {
  try {
    // Debug the token
    console.log("Token for quiz completion:", token);

    // If no token is provided, return a client-side response
    if (!token) {
      console.log(
        "No token provided for quiz completion, returning client-side response"
      );
      return {
        success: true,
        data: {
          message: "Quiz completed (client-side only)",
          newAchievements: [], // No achievements since we can't save to the server
        },
      };
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log("Quiz completion headers:", headers);
    console.log("Quiz completion data:", quizData);

    // Try using fetch instead of axios
    const response = await fetch(`${API_URL}/api/quizzes/complete`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(quizData),
    });

    console.log("Quiz completion response status:", response.status);

    if (!response.ok) {
      // If server request fails, still return a success response for client-side
      console.error(`Quiz completion failed with status: ${response.status}`);
      return {
        success: true,
        data: {
          message: "Quiz completed (client-side only, server save failed)",
          newAchievements: [], // No achievements since we couldn't save to the server
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error completing quiz:", error);
    // Return a client-side success response even if there's an error
    return {
      success: true,
      data: {
        message: "Quiz completed (client-side only, error occurred)",
        newAchievements: [], // No achievements since we couldn't save to the server
      },
    };
  }
};

// Add this function to check authentication status
export const checkAuthStatus = () => {
  try {
    const userJwtString = localStorage.getItem("userJwt");
    if (!userJwtString) {
      console.log("No JWT found in localStorage");
      return false;
    }

    const userJwt = JSON.parse(userJwtString);
    if (!userJwt || !userJwt.accessToken) {
      console.log("JWT found but no access token");
      return false;
    }

    // Check if token is expired (if it has an exp claim)
    if (userJwt.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (now > userJwt.exp) {
        console.log("JWT is expired");
        return false;
      }
    }

    console.log("User appears to be authenticated");
    return true;
  } catch (e) {
    console.error("Error checking auth status:", e);
    return false;
  }
};
