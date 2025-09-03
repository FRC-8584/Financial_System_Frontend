import React from "react";
import Form from "./Form.jsx";
import InputField from "./InputField.jsx";

const ReimbursementForm = ({ formData, setFormData, onSubmit, children }) => {
  const handleChange = (setter) => (e) => {
    const { name, value, files, type } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  return (
    <Form onSubmit={onSubmit}>
      <InputField
        label="品項"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange(setFormData)}
      />
      <InputField
        label="報帳金額"
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange(setFormData)}
      />
      <InputField
        label="備註"
        type="textarea"
        name="description"
        value={formData.description}
        onChange={handleChange(setFormData)}
      />
      <div className="form-group">
        <label className="form-label">發票或證明上傳</label>
        <input
          type="file"
          accept="image/*"
          name="receipt"
          className="form-input"
          onChange={handleChange(setFormData)}
          required
        />
      </div>

      {children}
    </Form>
  );
};

export default ReimbursementForm;
