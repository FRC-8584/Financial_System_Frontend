import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 分頁狀態
  const [activeTab, setActiveTab] = useState("reimbursement");

  // 報帳管理
  const [reimbursements, setReimbursements] = useState([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

  // 報帳申請審核
  const [claims, setClaims] = useState([]);

  // 使用者管理
  const [users, setUsers] = useState([]);

  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 統一錯誤處理
  const handleError = (err, msg) => {
    console.error(err);
    setStatus(`${msg}：${err.message}`);
    setIsSuccess(false);
  };

  // 初始化載入
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/");
  //   } else {
  //     loadTabData("reimbursement");
  //   }
  // }, [token, navigate]);

  // 根據分頁載入資料
  const loadTabData = async (tab) => {
    setActiveTab(tab);
    if (tab === "reimbursement") {
      await fetchReimbursements();
    } else if (tab === "claims") {
      await fetchClaims();
    } else if (tab === "users") {
      await fetchUsers();
    }
  };

  // API 載入報帳紀錄
  const fetchReimbursements = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reimbursement", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("資料載入失敗");
      setReimbursements(await res.json());
    } catch (err) {
      handleError(err, "載入錯誤");
    }
  };

  // API 載入報帳申請（其實就是報帳資料，只是 pending 狀態的）
  const fetchClaims = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reimbursement?status=pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("申請資料載入失敗");
      setClaims(await res.json());
    } catch (err) {
      handleError(err, "載入錯誤");
    }
  };

  // API 載入使用者
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("使用者資料載入失敗");
      setUsers(await res.json());
    } catch (err) {
      handleError(err, "載入錯誤");
    }
  };

  // 新增報帳
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/reimbursement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount), title, description: note }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "無法上傳");
      }

      setStatus("新增成功！");
      setIsSuccess(true);
      setAmount("");
      setNote("");
      setTitle("");
      await fetchReimbursements();
    } catch (err) {
      handleError(err, "無法上傳");
    }
  };

  // 核准 / 拒絕報帳申請
  const handleReviewClaim = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reimbursement/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      });
      if (!res.ok) throw new Error("操作失敗");
      await fetchClaims();
    } catch (err) {
      handleError(err, "操作失敗");
    }
  };

  // 標記已結清
  const handleSettle = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reimbursement/${id}/settle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("結清失敗");
      await fetchReimbursements();
    } catch (err) {
      handleError(err, "結清失敗");
    }
  };

  // 匯出報帳 Excel
  const handleExport = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reimbursement/export", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("匯出失敗");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reimbursements.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      handleError(err, "匯出失敗");
    }
  };

  // 刪除使用者
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("刪除失敗");
      await fetchUsers();
    } catch (err) {
      handleError(err, "刪除失敗");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className="w-64 bg-teal-800 text-white p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">管理面板</h2>
        <nav className="flex flex-col space-y-2">
          <button onClick={() => loadTabData("reimbursement")} className="text-left hover:bg-teal-700 px-3 py-2 rounded">
            報帳管理
          </button>
          <button onClick={() => loadTabData("claims")} className="text-left hover:bg-teal-700 px-3 py-2 rounded">
            報帳申請審核
          </button>
          <button onClick={() => loadTabData("users")} className="text-left hover:bg-teal-700 px-3 py-2 rounded">
            使用者管理
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="text-left hover:bg-teal-700 px-3 py-2 rounded"
          >
            登出
          </button>
        </nav>
      </aside>

      {/* 主內容 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {status && (
          <p className={`text-sm mb-4 font-medium ${
            isSuccess
              ? "text-green-600 bg-green-50 border border-green-200 p-2 rounded"
              : "text-red-600 bg-red-50 border-red-200 p-2 rounded"
          }`}>
            {status}
          </p>
        )}

        {/* 報帳管理 */}
        {activeTab === "reimbursement" && (
          <>
            <h1 className="text-4xl font-bold text-teal-600 mb-6">報帳管理</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div>
                <label className="block mb-1 font-medium text-gray-700">金額：</label>
                <input type="number" className="w-full border border-gray-300 px-4 py-2 rounded" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">標題：</label>
                <input type="text" className="w-full border border-gray-300 px-4 py-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">備註：</label>
                <input type="text" className="w-full border border-gray-300 px-4 py-2 rounded" value={note} onChange={(e) => setNote(e.target.value)} required />
              </div>
              <button type="submit" className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600">新增報帳</button>
            </form>

            <div className="flex justify-between items-center mt-10 mb-4">
              <h2 className="text-2xl font-semibold">報帳紀錄</h2>
              <button onClick={handleExport} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">匯出 Excel</button>
            </div>

            {reimbursements.length === 0 ? (
              <p className="text-gray-500">目前沒有紀錄</p>
            ) : (
              <ul className="space-y-4 max-w-3xl">
                {reimbursements.map((r) => (
                  <li key={r.id} className={`p-4 rounded-lg border-l-4 ${r.status === "approved" ? "bg-green-50 border-green-400" : r.status === "rejected" ? "bg-red-50 border-red-400" : "bg-yellow-50 border-yellow-400"}`}>
                    <div className="text-lg font-semibold">金額：{r.amount}</div>
                    <div>標題：{r.title || "未填"}</div>
                    <div>備註：{r.description}</div>
                    <div>狀態：{r.status}</div>
                    <div className="text-sm text-gray-500">時間：{new Date(r.createdAt).toLocaleString()}</div>
                    {r.status === "approved" && !r.settled && (
                      <button onClick={() => handleSettle(r.id)} className="mt-2 bg-purple-500 text-white px-3 py-1 rounded">標記已結清</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* 報帳申請審核 */}
        {activeTab === "claims" && (
          <>
            <h1 className="text-4xl font-bold text-teal-600 mb-6">報帳申請審核</h1>
            {claims.length === 0 ? (
              <p className="text-gray-500">目前沒有申請</p>
            ) : (
              <ul className="space-y-4 max-w-3xl">
                {claims.map((c) => (
                  <li key={c.id} className="p-4 rounded-lg bg-white shadow border">
                    <div>申請人：{c.user?.name || "未知"}</div>
                    <div>金額：{c.amount}</div>
                    <div>說明：{c.description}</div>
                    <div className="space-x-2 mt-2">
                      <button onClick={() => handleReviewClaim(c.id, "approve")} className="bg-green-500 text-white px-3 py-1 rounded">核准</button>
                      <button onClick={() => handleReviewClaim(c.id, "reject")} className="bg-red-500 text-white px-3 py-1 rounded">拒絕</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* 使用者管理 */}
        {activeTab === "users" && (
          <>
            <h1 className="text-4xl font-bold text-teal-600 mb-6">使用者管理</h1>
            {users.length === 0 ? (
              <p className="text-gray-500">目前沒有使用者</p>
            ) : (
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">名稱</th>
                    <th className="p-2 border">角色</th>
                    <th className="p-2 border">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="p-2 border">{u.id}</td>
                      <td className="p-2 border">{u.name}</td>
                      <td className="p-2 border">{u.role}</td>
                      <td className="p-2 border">
                        <button onClick={() => handleDeleteUser(u.id)} className="bg-red-500 text-white px-3 py-1 rounded">刪除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default ManagerDashboard;
