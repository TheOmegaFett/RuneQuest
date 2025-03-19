import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  fetchQuizByDifficulty,
  checkAnswer,
  completeQuiz,
} from "../../services/quizService";
import { useAuth } from "../../contexts/AuthContext"; // Adjust import based on your auth setup

const Quiz = () => {
  const { difficulty } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Adjust based on your auth context

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetchQuizByDifficulty(difficulty);
        if (response.success) {
          setQuestions(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError("Failed to load quiz questions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [difficulty]);

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
    if (!user) {
      // If not logged in, just show results without saving
      setQuizCompleted(true);
      return;
    }

    try {
      const quizData = {
        userId: user.id,
        quizId: `${difficulty}-${Date.now()}`, // Generate a unique ID
        score,
        correctAnswers,
        totalQuestions: questions.length,
        difficulty,
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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate("/quiz")}>
          Back to Quiz Selection
        </Button>
      </Container>
    );
  }

  if (quizCompleted) {
    return (
      <Container className="my-5">
        <Card className="shadow">
          <Card.Body className="text-center">
            <h2>Quiz Completed!</h2>
            <p>You scored {score} points</p>
            <p>
              Correct answers: {correctAnswers} out of {questions.length}
            </p>

            {achievements.length > 0 && (
              <div className="mt-4">
                <h3>Achievements Unlocked!</h3>
                {achievements.map((achievement) => (
                  <Alert key={achievement.id} variant="success">
                    {achievement.title}: {achievement.description}
                  </Alert>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Button variant="primary" onClick={() => navigate("/quiz")}>
                Try Another Quiz
              </Button>
              <Button
                variant="outline-secondary"
                className="ms-2"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="badge bg-primary text-capitalize">
              {difficulty}
            </span>
          </div>
          <ProgressBar now={progress} className="mt-2" />
        </Card.Header>

        <Card.Body>
          <div className="text-center mb-4">
            <h1 style={{ fontSize: "4rem" }}>{currentQuestion.rune}</h1>
            <p>What does this rune mean?</p>
          </div>

          <div className="d-grid gap-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === option
                    ? answerResult?.isCorrect
                      ? "success"
                      : "danger"
                    : answerResult && answerResult.correctAnswer === option
                    ? "success"
                    : "outline-primary"
                }
                onClick={() => handleAnswerSelection(option)}
                disabled={answerResult !== null}
                className="py-2"
              >
                {option}
              </Button>
            ))}
          </div>

          {answerResult && (
            <div className="mt-4">
              <Alert variant={answerResult.isCorrect ? "success" : "danger"}>
                {answerResult.isCorrect
                  ? "Correct!"
                  : `Incorrect. The correct answer is: ${answerResult.correctAnswer}`}
              </Alert>

              {answerResult.additionalInfo && (
                <Alert variant="info">
                  <strong>Additional Info:</strong>{" "}
                  {answerResult.additionalInfo}
                </Alert>
              )}

              <Button
                variant="primary"
                className="w-100 mt-3"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            </div>
          )}
        </Card.Body>

        <Card.Footer className="text-muted">
          <div className="d-flex justify-content-between">
            <span>Score: {score}</span>
            <span>
              Correct: {correctAnswers}/
              {currentQuestionIndex + (answerResult ? 1 : 0)}
            </span>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Quiz;
