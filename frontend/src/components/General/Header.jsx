import "./Header.css";
import profileIcon from "../../assets/profile.png";
import menuIcon from "../../assets/menu.png";

// Header component
// If user is logged in, render menu button and profile link
// Else, render only the title

export function Header({ notLoggedIn }) {
  const urlParams = new URLSearchParams(window.location.search);
  let page = urlParams.get("page");

  if (notLoggedIn) {
    return (
      <header data-testid="header">
        <h1>RuneQuest</h1>
      </header>
    );
  } else {
    return (
      <header data-testid="header">
        <button className="menu-button">
          <img src={menuIcon} alt="menu icon" />
        </button>
        <h1>RuneQuest</h1>
        <a className="profile-link" href="/?page=profile">
          <img src={profileIcon} alt="profile icon" />
        </a>
      </header>
    );
  }
}
