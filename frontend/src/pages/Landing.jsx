import { Header } from "../components/Header";
import { LoginForm } from "../components/LoginForm";

export function Landing() {

  return (
    <>
      <Header loggedIn={false} />
      <LoginForm />
      <section className="overview">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo unde
          deleniti iusto laborum provident repellendus! Esse sequi dignissimos
          temporibus magnam dolorum, asperiores praesentium fugit unde
          corrupti sint, tempore aut nihil.
        </p>
      </section>
    </>
  )

};