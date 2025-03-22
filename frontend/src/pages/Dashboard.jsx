import { useState } from "react";
import { Header } from "../components/General/Header";
import "./styles/Dashboard.css";
import RuneCastingPage from "./RuneCastingPage";
import { RunePuzzlePage } from "./RunePuzzlePage";
import { QuizPage } from "./QuizPage";
import { RuneLearningPage } from "./RuneLearningPage";

// Dashboard page
export function Dashboard() {
  let [focus, setFocus] = useState(["flex", "none", "none", "none"]);

  return (
    <main className="Dashboard">
      <Header />
      <section className="content">
        <button
          className="learning"
          id="tab-button"
          onClick={() => setFocus(["flex", "none", "none", "none"])}
        >
          Learn
        </button>
        <article className="learning" style={{ display: focus[0] }}>
          {/* Learning Module */}
          <RuneLearningPage />
        </article>
        <button
          className="quizzes"
          id="tab-button"
          onClick={() => setFocus(["none", "flex", "none", "none"])}
        >
          Quizzes
        </button>
        <article className="quizzes" style={{ display: focus[1] }}>
          {/* Quiz Module */}
          <QuizPage />
        </article>
        <button
          className="puzzles"
          id="tab-button"
          onClick={() => setFocus(["none", "none", "flex", "none"])}
        >
          Puzzles
        </button>
        <article className="puzzles" style={{ display: focus[2] }}>
          {/* Puzzle Module */}
          <RunePuzzlePage />
        </article>
        <button
          className="casting"
          id="tab-button"
          onClick={() => setFocus(["none", "none", "none", "flex"])}
        >
          Cast
        </button>
        <article className="casting" style={{ display: focus[3] }}>
          {/* Casting Module */}
          <RuneCastingPage />
        </article>
      </section>
    </main>
  );
}
