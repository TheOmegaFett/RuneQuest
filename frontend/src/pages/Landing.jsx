import { Header } from "../components/General/Header";
import { LoginForm } from "../components/Landing/LoginForm";

// Landing page
export function Landing() {

  return (
    <>
      <Header notLoggedIn={true} />
      <LoginForm />
      <article className="overview">
        <h3>What is RuneQuest?</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo unde
          deleniti iusto laborum provident repellendus! Esse sequi dignissimos
          temporibus magnam dolorum, asperiores praesentium fugit unde
          corrupti sint, tempore aut nihil.
        </p>
      </article>
    </>
  )

};