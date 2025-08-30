import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs";
import { DataTable } from "../../components/DataTable";
import { fetchBudgets, fetchReimbursements } from "../../utils/fetchRequestData.util";
import { handleVerify, handleSettle } from "../../utils/handleRequestStatus.util";
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
        <div className="manager-pending-request-section">
          <h1 className="request-title">待審核報帳款項</h1>
          <DataTable
            data={reimbursements}
            columns={[
              { key: "title", label: "品項" },
              { key: "amount", label: "金額" },
              { key: "description", label: "備註" },
              { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
              { key: "receipt_url", label: "單據", render: (rec) => (
                  <a href={rec.receipt_url} target="_blank" rel="noreferrer" className="receipt-link">查看</a>
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
                ) },
            ]}
            emptyMessage="尚無紀錄"
          />
        </div>
      )}

      {activeTab === TAB_BUDGET && (
        <div className="manager-pending-request-section">
          <h1 className="request-title">待審核申請經費款項</h1>
          <DataTable
            data={budgets}
            columns={[
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
                ) },
            ]}
            emptyMessage="尚無紀錄"
          />
        </div>
      )}
      <div className="status">{status}</div>
    </>
  );
}

export default ManagerPendingRequest;