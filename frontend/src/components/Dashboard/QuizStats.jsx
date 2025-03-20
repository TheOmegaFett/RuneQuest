import React, { useEffect, useState } from "react";
import { Card, ListGroup, Badge, Spinner } from "react-bootstrap";
import axios from "axios";
import { useUserJwt } from "../../hooks/useUserJwt"; // Use useUserJwt instead of useAuth

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const QuizStats = () => {
  const [userJwt] = useUserJwt(); // Use useUserJwt hook
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/users/${userJwt.userId}/progress`,
          {
            headers: { Authorization: `Bearer ${userJwt.accessToken}` },
          }
        );

        if (response.data.success) {
          setStats(response.data.data.stats);
        } else {
          setError(response.data.error);
        }
      } catch (error) {
        setError("Error fetching user stats");
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userJwt.accessToken) {
      fetchUserStats();
    }
  }, [userJwt]);

  if (loading) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center">
          <Spinner animation="border" size="sm" />
          <span className="ms-2">Loading stats...</span>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-danger">{error}</Card.Body>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="mb-4">
        <Card.Body>No quiz stats available yet. Try taking a quiz!</Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Quiz Performance</h5>
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          Total Points
          <Badge bg="primary" pill>
            {stats.totalPoints}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          Current Streak
          <Badge bg="success" pill>
            {stats.quizStreak} {stats.quizStreak === 1 ? "day" : "days"}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          Runes Learned
          <Badge bg="info" pill>
            {stats.runesLearned}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default QuizStats;
