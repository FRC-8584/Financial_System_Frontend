import React from "react";
import { ConfirmDialog } from "./ConfirmDialog";

export function DeleteConfirm({ id, type, onConfirm, onClose }) {
  const handleDelete = () => {
    onConfirm(id, type);
  };

  return (
    <ConfirmDialog
      message={`確定要刪除這筆款項嗎？`}
      onConfirm={handleDelete}
      onClose={onClose}
    />
  );
}