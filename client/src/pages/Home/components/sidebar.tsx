import "./sidebar.scss";
import { NavLink } from "react-router-dom";
import { IoHome, IoNotifications, IoCreateOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PropsWithChildren } from "react";

export default function SideBar() {
  return (
    <header className="page-section">
      <p className="display-4">Tobsnet</p>
      <nav className="navbar">
        <ul className="navbar-nav gap-3 mb-3">
          <NavItem to="/">
            <IoHome />
            <span> Home </span>
          </NavItem>
          <NavItem to="/explore">
            <MdOutlineExplore />
            <span> Explore</span>
          </NavItem>
          <NavItem to="/notifications">
            <IoNotifications />
            <span>Notifications</span>
          </NavItem>
          <NavItem to="/profile">
            <CgProfile />
            <span>Profile</span>
          </NavItem>
        </ul>
        <div className="w-100">
          <button className="btn btn-info d-flex align-items-center justify-content-start">
            <IoCreateOutline />
            <span>New Post</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

function NavItem(props: PropsWithChildren & { to: string }) {
  return (
    <li className="nav-item">
      <NavLink to={props.to} className="nav-link d-flex align-items-center gap-2">
        {props.children}
      </NavLink>
    </li>
  );
}
