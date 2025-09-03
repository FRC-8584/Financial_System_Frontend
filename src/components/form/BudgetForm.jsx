import React from "react";
import Form from "./Form.jsx";
import InputField from "./InputField.jsx";

const BudgetForm = ({ formData, setFormData, onSubmit, children }) => {
  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
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
        label="申請金額"
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

      {children}
    </Form>
  );
};

export default BudgetForm;
