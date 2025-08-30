import React from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "./ConfirmDialog.jsx";

export function LogoutConfirm({ setShowLogoutConfirm }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <ConfirmDialog
      message="確定要登出嗎？"
      onConfirm={handleLogout}
      onClose={() => setShowLogoutConfirm(false)}
    />
  );
}