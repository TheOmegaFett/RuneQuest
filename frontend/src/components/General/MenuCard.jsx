import "./MenuCard.css"

export function MenuCard() {
  return (
    <nav className="menu-card">
      <ul>
        <li>
          <a href="/?page=about">About</a>
        </li>
        <li>
          <a href="">DummyLink</a>
        </li>
        <li className="divider"></li>
        <li>
          <button
            onClick={() => {
              sessionStorage.removeItem("jwt");
              window.location.reload(false);
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};