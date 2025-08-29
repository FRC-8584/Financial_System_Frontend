import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs";
import { DataTable } from "../../components/DataTable";
import { fetchBudgets, fetchReimbursements } from "../../utils/fetchRequestData.util";

const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function UserDealingRequest() {
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
      await fetchBudgets({ setBudgets, token }, true, "?status=approved");
      await fetchReimbursements({ setReimbursements, token }, true, "?status=approved");
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
    <h1 className="text-3xl font-bold mb-6">我的報帳紀錄</h1>
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
      ]}
      emptyMessage="尚無紀錄"
    />
  </div>
  )}

  {/* Tab of my dealing budget */}
  {activeTab === TAB_BUDGET && (
  <div>
    <h1 className="text-3xl font-bold mb-6">我的申請經費紀錄</h1>
      <DataTable
      data={budgets}
      columns={[
        { key: "title", label: "品項" },
        { key: "amount", label: "金額" },
        { key: "description", label: "備註" },
        { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
      ]}
      emptyMessage="尚無紀錄"
    />
  </div>
  )}
  </>
  )
}

export default UserDealingRequest;