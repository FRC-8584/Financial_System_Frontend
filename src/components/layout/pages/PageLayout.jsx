import React from "react";
import "./PageLayout.css"

export default function PageLayout({ title, children, actions }) {
  return (
    <div className="page-container">
      <h1>{title}</h1>

      {/* Other actions (Optional) */}
      {actions && <div className="mb-4">{actions}</div>}

      <div className="page-content">
        {children}
      </div>
    </div>
  );
}
