import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs";
import { DataTable } from "../../components/DataTable";
import { fetchBudgets, fetchReimbursements } from "../../utils/fetchRequestData.util";
import { handleSettle } from "../../utils/handleRequestStatus.util";

// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';

const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function ManagerDealingRequest() {
  const { token } = useOutletContext();
  const [activeTab, setActiveTab] = useState(TAB_REIMBURSEMENT);
  const [status, setStatus] = useState("");

  // Data of request payments
  const [reimbursements, setReimbursements] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetchData();
  }, [token]);
  
  const fetchData = async () => {
    try {
      await fetchBudgets({ setBudgets, token }, false, "?status=approved");
      await fetchReimbursements({ setReimbursements, token }, false, "?status=approved");
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

  {/* Tab of my dealing reimbursement */}
  {activeTab === TAB_REIMBURSEMENT && (
  <div>
    <h1 className="text-3xl font-bold mb-6">處理中報帳款項</h1>
    <DataTable
      data={reimbursements}
      columns={[
        { key: "title", label: "品項" },
        { key: "amount", label: "金額" },
        { key: "description", label: "備註" },
        { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
        { key: "receipt_url", label: "單據", render: (rec) => (
          <a href={rec.receipt_url} target="_blank" rel="noreferrer" className="text-black underline">
            查看
          </a>
        ) },
        { key: "", label: "", render: (rec) => (
          <button className="px-4 py-2 mx-3 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              handleSettle(REIMBURSEMENT_API_ROUTE, rec.id, token);
              fetchData();
            }}
          >
            標記結清
          </button>
        ) },
      ]}
      emptyMessage="尚無紀錄"
    />
  </div>
  )}

  {/* Tab of my dealing budget */}
  {activeTab === TAB_BUDGET && (
  <div>
    <h1 className="text-3xl font-bold mb-6">處理中申請經費款項</h1>
      <DataTable
      data={budgets}
      columns={[
        { key: "title", label: "品項" },
        { key: "amount", label: "金額" },
        { key: "description", label: "備註" },
        { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
        { key: "", label: "", render: (rec) => (
          <button className="px-4 py-2 mx-3 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              handleSettle(BUDGET_API_ROUTE, rec.id, token);
              fetchData();
            }}
          >
            標記結清
          </button>
        ) },
      ]}
      emptyMessage="尚無紀錄"
    />
  </div>
  )}
  </>
  )
}

export default ManagerDealingRequest;