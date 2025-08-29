import React from "react";
import "../../styles/layout.css";

export default function Sidebar({ links }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
      <nav className="sidebar-nav">
        {links.map((link, index) => (
          <a key={index} href={link.href} className="sidebar-link">
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}