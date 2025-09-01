import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs.jsx";
import PageLayout from "../../components/layout/pages/PageLayout.jsx"
import { DataTable } from "../../components/DataTable.jsx";
import { fetchBudgets, fetchReimbursements } from "../../utils/fetchRequestData.util.js";
import { handleVerify } from "../../utils/handleRequestStatus.util.js";
import "../../styles/pages/managerPendingRequest.css";

// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';

const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function ManagerPendingRequest() {
  const { token } = useOutletContext();
  const [activeTab, setActiveTab] = useState(TAB_REIMBURSEMENT);
  const [status, setStatus] = useState("");

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
      <>
      <button
        className="action-button approve-button"
        onClick={() => handleRequestAction(rec, 'approved')}
      >
        審核通過
      </button>
      <button
        className="action-button reject-button"
        onClick={() => handleRequestAction(rec, 'rejected')}
      >
        審核不通過
      </button>
      </>
    ) }
  ]

  const budget_column = [
    { key: "user", label: "報帳人", render: (rec) => rec.user.name },
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
    { key: "", label: "", render: (rec) => (
      <>
      <button
        className="action-button approve-button"
        onClick={() => handleRequestAction(rec, 'approved')}
      >
        審核通過
      </button>
      <button
        className="action-button reject-button"
        onClick={() => handleRequestAction(rec, 'rejected')}
      >
        審核不通過
      </button>
      </>
    ) }
  ]

  useEffect(() => {
    fetchData();
  }, [token]);
  
  const fetchData = async () => {
    try {
      await fetchBudgets({ setBudgets, token }, false, "?status=pending");
      await fetchReimbursements({ setReimbursements, token }, false, "?status=pending");
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  const handleRequestAction = async (rec, actionType) => {
    const isReimbursement = activeTab === TAB_REIMBURSEMENT;
    const apiRoute = isReimbursement ? REIMBURSEMENT_API_ROUTE : BUDGET_API_ROUTE;
    const setRequestData = isReimbursement ? setReimbursements : setBudgets;
    
    try {
      await handleVerify(apiRoute, rec.id, actionType, token);
      setRequestData(prev => prev.filter(item => item.id !== rec.id));
      setStatus(`審核${actionType === 'approved' ? '通過' : '不通過'}成功！`);
    } catch (err) {
      setStatus("審核失敗：" + err.message);
    }
  };

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
    <PageLayout title={"待審核報帳款項"}>
      <DataTable
        data={reimbursements}
        columns={reimbursement_column}
        emptyMessage="尚無紀錄"
      />
    </PageLayout>
  )}

  {activeTab === TAB_BUDGET && (
    <PageLayout title={"待審核申請經費款項"}>
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

export default ManagerPendingRequest;