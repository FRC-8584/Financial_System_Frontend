import React from "react";
import { convertRequestStatusName, convertRoleName } from "../../../utils/dataNameConverter.util.js";
import "./styles/userProfile.css";

export default function UserProfile({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="user-profile-card">
      <button className="close-btn" onClick={onClose}>✕</button>
      <h2>我的資訊</h2>
      <div className="user-info">
        <p><strong>姓名：</strong>{user.name}</p>
        <p><strong>權限：</strong>{user.role ? convertRoleName(user.role) : "Unknown"}</p>
        <p><strong>Email：</strong>{user.email || "Unknown"}</p>
        <p><strong>加入時間：</strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
      </div>
    </div>
  );
}
