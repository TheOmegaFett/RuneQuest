import { Header } from "../components/Header";
import { LoginForm } from "../components/LoginForm";
// import { useUserJwtContext } from "../contexts/UserJwtContext";

export function Landing() {

  // If userJwt is not "", then user is logged in, redirect to dashboard

  // let  [userJwt] = useUserJwtContext();
  // if (userJwt.accessToken !== "") {}
  
  // Else, render landing page
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