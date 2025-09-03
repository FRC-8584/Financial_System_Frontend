import React, { useState, useEffect } from "react";
import { Button } from "./Button.jsx";
import SubmitButton from "./form/SubmitButton.jsx";
import ReimbursementForm from "./form/ReimbursementForm.jsx";
import BudgetForm from "./form/BudgetForm.jsx";
import "./styles/modifyDialog.css";

export function ModifyDialog({ id, type, initialData, onSubmit, onClose }) {
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

  useEffect(() => {
    if (initialData) {
      if (type === "reimbursement") {
        setReimbursementForm({
          title: initialData.title || "",
          amount: initialData.amount || "",
          description: initialData.description || "",
        })
      }
      else if(type === "budget") {
        setBudgetForm({
          title: initialData.title || "",
          amount: initialData.amount || "",
          description: initialData.description || "",
        })
      }
    }
  }, [initialData]);

  const renderForm = () => {
    if (type === "reimbursement") {
      return (
        <ReimbursementForm
          formData={reimbursementForm}
          setFormData={setReimbursementForm}
        >
          <div className="modify-dialog-actions">
            <Button text="取消" btnType="gray-type" onClickAction={onClose} />
            <SubmitButton
              text="確認修改"
              onClickAction={(e) => {
                e.preventDefault();
                onSubmit(reimbursementForm, id, type);
                onClose();
              }}
            />
          </div>
        </ReimbursementForm>
      );
    } else if (type === "budget") {
      return (
        <BudgetForm
          formData={budgetForm}
          setFormData={setBudgetForm}
        >
          <div className="modify-dialog-actions">
            <Button text="取消" btnType="gray-type" onClickAction={onClose} />
            <SubmitButton
              text="確認修改"
              onClickAction={(e) => {
                e.preventDefault();
                onSubmit(budgetForm, id, type);
                onClose();
              }}
            />
          </div>
        </BudgetForm>
      );
    } else {
      return <p>Unknown Form Type</p>;
    }
  };

  return (
    <div className="modify-dialog-overlay">
      <div className="modify-dialog">
        <h2>修改款項內容</h2>
        {renderForm()}
      </div>
    </div>
  );
}
