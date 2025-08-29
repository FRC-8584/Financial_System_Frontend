import React from "react";
import "../../styles/form.css";

const InputField = ({ label, type, name, value, onChange }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="form-input"
        required
      />
    </div>
  );
};

export default InputField;