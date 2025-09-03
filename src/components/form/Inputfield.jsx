import React from "react";
import "./form.css";

const InputField = ({ label, type = "text", name, value, onChange, options }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="form-input"
          rows={4}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="form-input"
        >
          {options?.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="form-input"
        />
      )}
    </div>
  );
};

export default InputField;
