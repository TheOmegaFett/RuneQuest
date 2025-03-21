import "./styles/Landing.css";
import { Header } from "../components/General/Header";
import { LoginForm } from "../components/Landing/LoginForm";

// Landing page
export function Landing() {

  return (
    <main className="Landing">
      <Header notLoggedIn={true} />
      <section className="login-form-container">
        <LoginForm />
      </section>
      <article className="overview" data-testid="overview" >
        <h2>What is RuneQuest?</h2>
        <p>
          RuneQuest is an interactive app designed to help users learn
          and master the art of runes. It combines engaging lessons,
          practice exercises, and rune divination readings to make the
          process of learning runes both fun and educational.
        </p>
      </article>
    </main>
  )

};