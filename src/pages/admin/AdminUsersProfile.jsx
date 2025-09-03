import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import PageLayout from "../../components/layout/pages/PageLayout.jsx";
import { DataTable } from "../../components/DataTable.jsx";
import { fetchAllUsersProfile } from "../../utils/handleUserData.js";
import { convertRoleName } from "../../utils/dataNameConverter.util.js";

function AdminUsersProfile() {
  const { token } = useOutletContext();
  const [status, setStatus] = useState("");

  const [usersProfile, setUsersProfile] = useState([]);

  const user_column = [
    { key: "name", label: "使用者名稱" },
    { key: "email", label: "電子郵件" },
    { key: "role", label: "權限", render: (rec) => convertRoleName(rec.role) },
    { key: "createdAt", label: "帳號建立時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
  ]

  useEffect(() => {
    fetchData();
  }, [token]);
  
  const fetchData = async () => {
    try {
      await fetchAllUsersProfile({ setUsersProfile, token });
      setStatus("");
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  return (
  <>
  <PageLayout title={"使用者資訊"}>
    <DataTable
      data={usersProfile}
      columns={user_column}
      emptyMessage="尚無紀錄"
    />
  </PageLayout>

  <div className="status">{status}</div>
  </>
  )
}

export default AdminUsersProfile;