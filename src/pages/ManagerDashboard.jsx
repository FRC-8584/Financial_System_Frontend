import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [note, setNote] = useState("");
  const [item, setItem] = useState("");
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/");
  //   } else {
  //     fetchRecords();
  //   }
  // }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/claims", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("資料載入失敗");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      setStatus("載入錯誤");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount), type, note, item }),
      });

      if (!res.ok) {
        const errText = await res.text();
        let errMsg = "無法上傳，請確認資料格式正確";
        try {
          const errJson = JSON.parse(errText);
          errMsg = errJson.message || errMsg;
        } catch {
          if (errText) errMsg = errText;
        }
        throw new Error(errMsg);
      }

      setStatus("新增成功！");
      setAmount("");
      setNote("");
      setItem("");
      fetchRecords();
    } catch (err) {
      setStatus(" 無法上傳" );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className="w-64 bg-teal-800 text-white p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">管理面板</h2>
        <nav className="flex flex-col space-y-2">
          <button className="text-left hover:bg-teal-700 px-3 py-2 rounded">
            記帳管理
          </button>
          <button className="text-left hover:bg-teal-700 px-3 py-2 rounded">
            報帳申請審核
          </button>
          <button className="text-left hover:bg-teal-700 px-3 py-2 rounded">
            使用者管理
          </button>
          <button
            className="text-left hover:bg-teal-700 px-3 py-2 rounded"
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
        <h1 className="text-4xl font-bold text-teal-600 mb-6">隊伍記帳</h1>

        {/* 表單 */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label className="block mb-1 font-medium text-gray-700">金額：</label>
            <input
              type="number"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">類型：</label>
            <select
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">收入</option>
              <option value="expense">支出</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">品項：</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">備註：</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition"
          >
            新增紀錄
          </button>
        </form>

        {/* 狀態訊息 */}
        {status && (
          <p
            className={`text-sm mt-4 font-medium ${
              status.includes("correct")
                ? "text-green-600 bg-green-50 border border-green-200 p-2 rounded"
                : "text-red-600 bg-red-50 border border-red-200 p-2 rounded"
            }`}
          >
            {status}
          </p>
        )}

        {/* 紀錄清單 */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800"> 流水帳紀錄</h2>
        {records.length === 0 ? (
          <p className="text-gray-500">目前沒有紀錄</p>
        ) : (
          <ul className="space-y-4 max-w-3xl">
            {records.map((r, i) => (
              <li
                key={i}
                className={`p-4 rounded-lg shadow-sm border-l-4 ${
                  r.type === "income"
                    ? "bg-green-50 border-green-400"
                    : "bg-red-50 border-red-400"
                }`}
              >
                <div className="text-lg font-semibold">
                  金額：<span className="text-gray-800">{r.amount}</span>
                </div>
                <div className="text-gray-700">品項：{r.item || "未填"}</div>
                <div className="text-gray-700">備註：{r.note}</div>
                <div className="text-gray-500 text-sm">
                  時間：{new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="text-sm">
                  類型：
                  <span
                    className={r.type === "income" ? "text-green-600" : "text-red-600"}
                  >
                    {r.type === "income" ? "收入" : "支出"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default ManagerDashboard;
