import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/dashboard/DashboardLayout.jsx";

const links = [
  { label: "使用者資訊", href: "usersProfile" },
  { label: "註冊帳戶", href: "register" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <DashboardLayout links={links}>
      <Outlet context={{ token }} /> {/* Children routes */}
    </DashboardLayout>
  );
}

export default AdminDashboard;