import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageLayout from "../../components/layout/pages/PageLayout.jsx";
import { Tabs } from "../../components/Tabs.jsx";
import ReimbursementForm from "../../components/form/ReimbursementForm.jsx";
import BudgetForm from "../../components/form/BudgetForm.jsx";
import SubmitButton from "../../components/form/SubmitButton.jsx";
import { submitReimbursement, submitBudget } from "../../utils/handleCreateRequest.js";

const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function UserCreateRequest() {
  const { token } = useOutletContext();
  const [activeTab, setActiveTab] = useState(TAB_REIMBURSEMENT);
  const [status, setStatus] = useState("");

  const [reimbursementForm, setReimbursementForm] = useState({
    title: "",
    amount: "",
    description: "",
    receipt: null,
  });

  const [budgetForm, setBudgetForm] = useState({
    title: "",
    amount: "",
    description: "",
  });

  const handleReimbursementSubmit = async (e) => {
    e.preventDefault();
    if (!reimbursementForm.receipt) {
      setStatus("請上傳單據圖片");
      return;
    }
    const formData = new FormData();
    formData.append("title", reimbursementForm.title);
    formData.append("amount", reimbursementForm.amount);
    formData.append("description", reimbursementForm.description);
    formData.append("receipt", reimbursementForm.receipt);

    try {
      await submitReimbursement(token, formData);
      setStatus("報帳已送出！");
      setReimbursementForm({ title: "", amount: "", description: "", receipt: null });
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitBudget(token, budgetForm);
      setStatus("經費申請已送出！");
      setBudgetForm({ title: "", amount: "", description: "" });
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
    <PageLayout title={"新增報帳款項"}>
      <ReimbursementForm
        formData={reimbursementForm}
        setFormData={setReimbursementForm}
      >
        <SubmitButton text="送出款項" onClickAction={handleReimbursementSubmit} />
      </ReimbursementForm>
    </PageLayout>
  )}

  {activeTab === TAB_BUDGET && (
    <PageLayout title={"新增申請經費款項"}>
      <BudgetForm
        formData={budgetForm}
        setFormData={setBudgetForm}
      >
        <SubmitButton text="送出款項" onClickAction={handleBudgetSubmit}/>
      </BudgetForm>
    </PageLayout>
  )}

  <div className="status">{status}</div>
  </>
  );
}

export default UserCreateRequest;