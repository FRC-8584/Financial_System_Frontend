import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/layout.css";

export default function Sidebar({ links }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.href}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}