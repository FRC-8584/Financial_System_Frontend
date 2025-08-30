import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout.jsx";

const links = [
  { label: "團隊請款紀錄", href: "requestRecord" },
  { label: "待審核款項", href: "pendingRequest" },
  { label: "處理中款項", href: "dealingRequest" },
];

function ManagerDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <Layout dashboardName="mamager-dashboard" links={links}>
      <Outlet context={{ token }} /> {/* Children routes */}
    </Layout>
  );
}

export default ManagerDashboard;