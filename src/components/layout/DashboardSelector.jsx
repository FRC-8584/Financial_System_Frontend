import React, { useState } from "react";
import "../../styles/layout/dashboardSelector.css";

export default function DashboardSelector({ role, value, onChange }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  const options = [];
  if (role === "member" || role === "manager" || role === "admin") {
    options.push({ value: "user-dashboard", label: "用戶端" });
  }
  if (role === "manager" || role === "admin") {
    options.push({ value: "manager-dashboard", label: "財務端" });
  }
  if (role === "admin") {
    options.push({ value: "admin-dashboard", label: "管理端" });
  }

  return (
    <div className="dashboard-selector">
      <button
        className="selector-button"
        onClick={() => setOpen((prev) => !prev)}
      >
        {options.find((opt) => opt.value === value)?.label || "選擇介面"}
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul className="selector-options">
          {options.map((opt) => (
            <li key={opt.value} onClick={() => handleSelect(opt.value)}>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}