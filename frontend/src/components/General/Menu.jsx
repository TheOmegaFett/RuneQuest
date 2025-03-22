import { useState } from "react";
import "./Menu.css"

export function Menu() {
  let [open, setOpen] = useState("")

  return (
    <nav
      className="menu-group"
      onMouseEnter={() => setOpen("-open")}
      onMouseLeave={() => setOpen("")}
    >
      <button
        className="menu-button"
        id="header-comp"
        onClick={() => {
          let openStatus = open == "-open" ? "" : "-open"
          setOpen(openStatus)
        }}
      >
        <div></div><div></div><div></div>
      </button>

      <ul className="menu-card" id={`menu${open}`}>
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
              sessionStorage.clear();
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