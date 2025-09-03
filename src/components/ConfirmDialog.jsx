import React from "react";
import "./styles/confirmDialog.css";
import { Button } from "./Button";

export function ConfirmDialog({ message, onConfirm, onClose }) {
  return (
    <div className="overlay">
      <div className="content">
        <p className="message">{message}</p>
        <div className="actions">
          <Button
            text={"取消"} btnType={"gray-type"}
            onClickAction={onClose}
          />
          <Button
            text={"確定"} btnType={"red-type"}
            onClickAction={() => {
              onConfirm();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}