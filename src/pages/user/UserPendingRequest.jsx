import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import PageLayout from "../../components/layout/pages/PageLayout.jsx";
import { Tabs } from "../../components/Tabs.jsx";
import { DataTable } from "../../components/DataTable.jsx";
import { Button } from "../../components/Button.jsx";
import { ReceiptUrl } from "../../components/ReceiptUrl.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog.jsx";
import { ModifyDialog } from "../../components/ModifyDialog.jsx";
import { fetchBudgets, fetchReimbursements } from "../../utils/handleFetchRequest.js";
import { handleModifyBudget, handleModifyReimbursement } from "../../utils/handleModifyRequest.js";
import { handleDeleteBudget, handleDeleteReimbursement } from "../../utils/handleDeleteRequest.js";
import { convertRequestStatusName } from "../../utils/dataNameConverter.util.js";

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

  const reimbursement_column = [
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "status", label: "狀態", render: (rec) => convertRequestStatusName(rec.status) },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
    { key: "receiptUrl", label: "收據或發票證明", render: (rec) => (
      <ReceiptUrl  url={rec.receiptUrl} text={"查看"}/>
    ) },
    { key: "", label: "", render: (rec) => (
      <>
      <Button
        text={"修改款項內容"} btnType={"blue-type"}
        onClickAction={() => setItemToModify({ ...rec, type: "reimbursement" })}
      />
      <Button
        text={"刪除款項"} btnType={"red-type"}
        onClickAction={() => setItemToDelete({ id: rec.id, type: "reimbursement" })}
      />
      </>
    ) }
  ]

  const budget_column = [
    { key: "title", label: "品項" },
    { key: "amount", label: "金額" },
    { key: "status", label: "狀態", render: (rec) => convertRequestStatusName(rec.status) },
    { key: "description", label: "備註" },
    { key: "createdAt", label: "申請時間", render: (rec) => new Date(rec.createdAt).toLocaleString() },
    { key: "", label: "", render: (rec) => (
      <>
      <Button
        text={"修改款項內容"} btnType={"blue-type"}
        onClickAction={() => setItemToModify({ ...rec, type: "budget" })}
      />
      <Button
        text={"刪除款項"} btnType={"red-type"}
        onClickAction={() => setItemToDelete({ id: rec.id, type: "budget" })}
      />
      </>
    ) }
  ]

  useEffect(() => {
    fetchData();
  }, [token]);
  
  const fetchData = async () => {
    try {
      await fetchBudgets({ setBudgets, token, param: "?status=pending" }, true);
      await fetchReimbursements({ setReimbursements, token, param: "?status=pending" }, true);
      setStatus("");
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
  <PageLayout title={"我的報帳紀錄 (審核中)"}>
    <DataTable
      data={reimbursements}
      columns={reimbursement_column}
      emptyMessage="尚無紀錄"
    />
  </PageLayout>
  )}

  {activeTab === TAB_BUDGET && (
  <PageLayout title={"我的申請經費紀錄 (審核中)"}>
    <DataTable
      data={budgets}
      columns={budget_column}
      emptyMessage="尚無紀錄"
    />
  </PageLayout>
  )}

  <div className="status">{status}</div>

  {itemToDelete && (
    <ConfirmDialog
      message={`確定要刪除這筆款項嗎？`}
      onConfirm={() => handleFinalDelete(itemToDelete.id, itemToDelete.type)}
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