import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import PageLayout from "../../components/layout/pages/PageLayout.jsx";
import { Tabs } from "../../components/Tabs.jsx";
import { DataTable } from "../../components/DataTable.jsx";
import { fetchBudgets, fetchReimbursements, fetchDisbursements } from "../../utils/fetchRequestData.util.js";

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

  useEffect(() => {
    fetchData();
  }, [token]);
  
  const fetchData = async () => {
    try {
      await fetchDisbursements({ setDisbursements, token }, "");
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
      { value: TAB_DISBURSEMENT, label: "請款紀錄" },
      { value: TAB_REIMBURSEMENT, label: "報帳" },
      { value: TAB_BUDGET, label: "申請經費" },
    ]}
  />

  {activeTab === TAB_DISBURSEMENT && (
  <PageLayout title={"已結清請款紀錄"}>
    <DataTable
      data={disbursements}
      columns={disbursement_column}
      emptyMessage="尚無紀錄"
    />
  </PageLayout>
  )}

  <div className="status">{status}</div>
  </>
  )
}

export default ManagerRequestRecord;