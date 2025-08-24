import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("請款送出失敗");

      setStatus("報帳申請已送出！");
      setTitle("");
      setAmount("");
      setDescription("");
      setReceipt(null);
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className="w-64 bg-purple-800 text-white p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">FRC8584財務系統</h2>
        <nav className="flex flex-col space-y-2">
          <button className="text-left hover:bg-purple-700 px-3 py-2 rounded">
            報帳申請
          </button>
          <button className="text-left hover:bg-purple-700 px-3 py-2 rounded">
             我的紀錄
          </button>
          <button
            className="text-left hover:bg-purple-700 px-3 py-2 rounded"
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
        <h1 className="text-3xl font-bold mb-6"> 報帳申請</h1>
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
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            送出報帳
          </button>
        </form>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </main>
    </div>
  );
}

export default UserDashboard;
