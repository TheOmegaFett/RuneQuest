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
  const [retryCount, setRetryCount] = useState(0);

  const fetchPuzzles = async () => {
    try {
      console.log("Fetching puzzles from API...");

      const apiUrl = "/api/puzzles/";
      console.log("Using proxied API URL:", apiUrl);
      const response = await fetch(apiUrl);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error(
          "Received non-JSON response:",
          text.substring(0, 100) + "..."
        );
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      console.log("API response:", data);

      if (data.success && data.data && data.data.length > 0) {
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

  useEffect(() => {
    fetchPuzzles();

    const retryTimer = setTimeout(() => {
      if (puzzles.length === 0 && retryCount < 3) {
        console.log(`Retrying puzzle fetch (attempt ${retryCount + 1})...`);
        setRetryCount((prevCount) => prevCount + 1);
        fetchPuzzles();
      }
    }, 3000);

    return () => clearTimeout(retryTimer);
  }, [retryCount]);

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

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const checkAnswer = () => {
    if (!currentPuzzle) return;

    const normalizedAnswer = normalizeText(
      currentPuzzle.englishWord.toLowerCase()
    );
    const normalizedInput = normalizeText(userInput.toLowerCase());

    if (normalizedInput === normalizedAnswer) {
      setFeedback("Correct! Well done!");
      // Continue with success logic
    } else {
      setFeedback("Not quite right. Try again!");
    }
  };

  const normalizeWord = (text) => {
    const specialCharMap = {
      ð: "d",
      þ: "th",
      æ: "ae",
      ø: "o",
      å: "a",
      ö: "o",
      ý: "y",
      á: "a",
      í: "i",
      ó: "o",
      ú: "u",
      é: "e",
    };

    return text
      .toLowerCase()
      .split("")
      .map((char) => specialCharMap[char] || char)
      .join("");
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    selectRandomPuzzle(puzzles);
  };

  const handleGiveUp = () => {
    setAnswerRevealed(true);
    setFeedback(`The correct answer is: ${currentPuzzle.englishWord}`);
  };

  const moveToNextPuzzle = () => {
    selectRandomPuzzle(puzzles);
  };

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
