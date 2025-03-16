import "../styles/components/Header.css";

// Header component
// If user is logged in, render menu button and profile link
// Else, render only the title

export function Header({ notLoggedIn }) {
  if (notLoggedIn) {
    return (
      <header>
        <h1>RuneQuest</h1>
      </header>
    );
  } else {
    return (
      <header>
        <div className="menu-button">
          {/* Menu button, not functional yet*/}
          |||
          </div>
        <h1>RuneQuest</h1>
        <div className="profile-link">
          {/* Profile link, not functional yet*/}
          :D
          </div> 
      </header>
    );
  }
};