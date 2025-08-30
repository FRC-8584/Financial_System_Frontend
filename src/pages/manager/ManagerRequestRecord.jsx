import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs";
import { DataTable } from "../../components/DataTable";
import { fetchBudgets, fetchReimbursements, fetchDisbursements } from "../../utils/fetchRequestData.util";

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
  {/* Tab button */}
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
  <div>
    <h1 className="font-bold mb-6">已結清請款紀錄</h1>
    <DataTable
      data={disbursements}
      columns={[
        { key: "title", label: "品項" },
        { key: "amount", label: "金額" },
        { key: "description", label: "備註" },
        { key: "settledAt", label: "結清時間", render: (rec) => new Date(rec.settledAt).toLocaleString() },
      ]}
      emptyMessage="尚無紀錄"
    />
  </div>
  )}

  <div className="status">{status}</div>
  </>
  )
}

export default ManagerRequestRecord;