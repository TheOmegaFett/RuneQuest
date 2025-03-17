import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RuneLearningPage } from "./pages/RuneLearningPage";
import { RuneCastingTestPage } from "./pages/RuneCastingTestPage";
import { UserJwtProvider } from "./contexts/UserJwtContext.jsx";

// Get the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get("page");

// Render the appropriate component
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Conditional rendering based on the page parameter
if (page === "learning") {
  root.render(
    <StrictMode>
      <RuneLearningPage />
    </StrictMode>
  );
} else if (page === "casting") {
  root.render(
    <StrictMode>
      <RuneCastingTestPage />
    </StrictMode>
  );
} else {
  root.render(
    <UserJwtProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </UserJwtProvider>
  );
}
