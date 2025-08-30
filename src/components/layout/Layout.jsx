import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import "../../styles/layout/layout.css";
import { LogoutConfirm } from "../LogoutConfirm.jsx";

export default function Layout({ dashboard, links, children }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  const currentPath = location.pathname.split('/')[1]; 

  if (!user || !user.role) {
    alert("請先登入");
    navigate("/");
    return;
  }

  if (!hasPermission(currentPath)) {
    const defaultDashboard = hasPermission("user-dashboard") ? "user-dashboard" : "";
    navigate(`/${defaultDashboard}`);
  } else {
    setActiveDashboard(currentPath);
  }
}, [location, navigate, user]);

  const hasPermission = (d) => {
    if (!user.role) return false;
    switch (d) {
      case "user-dashboard":
        return true;
      case "manager-dashboard":
        return user.role === "manager" || user.role === "admin";
      case "admin-dashboard":
        return user.role === "admin";
      default:
        return false;
    }
  };

  const handleDashboardChange = (selectedValue) => {
    navigate(`/${selectedValue}`);
  };

  return (
    <div className="layout">
      <Header
        user={user}
        activeDashboard={activeDashboard}
        onDashboardChange={handleDashboardChange}
        showLogout={() => setShowLogoutConfirm(true)}
      />

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