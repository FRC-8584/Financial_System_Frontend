import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import "../../styles/layout.css";
import { LogoutConfirm } from "../LogoutConfirm.jsx";

export default function Layout({ title, links, children }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="layout">
      {/* Header 固定於頂部 */}
      <Header title={title} showLogout={() => setShowLogoutConfirm(true)} />

      {/* Sidebar 與主內容 */}
      <div className="layout-body">
        <Sidebar links={links} />
        <main className="content-body">{children}</main>
      </div>

      {showLogoutConfirm && (
        <LogoutConfirm setShowLogoutConfirm={setShowLogoutConfirm} />
      )}
    </div>
  );
}