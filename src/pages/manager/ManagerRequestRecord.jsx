import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import PageLayout from "../../components/layout/pages/PageLayout.jsx";
import { Tabs } from "../../components/Tabs.jsx";
import { DataTable } from "../../components/DataTable.jsx";
import { ReceiptUrl } from "../../components/ReceiptUrl.jsx";
import { fetchBudgets, fetchReimbursements, fetchDisbursements } from "../../utils/handleFetchRequest.js";
import { fetchRequestRecordExcel } from "../../utils/handleExportExcel.js";
import { convertRequestStatusName } from "../../utils/dataNameConverter.util.js"

const TAB_DISBURSEMENT = "disbursement";
const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function ManagerRequestRecord() {
  const { token } = useOutletContext();
  const [activeTab, setActiveTab] = useState(TAB_DISBURSEMENT);
  const [status, setStatus] = useState("");

  // Data of request payments
  const [budgets, setBudgets] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [disbursements, setDisbursements] = useState([]);

  const disbursement_column = [
    { key: "user", label: "報帳人", render: (rec) => rec.user.name },
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "description", label: "備註" },
    { key: "settledAt", label: "結清時間", render: (rec) => new Date(rec.settledAt).toLocaleString() }
  ]

  const reimbursement_column = [
    { key: "user", label: "報帳人", render: (rec) => rec.user.name },
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "status", label: "狀態", render: (rec) => convertRequestStatusName(rec.status) },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
    { key: "receiptUrl", label: "收據或發票證明", render: (rec) => (
      <ReceiptUrl  url={rec.receiptUrl} text={"查看"}/>
    ) }
  ]

  const budget_column = [
    { key: "user", label: "報帳人", render: (rec) => rec.user.name },
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "status", label: "狀態", render: (rec) => convertRequestStatusName(rec.status) },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
  ]

  useEffect(() => {
    fetchData();
  }, [token]);
  
  const fetchData = async () => {
    try {
      await fetchDisbursements({ setDisbursements, token });
      await fetchReimbursements({ setReimbursements, token });
      await fetchBudgets({ setBudgets, token });
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setStatus("正在生成請款紀錄表...");
      await fetchRequestRecordExcel({ token });
      setStatus("請款紀錄表已成功下載！");
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
      { value: TAB_DISBURSEMENT, label: "請款紀錄" },
      { value: TAB_REIMBURSEMENT, label: "報帳" },
      { value: TAB_BUDGET, label: "申請經費" },
    ]}
  />

  {activeTab === TAB_DISBURSEMENT && (
  <PageLayout title={"歷史請款紀錄 (已結清報帳)"}>
    <DataTable
      data={disbursements}
      columns={disbursement_column}
      emptyMessage="尚無紀錄"
    />
    {disbursements.length > 0 && (
    <div>
      <button 
        className="export-button"
        onClick={handleDownloadExcel}
      >
        輸出請款紀錄表
      </button>
    </div>
    )}
  </PageLayout>
  )}

  {activeTab === TAB_REIMBURSEMENT && (
    <PageLayout title={"報帳款項紀錄 (全)"}>
      <DataTable
        data={reimbursements}
        columns={reimbursement_column}
        emptyMessage="尚無紀錄"
      />
    </PageLayout>
  )}

  {activeTab === TAB_BUDGET && (
    <PageLayout title={"申請經費款項紀錄 (全)"}>
      <DataTable
        data={budgets}
        columns={budget_column}
        emptyMessage="尚無紀錄"
      />
    </PageLayout>
  )}

  <div className="status">{status}</div>
  </>
  )
}

export default ManagerRequestRecord;