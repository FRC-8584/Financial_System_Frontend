import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/layout.css";

export default function Header({ dashboardName, showLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDashboard, setActiveDashboard] = useState("");

  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    setActiveDashboard(currentPath || 'user-dashboard'); 
  }, [location]);

  const handleDashboardChange = (e) => {
    const selectedValue = e.target.value;
    setActiveDashboard(selectedValue);
    navigate(`/${selectedValue}`);
  };

  return (
    <header className="header">
      <div className="dashboard-title">
        <h1>FRC8584 財務系統</h1>
        <select
          className="dashboard-selector"
          value={activeDashboard}
          onChange={handleDashboardChange}
        >
          <option value="user-dashboard">用戶端</option>
          <option value="manager-dashboard">財務端</option>
          <option value="admin-dashboard">管理端</option>
        </select>
      </div>

      <div className="user-actions">
        <div className="user-profile">關於我...</div>
        <button className="logout-button" onClick={showLogout}>
          登出
        </button>
      </div>
    </header>
  );
}