import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LogoutConfirm({ setShowLogoutConfirm }) {
  const navigate = useNavigate();

  return(
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <p className="mb-4 text-lg">確定要登出嗎？</p>
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setShowLogoutConfirm(false)}
        >
          取消
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          確定
        </button>
      </div>
    </div>
  </div>
  )
}