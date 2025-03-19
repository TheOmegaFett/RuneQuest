import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, ListGroup, Badge } from "react-bootstrap";

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, correctAnswers, totalQuestions, difficulty, achievements } =
    location.state || {};

  // If no quiz data is passed, redirect to quiz selection
  if (!score && !correctAnswers) {
    navigate("/quiz");
    return null;
  }

  const getScoreColor = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-danger";
  };

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Quiz Results</h2>

          <div className="text-center mb-4">
            <h3 className={getScoreColor()}>
              {correctAnswers} out of {totalQuestions} correct
            </h3>
            <p className="lead">
              You scored {score} points on {difficulty} difficulty
            </p>
          </div>

          {achievements && achievements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-center">Achievements Unlocked!</h4>
              <ListGroup>
                {achievements.map((achievement, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{achievement.title}</strong>
                      <p className="mb-0 text-muted">
                        {achievement.description}
                      </p>
                    </div>
                    <span className="badge bg-success rounded-pill">
                      +{achievement.points} pts
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          <div className="d-grid gap-2">
            <Button variant="primary" onClick={() => navigate("/quiz")}>
              Try Another Quiz
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizResults;
