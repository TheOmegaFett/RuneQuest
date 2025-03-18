import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserJwtProvider } from "./contexts/UserJwtContext.jsx";

// Render the appropriate component
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <UserJwtProvider>
      <App />
    </UserJwtProvider>
  </StrictMode>
);