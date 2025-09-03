import React from "react";
import DashboardSelector from "./DashboardSelector.jsx";
import { Button } from "../../Button.jsx";
import "./styles/header.css";

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
        <Button 
          text={user.name} btnType={"gray-type"}
          onClickAction={() => {}}
        />
        <Button 
          text={"登出"} btnType={"red-type"}
          onClickAction={showLogout}
        />
      </div>
    </header>
  );
}