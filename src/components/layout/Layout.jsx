import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import "../../styles/layout.css";

export default function Layout({ title, links, children }) {
  return (
    <div className="layout">
      <Sidebar links={links} />
      <main className="content">
        <Header title={title} />
        <div className="content-body">{children}</div>
      </main>
    </div>
  );
}