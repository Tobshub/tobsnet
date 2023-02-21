import { PropsWithChildren } from "react";
import "./home.scss";
import { NavLink } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page d-flex justify-content-start align-items-start">
      <header className="page-section">
        <p className="display-4">Tobsnet</p>
        <nav className="navbar">
          <ul className="navbar-nav">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/explore">Explore</NavItem>
            <NavItem to="/notifications">Notifications</NavItem>
            <NavItem to="/profile">Profile</NavItem>
          </ul>
        </nav>
      </header>
      <main className="page-section"></main>
    </div>
  );
}

function NavItem(props: PropsWithChildren & { to: string }) {
  return (
    <li className="nav-item">
      <NavLink to={props.to}>{props.children}</NavLink>
    </li>
  );
}
