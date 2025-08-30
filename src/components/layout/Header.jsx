import React from "react";
import DashboardSelector from "./DashboardSelector.jsx";
import "../../styles/layout/header.css";

export default function Header({ user, activeDashboard, onDashboardChange, showLogout }) {
  return (
    <header className="header">
      <div className="dashboard-title">
        <h1>FRC8584 財務系統</h1>
        <DashboardSelector
          role={user.role}
          value={activeDashboard}
          onChange={onDashboardChange}
        />
      </div>

      <div className="user-actions">
        <div className="user-profile">{user.name}</div>
        <button className="logout-button" onClick={showLogout}>
          登出
        </button>
      </div>
    </header>
  );
}