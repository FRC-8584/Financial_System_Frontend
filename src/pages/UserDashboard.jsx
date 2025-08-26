import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [page, setPage] = useState("apply"); // apply / records / budgets
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [status, setStatus] = useState("");

  const [records, setRecords] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // 初始化載入
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchRecords();
      fetchBudgets();
    }
  }, [token, navigate]);

  // 取得報帳紀錄
  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/my-records", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("載入紀錄失敗");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
      setStatus("載入紀錄錯誤：" + err.message);
    }
  };

  // 取得預算紀錄
  const fetchBudgets = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/budget/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("載入預算失敗");
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error(err);
      setStatus("載入預算錯誤：" + err.message);
    }
  };

  // 送出報帳申請
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receipt) {
      setStatus("請上傳單據圖片");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("amount", amount);
    formData.append("description", description);
    formData.append("receipt", receipt);

    try {
      const res = await fetch("http://localhost:3000/api/request", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("請款送出失敗");

      setStatus("報帳申請已送出！");
      setTitle("");
      setAmount("");
      setDescription("");
      setReceipt(null);
      await fetchRecords();
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">FRC8584 財務系統</h2>
        <nav className="flex flex-col space-y-2">
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${page === "apply" ? "bg-gray-800" : ""}`}
            onClick={() => setPage("apply")}
          >
            報帳申請
          </button>
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${page === "records" ? "bg-gray-800" : ""}`}
            onClick={() => setPage("records")}
          >
            我的紀錄
          </button>
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${page === "budgets" ? "bg-gray-800" : ""}`}
            onClick={() => setPage("budgets")}
          >
            我的預算
          </button>
          <button
            className="text-left hover:bg-gray-800 px-3 py-2 rounded"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            登出
          </button>
        </nav>
      </aside>

      {/* 主內容 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* 報帳申請頁 */}
        {page === "apply" && (
          <>
            <h1 className="text-3xl font-bold mb-6">報帳申請</h1>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block mb-1 font-semibold">品項：</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">報帳金額：</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">備註：</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">單據上傳：</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => setReceipt(e.target.files[0])}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                送出報帳
              </button>
            </form>
            {status && <p className="mt-4 text-sm">{status}</p>}
          </>
        )}

        {/* 我的紀錄頁 */}
        {page === "records" && (
          <>
            <h1 className="text-3xl font-bold mb-6">我的紀錄</h1>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3">品項</th>
                  <th className="p-3">金額</th>
                  <th className="p-3">狀態</th>
                  <th className="p-3">申請時間</th>
                  <th className="p-3">單據</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((rec) => (
                    <tr key={rec.id} className="border-b">
                      <td className="p-3">{rec.title}</td>
                      <td className="p-3">{rec.amount}</td>
                      <td className="p-3">{rec.status}</td>
                      <td className="p-3">{new Date(rec.created_at).toLocaleString()}</td>
                      <td className="p-3">
                        <a href={rec.receipt_url} target="_blank" rel="noreferrer" className="text-black underline">
                          查看
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3" colSpan="5">尚無紀錄</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* 查看預算頁（不可編輯） */}
        {page === "budgets" && (
          <>
            <h1 className="text-3xl font-bold mb-6">我的預算</h1>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3">項目</th>
                  <th className="p-3">金額</th>
                  <th className="p-3">狀態</th>
                  <th className="p-3">申請時間</th>
                </tr>
              </thead>
              <tbody>
                {budgets.length > 0 ? (
                  budgets.map((b) => (
                    <tr key={b.id} className="border-b">
                      <td className="p-3">{b.title}</td>
                      <td className="p-3">{b.amount}</td>
                      <td className="p-3">{b.status}</td>
                      <td className="p-3">{new Date(b.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3" colSpan="4">尚無預算紀錄</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;
