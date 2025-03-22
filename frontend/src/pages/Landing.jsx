import "./styles/Landing.css";
import { Header } from "../components/General/Header";
import { LoginForm } from "../components/Landing/LoginForm";
import { Overview } from "../components/General/Overview";

// Landing page
export function Landing() {

  return (
    <main className="Landing">
      <Header notLoggedIn={true} />
      <section className="login-form-container">
        <LoginForm />
      </section>
      <Overview />
    </main>
  )

};