import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 預設 active tab
  const [activeTab, setActiveTab] = useState("accounting");

  // 記帳管理狀態
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [subTab, setSubTab] = useState("income");

  // 預算規劃狀態
  const [budgetData, setBudgetData] = useState([]);
  const [budgetSubTab, setBudgetSubTab] = useState("team");
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");

  // 使用者管理
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "member" });

  // 狀態提示
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleError = (err, msg) => {
    console.error(err);
    setStatus(`${msg}：${err.message}`);
    setIsSuccess(false);
  };

  // ⬇️ Header 切換 Dashboard
  const handleChangeDashboard = (e) => {
    const value = e.target.value;
    if (value === "admin") navigate("/admin-dashboard");
    if (value === "manager") navigate("/manager-dashboard");
    if (value === "user") navigate("/user-dashboard");
  };

  // 模擬 API 載入資料
  const loadAccountingData = (tab) => {
    setSubTab(tab);
    switch (tab) {
      case "income":
        setIncome([{ id: 1, title: "y", amount: 5000, note: "贊助商A" }]);
        break;
      case "expense":
        setExpense([{ id: 1, title: "場地租金", amount: 8000, note: "會議室租金" }]);
        break;
      case "records":
        setRecords([{ id: 1, title: "收入 - 贊助", amount: 5000 }]);
        break;
      default:
        break;
    }
  };

  const loadBudgetData = (sub) => {
    setBudgetSubTab(sub);
    switch (sub) {
      case "team":
        setBudgetData([{ id: 1, item: "行銷", amount: 15000 }]);
        break;
      case "group":
        setBudgetData([{ id: 1, item: "A組", amount: 10000 }]);
        break;
      case "activity":
        setBudgetData([{ id: 1, item: "尾牙", amount: 20000 }]);
        break;
      default:
        break;
    }
  };

  // 使用者管理：載入後端資料
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetch("/api/user/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, [token, navigate]);

  // 記帳管理新增
  const handleAddAccounting = (e) => {
    e.preventDefault();
    const newRecord = { id: Date.now(), title, amount: Number(amount), note };
    if (subTab === "income") setIncome([...income, newRecord]);
    else if (subTab === "expense") setExpense([...expense, newRecord]);
    setTitle("");
    setAmount("");
    setNote("");
    setStatus("新增成功！");
    setIsSuccess(true);
  };

  // 預算管理新增
  const handleAddBudgetItem = () => {
    if (!newItemName || !newItemAmount) return;
    setBudgetData([...budgetData, { id: Date.now(), item: newItemName, amount: Number(newItemAmount) }]);
    setNewItemName("");
    setNewItemAmount("");
    setStatus("新增成功！");
    setIsSuccess(true);
  };

  // 刪除預算項目
  const handleDeleteBudgetItem = (id) => {
    setBudgetData(budgetData.filter((b) => b.id !== id));
  };

  // 使用者管理新增
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      setStatus("請輸入完整使用者資訊！");
      setIsSuccess(false);
      return;
    }
    fetch("/api/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers([...users, data]);
        setNewUser({ name: "", email: "", role: "member" });
        setStatus("新增使用者成功！");
        setIsSuccess(true);
      })
      .catch((err) => handleError(err, "新增使用者失敗"));
  };

  // 使用者管理刪除
  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    setStatus("已從前端移除（API 未提供刪除）");
    setIsSuccess(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* ⬆️ HEADER */}
      <div className="flex justify-between items-center bg-gray-800 text-white p-4">
        <h1 className="font-bold">Financial System</h1>
        <select
          onChange={handleChangeDashboard}
          defaultValue="admin"
          className="text-black p-1 rounded"
        >
          <option value="admin">Admin Dashboard</option>
          <option value="manager">Manager Dashboard</option>
          <option value="user">User Dashboard</option>
        </select>
      </div>

      <div className="flex flex-1">
        {/* 側邊欄 */}
        <aside className="w-64 bg-teal-800 text-white p-6 flex flex-col space-y-4">
          <h2 className="text-2xl font-bold mb-6">管理面板</h2>
          <nav className="flex flex-col space-y-2">
            <button onClick={() => setActiveTab("accounting")} className="text-left hover:bg-teal-700 px-3 py-2 rounded">記帳管理</button>
            <button onClick={() => setActiveTab("budget")} className="text-left hover:bg-teal-700 px-3 py-2 rounded">預算規劃</button>
            <button onClick={() => setActiveTab("users")} className="text-left hover:bg-teal-700 px-3 py-2 rounded">使用者管理</button>
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
            <p
              className={`text-sm mb-4 font-medium ${
                isSuccess
                  ? "text-green-600 bg-green-50 border border-green-200 p-2 rounded"
                  : "text-red-600 bg-red-50 border border-red-200 p-2 rounded"
              }`}
            >
              {status}
            </p>
          )}

        {/* 記帳管理 */}
        {activeTab === "accounting" && (
          <div>
            <h1 className="text-4xl font-bold text-teal-600 mb-6">記帳管理</h1>
            {/* 子分頁 */}
            <div className="flex gap-4 mb-4">
              <button onClick={() => loadAccountingData("income")} className={`px-3 py-1 rounded ${subTab === "income" ? "bg-green-600 text-white" : "bg-gray-200"}`}>收入</button>
              <button onClick={() => loadAccountingData("expense")} className={`px-3 py-1 rounded ${subTab === "expense" ? "bg-green-600 text-white" : "bg-gray-200"}`}>支出</button>
              <button onClick={() => loadAccountingData("records")} className={`px-3 py-1 rounded ${subTab === "records" ? "bg-green-600 text-white" : "bg-gray-200"}`}>流水帳清單</button>
            </div>
            {/* 表單新增 */}
            {(subTab === "income" || subTab === "expense") && (
              <form onSubmit={handleAddAccounting} className="space-y-4 mb-6 max-w-2xl">
                <div>
                  <label>標題：</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="border px-2 py-1 rounded w-full"/>
                </div>
                <div>
                  <label>金額：</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="border px-2 py-1 rounded w-full"/>
                </div>
                <div>
                  <label>備註：</label>
                  <input value={note} onChange={(e) => setNote(e.target.value)} className="border px-2 py-1 rounded w-full"/>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">新增</button>
              </form>
            )}
            {/* 表格 */}
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">標題/項目</th>
                  <th className="border px-2 py-1">金額</th>
                  <th className="border px-2 py-1">備註</th>
                  <th className="border px-2 py-1">操作</th>
                </tr>
              </thead>
              <tbody>
                {(subTab === "income" ? income : subTab === "expense" ? expense : records).map((r) => (
                  <tr key={r.id}>
                    <td className="border px-2 py-1">{r.title || r.item}</td>
                    <td className="border px-2 py-1">{r.amount}</td>
                    <td className="border px-2 py-1">{r.note || "-"}</td>
                    <td className="border px-2 py-1">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">編輯</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded">刪除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 預算規劃 */}
        {activeTab === "budget" && (
          <div>
            <h1 className="text-4xl font-bold text-teal-600 mb-6">預算規劃</h1>
            <div className="flex gap-4 mb-4">
              <button onClick={() => loadBudgetData("team")} className={`px-3 py-1 rounded ${budgetSubTab === "team" ? "bg-purple-600 text-white" : "bg-gray-200"}`}>團隊預算</button>
              <button onClick={() => loadBudgetData("group")} className={`px-3 py-1 rounded ${budgetSubTab === "group" ? "bg-purple-600 text-white" : "bg-gray-200"}`}>各組預算</button>
              <button onClick={() => loadBudgetData("activity")} className={`px-3 py-1 rounded ${budgetSubTab === "activity" ? "bg-purple-600 text-white" : "bg-gray-200"}`}>活動預算</button>
            </div>
            {/* 新增項目 */}
            <div className="flex gap-2 mb-4 max-w-lg">
              <input placeholder="項目名稱" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="border px-2 py-1 rounded w-1/2"/>
              <input placeholder="金額" type="number" value={newItemAmount} onChange={(e) => setNewItemAmount(e.target.value)} className="border px-2 py-1 rounded w-1/2"/>
              <button onClick={handleAddBudgetItem} className="bg-blue-500 text-white px-4 py-1 rounded">新增</button>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">項目</th>
                  <th className="border px-2 py-1">金額</th>
                  <th className="border px-2 py-1">操作</th>
                </tr>
              </thead>
              <tbody>
                {budgetData.map((b) => (
                  <tr key={b.id}>
                    <td className="border px-2 py-1">{b.item}</td>
                    <td className="border px-2 py-1">{b.amount}</td>
                    <td className="border px-2 py-1">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">編輯</button>
                      <button onClick={() => handleDeleteBudgetItem(b.id)} className="bg-red-500 text-white px-2 py-1 rounded">刪除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 使用者管理 */}
        {activeTab === "users" && (
          <div>
            <h1 className="text-4xl font-bold text-teal-600 mb-6">使用者管理</h1>

            {/* 新增使用者表單 */}
            <div className="flex gap-2 mb-4 max-w-lg">
              <input placeholder="姓名" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="border px-2 py-1 rounded w-1/3"/>
              <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border px-2 py-1 rounded w-1/3"/>
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border px-2 py-1 rounded w-1/3">
                <option value="member">成員</option>
                <option value="manager">管理員</option>
              </select>
              <button onClick={handleAddUser} className="bg-blue-500 text-white px-4 py-1 rounded">新增</button>
            </div>

            {/* 使用者列表 */}
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">姓名</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">角色</th>
                  <th className="border px-2 py-1">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="border px-2 py-1">{u.id}</td>
                    <td className="border px-2 py-1">{u.name}</td>
                    <td className="border px-2 py-1">{u.email || "-"}</td>
                    <td className="border px-2 py-1">{u.role}</td>
                    <td className="border px-2 py-1">
                      <button onClick={() => handleDeleteUser(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">刪除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


