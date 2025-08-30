import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { DataTable } from "../../components/DataTable.jsx";
import { fetchAllUsersProfile } from "../../utils/userAPI.js";
import { convertRoleName } from "../../utils/dataNameConverter.util.js";

function AdminUsersProfile() {
  const { token } = useOutletContext();
  const [status, setStatus] = useState("");

  const [usersProfile, setUsersProfile] = useState([]);

  useEffect(() => {
    fetchData();
  }, [token]);
  
  const fetchData = async () => {
    try {
      await fetchAllUsersProfile({ setUsersProfile, token });
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  return (
  <>
  <div>
    <h1 className="text-3xl font-bold mb-6">使用者資訊</h1>
      <DataTable
      data={usersProfile}
      columns={[
        { key: "name", label: "使用者名稱" },
        { key: "email", label: "電子郵件" },
        { key: "role", label: "權限", render: (rec) => convertRoleName(rec.role) },
        { key: "createdAt", label: "帳號建立時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
      ]}
      emptyMessage="尚無紀錄"
    />
  </div>
  </>
  )
}

export default AdminUsersProfile;