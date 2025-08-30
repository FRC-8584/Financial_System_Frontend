import React from "react";
import "../styles/confirmDialog.css";

export function ConfirmDialog({ message, onConfirm, onClose }) {
  return (
    <div className="overlay">
      <div className="content">
        <p className="message">{message}</p>
        <div className="actions">
          <button
            className="button cancel"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="button confirm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}