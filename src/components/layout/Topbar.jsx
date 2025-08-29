import React from "react";
import "../../styles/layout.css";

export default function Topbar({ title, showLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="user-info">用戶</div>

        <button className="logout-button" onClick={showLogout}>
          登出
        </button>
      </div>
    </header>
  );
}