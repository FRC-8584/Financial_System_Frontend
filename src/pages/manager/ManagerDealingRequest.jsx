import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs.jsx";
import PageLayout from "../../components/layout/pages/PageLayout.jsx"
import { DataTable } from "../../components/DataTable.jsx";
import { Button } from "../../components/Button.jsx";
import { ReceiptUrl } from "../../components/ReceiptUrl.jsx";
import { fetchBudgets, fetchReimbursements } from "../../utils/handleFetchRequest.js";
import { handleSettle } from "../../utils/handleSetRequestStatus.js";
import { fetchReimbursementRequest } from "../../utils/handleExportExcel.js";

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
    { key: "receiptUrl", label: "收據或發票證明", render: (rec) => (
      <ReceiptUrl  url={rec.receiptUrl} text={"查看"}/>
    ) },
    { key: "", label: "", render: (rec) => (
      <Button
        text={"標記結清"} btnType={"blue-type"}
        onClickAction={() => handleSettleAndRemove(REIMBURSEMENT_API_ROUTE, rec.id)}
      />
    ) }
  ]

  const budget_column = [
    { key: "user", label: "報帳人", render: (rec) => rec.user.name },
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
    { key: "", label: "", render: (rec) => (
      <Button
        text={"標記結清"} btnType={"blue-type"}
        onClickAction={() => handleSettleAndRemove(BUDGET_API_ROUTE, rec.id)}
      />
    ) }
  ]
  
  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      await fetchBudgets({ setBudgets, token, param: "?status=approved" });
      await fetchReimbursements({ setReimbursements, token, param: "?status=approved" });
      setStatus("");
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

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
    <Button
      text={"輸出請款單"} btnType={"blue-type"}
      onClickAction={handleDownloadExcel}
    />
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