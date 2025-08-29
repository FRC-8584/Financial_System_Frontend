import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  createUser,
  deleteUser,
} from "@/api/user";
import {
  getAllBudgets,
  createBudget,
  deleteBudget,
} from "@/api/budget";
import {
  getAllReimbursements,
  deleteReimbursement,
} from "@/api/reimbursement";
import {
  getAllDisbursements,
} from "@/api/disbursement";

export default function AdminDashboard({ token }) {
  const [activeTab, setActiveTab] = useState("users");

  // Users
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", role: "" });

  // Budgets
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ name: "", amount: 0 });

  // Reimbursements
  const [reimbursements, setReimbursements] = useState([]);

  // Disbursements
  const [disbursements, setDisbursements] = useState([]);

  /** ----------------------------
   * Fetch data on component mount
   * ---------------------------- */
  useEffect(() => {
    if (!token) return;
    fetchUsers();
    fetchBudgets();
    fetchReimbursements();
    fetchDisbursements();
  }, [token]);

  /** ----------------------------
   * Users
   * ---------------------------- */
  const fetchUsers = () => {
    getAllUsers(token)
      .then(setUsers)
      .catch((err) => console.error("取得用戶失敗:", err.message));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    createUser(newUser, token)
      .then(() => {
        fetchUsers();
        setNewUser({ name: "", role: "" });
      })
      .catch((err) => console.error("新增用戶失敗:", err.message));
  };

  const handleDeleteUser = (id) => {
    deleteUser(id, token)
      .then(fetchUsers)
      .catch((err) => console.error("刪除用戶失敗:", err.message));
  };

  /** ----------------------------
   * Budgets
   * ---------------------------- */
  const fetchBudgets = () => {
    getAllBudgets(token)
      .then(setBudgets)
      .catch((err) => console.error("取得預算失敗:", err.message));
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    createBudget(newBudget, token)
      .then(() => {
        fetchBudgets();
        setNewBudget({ name: "", amount: 0 });
      })
      .catch((err) => console.error("新增預算失敗:", err.message));
  };

  const handleDeleteBudget = (id) => {
    deleteBudget(id, token)
      .then(fetchBudgets)
      .catch((err) => console.error("刪除預算失敗:", err.message));
  };

  /** ----------------------------
   * Reimbursements
   * ---------------------------- */
  const fetchReimbursements = () => {
    getAllReimbursements(token)
      .then(setReimbursements)
      .catch((err) => console.error("取得報帳失敗:", err.message));
  };

  const handleDeleteReimbursement = (id) => {
    deleteReimbursement(id, token)
      .then(fetchReimbursements)
      .catch((err) => console.error("刪除報帳失敗:", err.message));
  };

  /** ----------------------------
   * Disbursements
   * ---------------------------- */
  const fetchDisbursements = () => {
    getAllDisbursements(token)
      .then(setDisbursements)
      .catch((err) => console.error("取得撥款失敗:", err.message));
  };

  /** ----------------------------
   * UI Render
   * ---------------------------- */
  const renderUsers = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">使用者管理</h2>
      <form className="flex gap-2 mb-4" onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="使用者名稱"
          className="border p-2 flex-1"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="角色"
          className="border p-2 flex-1"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          新增
        </button>
      </form>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{user.name} - {user.role}</span>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="text-red-500"
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderBudgets = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">預算規劃</h2>
      <form className="flex gap-2 mb-4" onSubmit={handleAddBudget}>
        <input
          type="text"
          placeholder="預算名稱"
          className="border p-2 flex-1"
          value={newBudget.name}
          onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="金額"
          className="border p-2 flex-1"
          value={newBudget.amount}
          onChange={(e) => setNewBudget({ ...newBudget, amount: +e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          新增
        </button>
      </form>
      <ul>
        {budgets.map((budget) => (
          <li
            key={budget.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{budget.name} - ${budget.amount}</span>
            <button
              onClick={() => handleDeleteBudget(budget.id)}
              className="text-red-500"
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderReimbursements = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">報帳紀錄</h2>
      <ul>
        {reimbursements.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{item.title} - ${item.amount}</span>
            <button
              onClick={() => handleDeleteReimbursement(item.id)}
              className="text-red-500"
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderDisbursements = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">撥款紀錄</h2>
      <ul>
        {disbursements.map((item) => (
          <li key={item.id} className="border-b py-2">
            {item.title} - ${item.amount}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("users")}
        >
          使用者管理
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "budgets" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("budgets")}
        >
          預算規劃
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "reimbursements" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("reimbursements")}
        >
          報帳紀錄
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "disbursements" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("disbursements")}
        >
          撥款紀錄
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {activeTab === "users" && renderUsers()}
        {activeTab === "budgets" && renderBudgets()}
        {activeTab === "reimbursements" && renderReimbursements()}
        {activeTab === "disbursements" && renderDisbursements()}
      </div>
    </div>
  );
}

