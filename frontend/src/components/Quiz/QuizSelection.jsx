import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const QuizSelection = () => {
  const navigate = useNavigate();

  const difficulties = [
    {
      level: "easy",
      description: "2 options per question, perfect for beginners",
      color: "success",
    },
    {
      level: "medium",
      description: "3 options per question, for those with some knowledge",
      color: "warning",
    },
    {
      level: "hard",
      description: "4 options per question, for rune masters",
      color: "danger",
    },
  ];

  const startQuiz = (difficulty) => {
    navigate(`/quiz/${difficulty}`);
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Rune Quiz Challenge</h1>
      <p className="text-center mb-5">
        Test your knowledge of the Elder Futhark runes
      </p>

      <Row>
        {difficulties.map((diff) => (
          <Col md={4} key={diff.level} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-capitalize">
                  {diff.level} Difficulty
                </Card.Title>
                <Card.Text>{diff.description}</Card.Text>
                <Button
                  variant={diff.color}
                  className="mt-auto"
                  onClick={() => startQuiz(diff.level)}
                >
                  Start {diff.level} Quiz
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default QuizSelection;
