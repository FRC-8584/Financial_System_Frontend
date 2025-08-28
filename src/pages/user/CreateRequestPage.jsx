import React, { useState, useEffect } from "react";
import { Tabs } from "../../components/Tabs";

// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';

const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

export function CreateRequestPage({ token }) {
  const [activeTab, setActiveTab] = useState(TAB_REIMBURSEMENT);

  // Reimbursement request form
  const [reimbursementTitle, setReimbursementTitle] = useState("");
  const [reimbursementAmount, setReimbursementAmount] = useState("");
  const [reimbursementDescription, setReimbursementDescription] = useState("");
  const [reimbursementReceipt, setReimbursementReceipt] = useState(null);

  // Budget request form
  const [budgetTitle, setBudgetTitle] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetDescription, setBudgetDescription] = useState("");

  // Status
  const [status, setStatus] = useState("");

  // Send reimbursement request
  const handleReimbursementSubmit = async (e) => {
    e.preventDefault();
    if (!reimbursementReceipt) {
      setStatus("請上傳單據圖片");
      return;
    }
    const formData = new FormData();
    formData.append("title", reimbursementTitle);
    formData.append("amount", reimbursementAmount);
    formData.append("description", reimbursementDescription);
    formData.append("receipt", reimbursementReceipt);

    try {
      const res = await fetch(REIMBURSEMENT_API_ROUTE + '/', {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("請款送出失敗");

      setStatus("款項已送出！");
      setReimbursementTitle("");
      setReimbursementAmount("");
      setReimbursementDescription("");
      setReimbursementReceipt(null);
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  // Send budget request
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(BUDGET_API_ROUTE + '/', {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}` ,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: budgetTitle,
          amount: budgetAmount,
          description: budgetDescription,
        }),
      });
      if (!res.ok) throw new Error("請款送出失敗");

      setStatus("款項已送出！");
      setBudgetTitle("");
      setBudgetAmount("");
      setBudgetDescription("");
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  return (
  <>
  {/* Tab button */}
  <Tabs
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    tabs={[
      { value: TAB_REIMBURSEMENT, label: "報帳" },
      { value: TAB_BUDGET, label: "申請經費" },
    ]}
  />

  {/* Tab of creating new reimbursement */}
  {activeTab === TAB_REIMBURSEMENT && (
  <div id="createReimbursement" class="tab-content active">
    <h1 className="text-3xl font-bold mb-6">新增報帳</h1>
    <form onSubmit={handleReimbursementSubmit} className="space-y-4" encType="multipart/form-data">
      <div>
        <label className="block mb-1 font-semibold">品項：</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={reimbursementTitle}
          onChange={(e) => setReimbursementTitle(e.target.value)}
          required
          />
      </div>
      <div>
        <label className="block mb-1 font-semibold">報帳金額：</label>
        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={reimbursementAmount}
          onChange={(e) => setReimbursementAmount(e.target.value)}
          required
          />
      </div>
      <div>
        <label className="block mb-1 font-semibold">備註：</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={reimbursementDescription}
          onChange={(e) => setReimbursementDescription(e.target.value)}
          />
      </div>
      <div>
        <label className="block mb-1 font-semibold">發票或證明上傳：</label>
        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setReimbursementReceipt(e.target.files[0])}
          required
          />
      </div>
      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
        送出款項
      </button>
    </form>
    {status && <p className="mt-4 text-sm">{status}</p>}
  </div>
  )}

  {/* Tab of creating new budget */}
  {activeTab === TAB_BUDGET && (
  <div id="createBudget" class="tab-content">
    <h1 className="text-3xl font-bold mb-6">新增申請經費</h1>
    <form onSubmit={handleBudgetSubmit} className="space-y-4" encType="multipart/form-data">
      <div>
        <label className="block mb-1 font-semibold">品項：</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={budgetTitle}
          onChange={(e) => setBudgetTitle(e.target.value)}
          required
          />
      </div>
      <div>
        <label className="block mb-1 font-semibold">申請金額：</label>
        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          required
          />
      </div>
      <div>
        <label className="block mb-1 font-semibold">備註：</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={budgetDescription}
          onChange={(e) => setBudgetDescription(e.target.value)}
          />
      </div>
      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
        送出款項
      </button>
    </form>
    {status && <p className="mt-4 text-sm">{status}</p>}
  </div>
  )}
  </>
  )
}