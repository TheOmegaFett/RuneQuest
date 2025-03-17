import './App.css';

// Import hooks
import { useUserJwt } from './hooks/useUserJwt';

// Import pages
// import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';

function App() {

  // If no userJwt, render landing page
  let [userJwt] = useUserJwt();
  if (!userJwt.accessToken) {
    return (
      <Landing />
    );
  }
  // Else render dashboard and/or other pages
  else {
    return (
        <p>placeholder</p>
        // <Dashboard />
    );
  }

};

export default App
