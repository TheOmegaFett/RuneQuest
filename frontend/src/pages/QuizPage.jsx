import React, { useState, useEffect } from "react";
import { Header } from "../components/General/Header";
// import { Footer } from "../components/General/Footer";
import { useUserJwt } from "../hooks/useUserJwt";
import {
  fetchQuizByDifficulty,
  checkAnswer,
  completeQuiz,
} from "../services/quizService";
import "./styles/QuizPage.css";

export const QuizPage = () => {
  const [userJwt] = useUserJwt();

  // Replace URL parameter with state
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [achievements, setAchievements] = useState([]);

  // Load quiz questions when difficulty changes
  useEffect(() => {
    if (selectedDifficulty) {
      loadQuiz();
    }
  }, [selectedDifficulty]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchQuizByDifficulty(selectedDifficulty);

      if (response.success) {
        setQuestions(response.data);
      } else {
        setError(response.error || "Failed to load quiz questions");
      }
    } catch (err) {
      setError("Failed to load quiz questions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          const points = pointsMap[selectedDifficulty] || 1;

          setScore((prevScore) => prevScore + points);
          setCorrectAnswers((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error("Error checking answer:", err);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setAnswerResult(null);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = async () => {
    if (!userJwt.accessToken) {
      // If not logged in, just show results without saving
      setQuizCompleted(true);
      return;
    }

    try {
      const quizData = {
        userId: userJwt.userId,
        quizId: `${selectedDifficulty}-${Date.now()}`, // Generate a unique ID
        score,
        correctAnswers,
        totalQuestions: questions.length,
        difficulty: selectedDifficulty,
      };

      const response = await completeQuiz(quizData);

      if (response.success) {
        setQuizCompleted(true);
        if (response.data.newAchievements?.length > 0) {
          setAchievements(response.data.newAchievements);
        }
      }
    } catch (err) {
      console.error("Error completing quiz:", err);
    }
  };

  const startNewQuiz = () => {
    // Reset all quiz state
    setSelectedDifficulty(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setScore(0);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setAchievements([]);
  };

  const goToDashboard = () => {
    // This would need to be handled by your app's router
    // For now, we'll just reset the quiz
    startNewQuiz();
  };

  const selectDifficulty = (level) => {
    setSelectedDifficulty(level);
  };

  // Quiz Selection Screen
  if (!selectedDifficulty) {
    return (
      <>
        {/* <Header /> */}
        <div className="container my-5">
          <h1 className="text-center mb-4">Rune Quiz Challenge</h1>
          <p className="text-center mb-5">
            Test your knowledge of the Elder Futhark runes
          </p>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Easy Difficulty</h5>
                  <p className="card-text">
                    2 options per question, perfect for beginners
                  </p>
                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => selectDifficulty("easy")}
                  >
                    Start Easy Quiz
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Medium Difficulty</h5>
                  <p className="card-text">
                    3 options per question, for those with some knowledge
                  </p>
                  <button
                    className="btn btn-warning mt-auto"
                    onClick={() => selectDifficulty("medium")}
                  >
                    Start Medium Quiz
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Hard Difficulty</h5>
                  <p className="card-text">
                    4 options per question, for rune masters
                  </p>
                  <button
                    className="btn btn-danger mt-auto"
                    onClick={() => selectDifficulty("hard")}
                  >
                    Start Hard Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <>
        {/* <Header /> */}
        <div className="container d-flex justify-content-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        {/* <Header /> */}
        <div className="container my-5">
          <div className="alert alert-danger">{error}</div>
          <button className="btn btn-primary" onClick={startNewQuiz}>
            Back to Quiz Selection
          </button>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  // Quiz completed state
  if (quizCompleted) {
    return (
      <>
        {/* <Header /> */}
        <div className="container my-5">
          <div className="card">
            <div className="card-body text-center">
              <h2>Quiz Completed!</h2>
              <p>You scored {score} points</p>
              <p>
                Correct answers: {correctAnswers} out of {questions.length}
              </p>

              {achievements.length > 0 && (
                <div className="mt-4">
                  <h3>Achievements Unlocked!</h3>
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="alert alert-success">
                      {achievement.title}: {achievement.description}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <button className="btn btn-primary me-2" onClick={startNewQuiz}>
                  Try Another Quiz
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={goToDashboard}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  // Active quiz state
  if (questions.length === 0) {
    return (
      <>
        {/* <Header /> */}
        <div className="container my-5">
          <div className="alert alert-warning">
            No questions available for this difficulty level.
          </div>
          <button className="btn btn-primary" onClick={startNewQuiz}>
            Back to Quiz Selection
          </button>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <>
      {/* <Header /> */}
      <div className="container my-5">
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="badge bg-primary text-capitalize">
                {selectedDifficulty}
              </span>
            </div>
            <div className="progress mt-2">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <div className="card-body">
            <div className="text-center mb-4">
              <h1 style={{ fontSize: "4rem" }}>{currentQuestion.rune}</h1>
              <p>What does this rune mean?</p>
            </div>

            <div className="d-grid gap-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`btn ${
                    selectedAnswer === option
                      ? answerResult?.isCorrect
                        ? "btn-success"
                        : "btn-danger"
                      : answerResult && answerResult.correctAnswer === option
                      ? "btn-success"
                      : "btn-outline-primary"
                  } py-2`}
                  onClick={() => handleAnswerSelection(option)}
                  disabled={answerResult !== null}
                >
                  {option}
                </button>
              ))}
            </div>

            {answerResult && (
              <div className="mt-4">
                <div
                  className={`alert ${
                    answerResult.isCorrect ? "alert-success" : "alert-danger"
                  }`}
                >
                  {answerResult.isCorrect
                    ? "Correct!"
                    : `Incorrect. The correct answer is: ${answerResult.correctAnswer}`}
                </div>

                {answerResult.additionalInfo && (
                  <div className="alert alert-info">
                    <strong>Additional Info:</strong>{" "}
                    {answerResult.additionalInfo}
                  </div>
                )}

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                </button>
              </div>
            )}
          </div>

          <div className="card-footer text-muted">
            <div className="d-flex justify-content-between">
              <span>Score: {score}</span>
              <span>
                Correct: {correctAnswers}/
                {currentQuestionIndex + (answerResult ? 1 : 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default QuizPage;
