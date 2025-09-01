import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageLayout from "../../components/layout/pages/PageLayout.jsx";
import { Tabs } from "../../components/Tabs.jsx";
import Form from "../../components/form/Form.jsx";
import InputField from "../../components/form/InputField.jsx";
import SubmitButton from "../../components/form/SubmitButton.jsx";
import { submitReimbursement, submitBudget } from "../../utils/handleCreateRequest.js";

const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function UserCreateRequest() {
  const { token } = useOutletContext();
  const [activeTab, setActiveTab] = useState(TAB_REIMBURSEMENT);
  const [status, setStatus] = useState("");

  // Reimbursement state
  const [reimbursementForm, setReimbursementForm] = useState({
    title: "",
    amount: "",
    description: "",
    receipt: null,
  });

  // Budget state
  const [budgetForm, setBudgetForm] = useState({
    title: "",
    amount: "",
    description: "",
  });

  const handleChange = (setter) => (e) => {
    const { name, value, files } = e.target;

    if (name === "amount") {
      const num = Number(value);
      if (num < 0) return;
    }

    setter((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

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
    <PageLayout title={"新增報帳"}>
      <Form onSubmit={handleReimbursementSubmit}>
        <InputField
          label="品項"
          type="text"
          name="title"
          value={reimbursementForm.title}
          onChange={handleChange(setReimbursementForm)}
        />
        <InputField
          label="報帳金額"
          type="number"
          name="amount"
          value={reimbursementForm.amount}
          onChange={handleChange(setReimbursementForm)}
        />
        <div className="form-group">
          <label className="form-label">備註</label>
          <textarea
            name="description"
            className="form-input"
            value={reimbursementForm.description}
            onChange={handleChange(setReimbursementForm)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">發票或證明上傳</label>
          <input
            type="file"
            accept="image/*"
            name="receipt"
            className="form-input"
            onChange={handleChange(setReimbursementForm)}
            required
          />
        </div>
        <SubmitButton text="送出款項" />
      </Form>
    </PageLayout>
  )}

  {activeTab === TAB_BUDGET && (
    <PageLayout title={"新增報帳"}>
      <Form onSubmit={handleBudgetSubmit}>
        <InputField
          label="品項"
          type="text"
          name="title"
          value={budgetForm.title}
          onChange={handleChange(setBudgetForm)}
        />
        <InputField
          label="申請金額"
          type="number"
          name="amount"
          value={budgetForm.amount}
          onChange={handleChange(setBudgetForm)}
        />
        <div className="form-group">
          <label className="form-label">備註</label>
          <textarea
            name="description"
            className="form-input"
            value={budgetForm.description}
            onChange={handleChange(setBudgetForm)}
          />
        </div>
        <SubmitButton text="送出款項" />
      </Form>
    </PageLayout>
  )}

  {status && <p className="mt-4 text-sm">{status}</p>}
  </>
  );
}

export default UserCreateRequest;