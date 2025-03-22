import { useState } from "react";
import { Header } from "../components/General/Header";
import "./styles/Dashboard.css";
import RuneCastingPage from "./RuneCastingPage";
import { RunePuzzlePage } from "./RunePuzzlePage";
import { QuizPage } from "./QuizPage";
import { RuneLearningPage } from "./RuneLearningPage";

// Dashboard page
export function Dashboard() {
  let [focus, setFocus] = useState(["1", "0", "0", "0"]);

  return (
    <main className="Dashboard">
      <Header />
      <section className="content">
        <button
          className="learning"
          onClick={() => setFocus(["1", "0", "0", "0"])}
        >
          Learn
        </button>
        <article className="learning" style={{ zIndex: focus[0] }}>
          {/* Learning Module */}
          <RuneLearningPage />
        </article>
        <button
          className="quizzes"
          onClick={() => setFocus(["0", "1", "0", "0"])}
        >
          Quizzes
        </button>
        <article className="quizzes" style={{ zIndex: focus[1] }}>
          {/* Quiz Module */}
          <QuizPage />
        </article>
        <button
          className="puzzles"
          onClick={() => setFocus(["0", "0", "1", "0"])}
        >
          Puzzles
        </button>
        <article className="puzzles" style={{ zIndex: focus[2] }}>
          {/* Puzzle Module */}
          <RunePuzzlePage />
        </article>
        <button
          className="casting"
          onClick={() => setFocus(["0", "0", "0", "1"])}
        >
          Cast
        </button>
        <article className="casting" style={{ zIndex: focus[3] }}>
          {/* Casting Module */}
          <RuneCastingPage />
        </article>
      </section>
    </main>
  );
}
