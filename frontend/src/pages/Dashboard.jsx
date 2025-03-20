import { useState } from "react";
import { Header } from "../components/General/Header";
import "./styles/Dashboard.css"

// Dashboard page
export function Dashboard() {

  let [focus, setFocus] = useState(['1', '0', '0'])

  return (
    <main className="Dashboard">
      <Header />
      <section className="content">
        <button
          className="learning"
          onClick={() => setFocus(['1', '0', '0'])}
        >
          Learning
        </button>
        <article className="learning" style={{ zIndex: focus[0] }}>
          Learning Module
        </article>
        <button
          className="quizzes"
          onClick={() => setFocus(['0', '1', '0'])}
        >
          Quizzes
        </button>
        <article className="quizzes" style={{ zIndex: focus[1] }}>
          Quiz Module
        </article>
        <button
          className="casting"
          onClick={() => setFocus(['0', '0', '1'])}
        >
          Casting
        </button>
        <article className="casting" style={{ zIndex: focus[2] }}>
          Casting Module
        </article>
      </section>
    </main>
  )

};