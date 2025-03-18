import { useState, useEffect } from "react";
import { Header } from "../components/General/Header";
import "./RunePuzzlePage.css";

export function RunePuzzlePage() {
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("all");
  const [answerRevealed, setAnswerRevealed] = useState(false);

  // Fetch puzzles from API
  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        // Using import.meta.env for Vite projects
        const apiUrl =
          import.meta.env.VITE_API_URL || "https://runequest-3po3.onrender.com";
        const response = await fetch(`${apiUrl}/api/puzzles/`);
        const data = await response.json();

        if (data.success) {
          setPuzzles(data.data);
          selectRandomPuzzle(data.data);
        } else {
          setFeedback("Failed to load puzzles");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching puzzles:", error);
        setFeedback("Error connecting to server");
        setLoading(false);
      }
    };

    fetchPuzzles();
  }, []);

  // Select a random puzzle based on current difficulty setting
  const selectRandomPuzzle = (puzzleArray) => {
    const filteredPuzzles =
      difficulty === "all"
        ? puzzleArray
        : puzzleArray.filter((puzzle) => puzzle.difficulty === difficulty);

    if (filteredPuzzles.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
      setCurrentPuzzle(filteredPuzzles[randomIndex]);
      setUserInput("");
      setFeedback("");
      setShowHint(false);
      setAnswerRevealed(false);
    } else {
      setFeedback("No puzzles available for this difficulty level");
    }
  };

  // Handle user input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Check user's answer
  const checkAnswer = () => {
    if (!currentPuzzle) return;

    // Compare user input with the correct answer (case insensitive)
    if (userInput.toLowerCase() === currentPuzzle.englishWord.toLowerCase()) {
      setFeedback("Correct! Well done!");
      // After a short delay, move to the next puzzle
      setTimeout(() => {
        selectRandomPuzzle(puzzles);
      }, 1500);
    } else {
      setFeedback("Not quite right. Try again!");
    }
  };

  // Toggle hint visibility
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    // Re-select a puzzle with the new difficulty
    selectRandomPuzzle(puzzles);
  };

  // Handle giving up and showing the answer
  const handleGiveUp = () => {
    setAnswerRevealed(true);
    setFeedback(`The correct answer is: ${currentPuzzle.englishWord}`);
  };

  // Move to the next puzzle
  const moveToNextPuzzle = () => {
    selectRandomPuzzle(puzzles);
  };

  // Handle key press for Enter key submission
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  if (loading) {
    return (
      <div className="rune-puzzle-page">
        <Header />
        <div className="puzzle-container">
          <h2>Loading puzzles...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="rune-puzzle-page">
      <Header />
      <div className="puzzle-container">
        <h1>Rune Translation Puzzle</h1>

        <div className="difficulty-selector">
          <label htmlFor="difficulty">Difficulty: </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={handleDifficultyChange}
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {currentPuzzle ? (
          <div className="puzzle">
            <div className="puzzle-challenge">
              <h2>Translate this runic text:</h2>
              <div className="rune-text">{currentPuzzle.runeEquivalent}</div>
            </div>

            <div className="puzzle-input">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter the English translation"
                disabled={answerRevealed}
              />
              <button onClick={checkAnswer} disabled={answerRevealed}>
                Check Answer
              </button>
            </div>

            <div className="puzzle-hint">
              <button onClick={toggleHint}>
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
              {showHint &&
                currentPuzzle.hints &&
                currentPuzzle.hints.length > 0 && (
                  <p>{currentPuzzle.hints[0]}</p>
                )}
            </div>

            <div className="puzzle-actions">
              {!answerRevealed ? (
                <button onClick={handleGiveUp} className="give-up-button">
                  Show Answer
                </button>
              ) : (
                <button
                  onClick={moveToNextPuzzle}
                  className="next-puzzle-button"
                >
                  Next Puzzle
                </button>
              )}
            </div>

            {feedback && <div className="feedback">{feedback}</div>}
          </div>
        ) : (
          <div className="no-puzzle">
            <p>No puzzles available. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
