import { Header } from "../components/General/Header";
import { Overview } from "../components/General/Overview";
import gitHubLogo from "../assets/github-mark-white.png"
import "./styles/About.css"

export function About() {
  return (

    <main className="About">
      <Header />
      <Overview />
      <section>
        <article className="git-link">
          <a href="https://github.com/TheOmegaFett/RuneQuest">
            <img src={gitHubLogo} alt="GitHub Logo" />
            <h3>RuneQuest Repository</h3>
          </a>
        </article>
        <article className="authors">
          <p>
            RuneQuest was created by Shane Miller,
            with contributions from Taner Maddocks.
          </p>
        </article>
      </section>
    </main>

  )
};