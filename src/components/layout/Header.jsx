import React from "react";
import "../../styles/layout.css";

export default function Header({ dashboardName, showLogout }) {
  return (
    <header className="header">
      <h1>FRC8584 財務系統</h1>
      <div class="user-actions">
        <div className="user-profile">關於我...</div>
        <button className="logout-button" onClick={showLogout}>
          登出
        </button>
      </div>
      
    </header>
  );
}