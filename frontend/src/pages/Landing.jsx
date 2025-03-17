import { Header } from "../components/Header";
import { LoginForm } from "../components/LoginForm";

// Landing page
export function Landing() {

  return (
    <>
      <Header notLoggedIn={true} />
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