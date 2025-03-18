import './App.css';

// Import hooks
import { useUserJwt } from './hooks/useUserJwt';

// Import pages
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { RuneLearningPage } from './pages/RuneLearningPage';
import { RuneCastingTestPage } from './pages/RuneCastingTestPage';

function App() {

  // If no userJwt, render landing page
  let [userJwt] = useUserJwt();
  if (!userJwt.accessToken) {
    return (
      <Landing />
    );
  }
  // Else render other pages based on URL parameters
  else {
    // Get the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("page");

    // Conditional rendering based on the page parameter
    switch (page) {
      case "profile":
        return (
          <Profile />
        );
      case "learning":
        return (
          <RuneLearningPage />
        );
      case "casting":
        return (
          <RuneCastingTestPage />
        );
      default:
        return (
          <Dashboard />
        );
    };
  }

};

export default App
