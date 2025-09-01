import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs";
import { DataTable } from "../../components/DataTable.jsx";
import PageLayout from "../../components/layout/pages/PageLayout.jsx";
import { fetchBudgets, fetchReimbursements } from "../../utils/handleFetchRequest.js";

const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function UserDealingRequest() {
  const { token } = useOutletContext();
  const [activeTab, setActiveTab] = useState(TAB_REIMBURSEMENT);
  const [status, setStatus] = useState("");

  // Data of request payments
  const [reimbursements, setReimbursements] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const reimbursement_column = [
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
    { key: "receipt_url", label: "收據或發票證明", render: (rec) => (
      <a href={rec.receipt_url} target="_blank" rel="noreferrer" className="text-black underline">
        查看
      </a>
    ) },
  ]

  const budget_column = [
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() }
  ]

  useEffect(() => {
    fetchData();
  }, [token]);
  
  const fetchData = async () => {
    try {
      await fetchBudgets({ setBudgets, token, param: "?status=approved" }, true);
      await fetchReimbursements({ setReimbursements, token, param: "?status=approved" }, true);
    } catch (err) {
      setStatus("錯誤：" + err.message);
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
  <PageLayout title={"我的報帳紀錄 (處理中)"}>
    <DataTable
      data={reimbursements}
      columns={reimbursement_column}
      emptyMessage="尚無紀錄"
    />
  </PageLayout>
  )}

  {activeTab === TAB_BUDGET && (
  <PageLayout title={"我的申請經費紀錄 (處理中)"}>
    <DataTable
      data={budgets}
      columns={budget_column}
      emptyMessage="尚無紀錄"
    />
  </PageLayout>
  )}
  </>
  );
}

export default UserDealingRequest;