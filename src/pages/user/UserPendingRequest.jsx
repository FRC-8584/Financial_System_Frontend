import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Tabs } from "../../components/Tabs.jsx";
import { DataTable } from "../../components/DataTable.jsx";
import { DeleteConfirm } from "../../components/DeleteConfirm.jsx";
import { ModifyDialog } from "../../components/ModifyDialog.jsx";
import { fetchBudgets, fetchReimbursements } from "../../utils/fetchRequestData.util.js";
import { handleModifyBudget, handleModifyReimbursement } from "../../utils/modifyRequestData.util.js";
import { handleDeleteBudget, handleDeleteReimbursement } from "../../utils/deleteRequestData.util.js";
import { convertRequestStatusName } from "../../utils/dataNameConverter.util.js";
import "../../styles/pages/userPendingRequest.css";

const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function UserPendingRequest() {
  const { token } = useOutletContext();
  const [activeTab, setActiveTab] = useState(TAB_REIMBURSEMENT);
  const [status, setStatus] = useState("");

  // Request data
  const [reimbursements, setReimbursements] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToModify, setItemToModify] = useState(null);

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

  const handleFinalDelete = async (id, type) => {
    try {
      if (type === 'reimbursement') {
        await handleDeleteReimbursement(id, token);
        setReimbursements(prev => prev.filter(item => item.id !== id));
      } else if (type === 'budget') {
        await handleDeleteBudget(id, token);
        setBudgets(prev => prev.filter(item => item.id !== id));
      }
      setStatus("刪除成功！");
    } catch (err) {
      setStatus("刪除失敗：" + err.message);
    }
    setItemToDelete(null); 
  };

  const handleFinalModify = async (data, id, type, token) => {
    try {
      if (type === "reimbursement") {
        await handleModifyReimbursement(data, id, token);
        setReimbursements(prev =>
          prev.map(item => item.id === id ? { ...item, ...data } : item)
        );
      } else if (type === "budget") {
        await handleModifyBudget(data, id, token);
        setBudgets(prev =>
          prev.map(item => item.id === id ? { ...item, ...data } : item)
        );
      }
      setStatus("修改成功！");
    } catch (err) {
      setStatus("修改失敗：" + err.message);
    }
  };

  const showDeleteDialog = (id, type) => {
    setItemToDelete({ id, type });
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

      {/* Tab of my pending reimbursement */}
      {activeTab === TAB_REIMBURSEMENT && (
      <div className="user-pending-request-section">
        <h1 className="request-title">我的報帳紀錄</h1>
        <DataTable
          data={reimbursements}
          columns={[
            { key: "title", label: "品項" },
            { key: "amount", label: "金額" },
            { key: "status", label: "狀態", render: (rec) => convertRequestStatusName(rec.status) },
            { key: "description", label: "備註" },
            { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
            { key: "receipt_url", label: "單據", render: (rec) => (
                <a href={rec.receipt_url} target="_blank" rel="noreferrer" className="receipt-link">
                  查看
                </a>
              ) },
            { key: "", label: "", render: (rec) => (
              <>
                <button
                  className="action-button modify-button"
                  onClick={() => setItemToModify({ ...rec, type: "reimbursement" })}
                >
                  修改款項內容
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => showDeleteDialog(rec.id, 'reimbursement')}
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
      <div className="user-pending-request-section">
        <h1 className="request-title">我的申請經費紀錄</h1>
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
                <button
                  className="action-button modify-button"
                  onClick={() => {}}
                >
                  修改款項內容
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => showDeleteDialog(rec.id, 'budget')}
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
      <div className="status">{status}</div>

      {itemToDelete && (
        <DeleteConfirm
          id={itemToDelete.id}
          type={itemToDelete.type}
          onConfirm={handleFinalDelete}
          onClose={() => setItemToDelete(null)}
        />
      )}
      {itemToModify && (
        <ModifyDialog
          id={itemToModify.id}
          type={itemToModify.type}
          token={token}
          initialData={itemToModify}
          onConfirm={handleFinalModify}
          onClose={() => setItemToModify(null)}
        />
      )}
    </>
  );
}

export default UserPendingRequest;