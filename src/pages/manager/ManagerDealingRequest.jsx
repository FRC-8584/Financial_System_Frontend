import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs.jsx";
import PageLayout from "../../components/layout/pages/PageLayout.jsx"
import { DataTable } from "../../components/DataTable.jsx";
import { fetchBudgets, fetchReimbursements } from "../../utils/fetchRequestData.util.js";
import { handleSettle } from "../../utils/handleRequestStatus.util.js";
import { fetchReimbursementRequest } from "../../utils/exportExcel.util.js";
import "../../styles/pages/managerDealingRequest.css";

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

  const reimbursement_column = [
    { key: "user", label: "報帳人", render: (rec) => rec.user.name },
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
    { key: "receipt_url", label: "收據或發票證明", render: (rec) => (
      <a href={rec.receipt_url} target="_blank" rel="noreferrer" className="text-black underline">
        查看
      </a>
    ) },
    { key: "", label: "", render: (rec) => (
      <button className="settle-button"
        onClick={() => handleSettleAndRemove(REIMBURSEMENT_API_ROUTE, rec.id)}
      >
        標記結清
      </button>
    ) }
  ]

  const budget_column = [
    { key: "user", label: "報帳人", render: (rec) => rec.user.name },
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
    { key: "", label: "", render: (rec) => (
      <button className="settle-button"
        onClick={() => handleSettleAndRemove(BUDGET_API_ROUTE, rec.id)}
      >
        標記結清
      </button>
    ) }
  ]

  const fetchData = useCallback(async () => {
    try {
      await fetchBudgets({ setBudgets, token }, false, "?status=approved");
      await fetchReimbursements({ setReimbursements, token }, false, "?status=approved");
      setStatus("");
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  }, [token]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSettleAndRemove = async (apiRoute, id) => {
    try {
      await handleSettle(apiRoute, id, token);
      if (apiRoute === REIMBURSEMENT_API_ROUTE) {
        setReimbursements(prev => prev.filter(item => item.id !== id));
      } else if (apiRoute === BUDGET_API_ROUTE) {
        setBudgets(prev => prev.filter(item => item.id !== id));
      }
      setStatus("結清成功！");
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setStatus("正在生成請款單...");
      await fetchReimbursementRequest({ token });
      setStatus("請款單已成功下載！");
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  }

  return (
  <>
  <Tabs
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    tabs={[
      { value: TAB_REIMBURSEMENT, label: "報帳" },
      { value: TAB_BUDGET, label: "申請經費" },
    ]}
  />

  {activeTab === TAB_REIMBURSEMENT && (
  <PageLayout title={"處理中報帳款項"}>
    <DataTable
      data={reimbursements}
      columns={reimbursement_column}
      emptyMessage="尚無紀錄"
    />
    {reimbursements.length > 0 && (
    <div>
      <button 
        className="export-button"
        onClick={handleDownloadExcel}
      >
        輸出請款單
      </button>
    </div>
    )}
  </PageLayout>
  )}

  {activeTab === TAB_BUDGET && (
  <PageLayout title={"處理中申請經費款項"}>
    <DataTable
      data={budgets}
      columns={budget_column}
      emptyMessage="尚無紀錄"
    />
  </PageLayout>
  )}

  <div className="status">{status}</div>
  </>
  );
}

export default ManagerDealingRequest;