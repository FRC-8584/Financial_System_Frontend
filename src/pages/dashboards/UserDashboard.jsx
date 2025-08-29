import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout.jsx";

const links = [
  { label: "我的請款紀錄", href: "requestRecord" },
  { label: "新增請款", href: "createRequest" },
  { label: "審核中款項", href: "pendingRequest" },
  { label: "處理中款項", href: "dealingRequest" },
];

function UserDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <Layout dashboardName="用戶端" links={links}>
      <Outlet context={{ token }} /> {/* Children routes */}
    </Layout>
  );
}

export default UserDashboard;