import React, { useState, useEffect } from "react";
import "./styles/modifyDialog.css";

export function ModifyDialog({ id, type, token, initialData, onConfirm, onClose }) {
  const [form, setForm] = useState({ title: "", amount: "", description: "" });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        amount: initialData.amount || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    try {
      await onConfirm(form, id, type, token);
      onClose();
    } catch (err) {
      alert("修改失敗：" + err.message);
    }
  };

  return (
    <div className="modify-dialog-overlay">
      <div className="modify-dialog">
        <h2>修改款項內容</h2>
        <label>
          品項
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label>
          金額
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </label>
        <label>
          備註
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>

        <div className="modify-dialog-actions">
          <button onClick={handleSubmit} className="confirm-btn">確認修改</button>
          <button onClick={onClose} className="cancel-btn">取消</button>
        </div>
      </div>
    </div>
  );
}
