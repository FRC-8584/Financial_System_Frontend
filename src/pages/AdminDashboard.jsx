// 完整報帳系統前端 React 實作
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "/api/request";

function ReimbursementApp() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", description: "", receipt: null });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      fetchMyRequests();
    }
  }, []);

  const fetchMyRequests = async () => {
    const res = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setRequests(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("amount", form.amount);
    if (form.description) formData.append("description", form.description);
    if (form.receipt) formData.append("receipt", form.receipt);

    if (editId) {
      await axios.patch(`${API_URL}/${editId}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } else {
      await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    }

    setForm({ title: "", amount: "", description: "", receipt: null });
    setEditId(null);
    fetchMyRequests();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchMyRequests();
  };

  const startEdit = (item) => {
    setForm({ title: item.title, amount: item.amount, description: item.description || "", receipt: null });
    setEditId(item.id);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">報帳申請</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input type="text" placeholder="標題" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="border p-2 w-full" />
        <input type="number" placeholder="金額" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required className="border p-2 w-full" />
        <input type="text" placeholder="說明 (可選)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 w-full" />
        <input type="file" onChange={e => setForm({ ...form, receipt: e.target.files[0] })} className="w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editId ? "更新" : "新增"}</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">我的報帳紀錄</h2>
      <ul className="space-y-2">
        {requests.map((item) => (
          <li key={item.id} className="border p-4 rounded">
            <p><strong>{item.title}</strong> - ${item.amount}</p>
            <p>{item.description}</p>
            <p>Status: {item.status}</p>
            <div className="mt-2 space-x-2">
              {item.status === "pending" && (
                <>
                  <button onClick={() => startEdit(item)} className="px-2 py-1 bg-yellow-400">編輯</button>
                  <button onClick={() => handleDelete(item.id)} className="px-2 py-1 bg-red-500 text-white">刪除</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReimbursementApp;
