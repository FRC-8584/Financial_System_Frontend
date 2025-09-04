import React from "react";
import "./styles/header.css";

export default function Header({ dashboardTitleChildren, userActionChildren }) {
  return (
    <header className="header">
      <div className="dashboard-title">
        <h1>FRC8584 財務系統</h1>
        {dashboardTitleChildren}
      </div>

      <div className="user-actions">
        {userActionChildren}
      </div>
    </header>
  );
}