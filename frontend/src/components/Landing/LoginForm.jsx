import "./LoginForm.css";
import { useState } from "react";
import { useUserJwt } from "../../hooks/useUserJwt";

// Dynamic form that allows users to login to or register their account 

export function LoginForm() {

  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [action, setAction] = useState("");
  let [errorMessage, setErrorMessage] = useState("");

  let [userJwt, setUserJwt] = useUserJwt();

  async function handleLogin(event) {
    event.preventDefault();

    // Log attempt to login/register to console
    console.log(`Sending request to ${action} user...`);
    console.log("Username:", username);
    console.log("Password:", password);

    // Identify the location we are sending the request to
    let targetUrl = import.meta.env.VITE_API_URL + "/api/users/" + action;

    // Prepare the data to send to the server
    let inputDataToSend = JSON.stringify({
      username: username,
      password: password,
    });
    console.log("Data to send:", inputDataToSend);

    // Create the fetch request
    let response = await fetch(
      targetUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: inputDataToSend,
      },
    );

    // Parse the response from the API
    let apiResponse = await response.json();
    let log = ("API response:\n", JSON.stringify(apiResponse, null, 2));
    apiResponse.success ? console.log(log) : console.error(log);

    if (apiResponse.success) {
      // Save response to global state
      setUserJwt({
        accessToken: apiResponse.token
      });
      console.log("User JWT saved to global state. User is now logged in.");
    }
    else {
      // Display error message
      setErrorMessage(apiResponse.error);
    }
  };

  return (
    <form
      className="login-form" onSubmit={(event) => handleLogin(event)}>
      <section className="input-group">
        <div className="username-block">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="password-block">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </section>
      <section className="error-notifications">
        <div className="error-message">{errorMessage}</div>
      </section>
      <section className="submit-group">
        <button type="submit" onClick={() => setAction("login")}>
          Login
        </button>
        <button type="submit" onClick={() => setAction("register")}>
          Register
        </button>
      </section>
    </form>
  )

};