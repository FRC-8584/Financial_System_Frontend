import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import UserProfile from "./UserProfile.jsx";
import DashboardSelector from "./DashboardSelector.jsx";
import { ConfirmDialog } from "../../ConfirmDialog.jsx";
import { Button } from "../../Button.jsx";
import { useCloseOnOutsideOrRoute } from "../../../hooks/useCloseOnOutsideOrRoute.js";
import "./styles/layout.css";

export default function DashboardLayout({ links, children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const [activeDashboard, setActiveDashboard] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showDashboardSelector, setShowDashboardSelector] = useState(false);

  const profileRef = useCloseOnOutsideOrRoute(showUserProfile, setShowUserProfile);
  const logoutRef = useCloseOnOutsideOrRoute(showLogoutConfirm, setShowLogoutConfirm);
  const selectorRef = useCloseOnOutsideOrRoute(showDashboardSelector, setShowDashboardSelector);

  useEffect(() => {
    setShowUserProfile(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowUserProfile(false);
      }
    }

    if (showUserProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserProfile]);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
  <div className="layout">
    <Header
      dashboardTitleChildren={
      <div ref={selectorRef}>
        <DashboardSelector
          role={user.role}
          value={activeDashboard}
          onChange={handleDashboardChange}
          open={showDashboardSelector}
          setOpen={setShowDashboardSelector}
        />
      </div>
      }
      userActionChildren={
      <>
        <div ref={profileRef}>
          <Button
            text={user.name}
            btnType={"gray-type"}
            onClickAction={() => setShowUserProfile((prev) => !prev)}
          />
          
        </div>
        <div ref={logoutRef}>
          <Button
            text={"登出"}
            btnType={"red-type"}
            onClickAction={() => setShowLogoutConfirm(true)}
          />
        </div>
      </>
      }
    />
    <div className="layout-body">
      <Sidebar links={links} />
      <main className="content-body">{children}</main>
    </div>
    {showUserProfile && 
    <div ref={profileRef}>
      <UserProfile user={user} />
    </div>
    }

    {showLogoutConfirm && (
    <div ref={logoutRef}>
      <ConfirmDialog
        message="確定要登出嗎？"
        onConfirm={handleLogout}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </div>
    )}
  </div>
  );
}