import "../styles/components/Header.css";

// Header component

export function Header({ loggedIn }) {
  if (loggedIn) {
    return (
      <header>
        <div className="menu-button">|||</div>
        <h1>RuneQuest</h1>
        <div className="profile-link">:D</div>
      </header>
    );
  } else {
    return (
      <header>
        <h1>RuneQuest</h1>
      </header>
    );
  }
};