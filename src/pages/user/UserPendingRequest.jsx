import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs";
import { DataTable } from "../../components/DataTable";
import { fetchBudgets, fetchReimbursements } from "../../utils/fetchRequestData.util";
import { convertRequestStatusName } from "../../utils/dataNameConverter.util";

const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function UserPendingRequest() {
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
      await fetchBudgets({ setBudgets, token }, true, "?status=pending");
      await fetchReimbursements({ setReimbursements, token }, true, "?status=pending");
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

  {/* Tab of my pending reimbursement */}
  {activeTab === TAB_REIMBURSEMENT && (
  <div>
    <h1 className="text-3xl font-bold mb-6">我的報帳紀錄</h1>
    <DataTable
      data={reimbursements}
      columns={[
        { key: "title", label: "品項" },
        { key: "amount", label: "金額" },
        { key: "status", label: "狀態", render: (rec) => convertRequestStatusName(rec.status) },
        { key: "description", label: "備註" },
        { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
        { key: "receipt_url", label: "單據", render: (rec) => (
            <a href={rec.receipt_url} target="_blank" rel="noreferrer" className="text-black underline">
              查看
            </a>
          ) },
        { key: "", label: "", render: (rec) => (
          <>
          <button className="px-4 py-2 mx-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => {
            }}
          >
            修改款項內容
          </button>
          <button className="px-4 py-2 mx-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
            }}
          >
            刪除款項
          </button>
          </>
        ) },
      ]}
      emptyMessage="尚無紀錄"
    />
  </div>
  )}

  {/* Tab of my pending budget */}
  {activeTab === TAB_BUDGET && (
  <div>
    <h1 className="text-3xl font-bold mb-6">我的申請經費紀錄</h1>
    <DataTable
      data={budgets}
      columns={[
        { key: "title", label: "品項" },
        { key: "amount", label: "金額" },
        { key: "status", label: "狀態", render: (rec) => convertRequestStatusName(rec.status) },
        { key: "description", label: "備註" },
        { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
        { key: "", label: "", render: (rec) => (
          <>
          <button className="px-4 py-2 mx-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => {
            }}
          >
            修改款項內容
          </button>
          <button className="px-4 py-2 mx-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
            }}
          >
            刪除款項
          </button>
          </>
        ) },
      ]}
      emptyMessage="尚無紀錄"
    />
  </div>
  )}
  </>
  )
}

export default UserPendingRequest;