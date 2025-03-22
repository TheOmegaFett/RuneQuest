import QuizStats from "../components/Dashboard/QuizStats";
import { Header } from "../components/General/Header";
import { useUserJwt } from "../hooks/useUserJwt";
import "./styles/Profile.css"

// Profile page
export function Profile() {
  let API_URL = import.meta.env.VITE_API_URL;
  let userId = sessionStorage.getItem("userId");
  const [userJwt] = useUserJwt();
  const targetUrl = API_URL + "/users/one/" + userId;

  const user = async () => {
    let response = await fetch(targetUrl, {
      headers: {
        "Authorization": `Bearer ${userJwt.accessToken}`
      }
    });

    let apiResponse = await response.json();
    return apiResponse.data;
  }

  return (
    <main className="Profile">
      <Header />
      <article className="user-data">
        <h2>{user.username || "Something went wrong!"}</h2>
        <QuizStats />
      </article>
    </main>
  )

};