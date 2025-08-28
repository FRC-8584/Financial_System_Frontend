import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 側邊欄分頁
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

  // 狀態提示
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleError = (err, msg) => {
    console.error(err);
    setStatus(`${msg}：${err.message}`);
    setIsSuccess(false);
  };

  // 初始化載入
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      loadAccountingData("income");
      loadBudgetData("team");
      loadUsers();
    }
  }, [token, navigate]);

  // 模擬 API 載入資料
  const loadAccountingData = (tab) => {
    setSubTab(tab);
    switch (tab) {
      case "income":
        setIncome([
          { id: 1, title: "贊助收入", amount: 5000, note: "贊助商A" },
          { id: 2, title: "門票收入", amount: 12000, note: "活動門票" },
        ]);
        break;
      case "expense":
        setExpense([
          { id: 1, title: "場地租金", amount: 8000, note: "會議室租金" },
          { id: 2, title: "餐飲支出", amount: 3000, note: "午餐" },
        ]);
        break;
      case "records":
        setRecords([
          { id: 1, title: "收入 - 贊助", amount: 5000 },
          { id: 2, title: "支出 - 餐飲", amount: 3000 },
        ]);
        break;
      default:
        break;
    }
  };

  const loadBudgetData = (sub) => {
    setBudgetSubTab(sub);
    switch (sub) {
      case "team":
        setBudgetData([
          { id: 1, item: "行銷", amount: 15000 },
          { id: 2, item: "研發", amount: 25000 },
        ]);
        break;
      case "group":
        setBudgetData([
          { id: 1, item: "A組", amount: 10000 },
          { id: 2, item: "B組", amount: 8000 },
        ]);
        break;
      case "activity":
        setBudgetData([
          { id: 1, item: "尾牙", amount: 20000 },
          { id: 2, item: "團建", amount: 12000 },
        ]);
        break;
      default:
        break;
    }
  };

  const loadUsers = () => {
    setUsers([
      { id: 1, name: "Alice", role: "manager" },
      { id: 2, name: "Bob", role: "staff" },
    ]);
  };

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

  // 刪除使用者
  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className="w-64 bg-teal-800 text-white p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">管理面板</h2>
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab("accounting")}
            className="text-left hover:bg-teal-700 px-3 py-2 rounded"
          >
            記帳管理
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className="text-left hover:bg-teal-700 px-3 py-2 rounded"
          >
            預算規劃
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className="text-left hover:bg-teal-700 px-3 py-2 rounded"
          >
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
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">名稱</th>
                  <th className="border px-2 py-1">角色</th>
                  <th className="border px-2 py-1">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="border px-2 py-1">{u.id}</td>
                    <td className="border px-2 py-1">{u.name}</td>
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
  );
}

export default AdminDashboard;
