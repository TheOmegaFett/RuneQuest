import "./App.css";

// Import hooks
import { useUserJwt } from "./hooks/useUserJwt";

// Import pages
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { About } from "./pages/About";
import { RuneLearningPage } from "./pages/RuneLearningPage";
import { RuneCastingPage } from "./pages/RuneCastingPage";
import { RunePuzzlePage } from "./pages/RunePuzzlePage";
import { QuizPage } from "./pages/QuizPage";

// Import functions
import { tokenVerified } from "./api/tokenVerified";


function App() {
  // Get the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page");

  // If no userJwt, render landing page
  let [userJwt] = useUserJwt();

  if (!userJwt.accessToken) {
    return <Landing />;
  } else {
    // Verify the provided token
    tokenVerified(userJwt.accessToken)
    // Conditional rendering based on the page parameter
    switch (page) {
      case "profile":
        return <Profile />;
      case "about":
        return <About />
      case "learning":
        return <RuneLearningPage />;
      case "casting":
        return <RuneCastingPage />;
      case "puzzles":
        return <RunePuzzlePage />;
      case "quiz":
        return <QuizPage />;
      default:
        return <Dashboard />;
    }
  }
}
export default App;
