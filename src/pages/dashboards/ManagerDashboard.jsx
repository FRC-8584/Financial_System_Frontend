import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PendingingRequestPage } from "../manager/PendingRequestPage";
import { DealingRequestPage } from "../manager/DealingRequestPage";
import { RequestRecordPage } from "../manager/RequestRecordPage";

import { LogoutConfirm } from "../../components/LogoutConfirm";

// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';
const DISBURSEMENT_API_ROUTE = 'http://localhost:3000/api/disbursement';

// Pages
const PAGE_PENDING_REQUEST = "pendingRequest";
const PAGE_DEALING_REQUEST = "dealingRequest";
const PAGE_REQUEST_RECORD = "requestRecord";

function ManagerDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");// JWT token

  // Webside view configration
  const [activePage, setActivePage] = useState(PAGE_PENDING_REQUEST);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 統一錯誤處理
  const handleError = (err, msg) => {
    console.error(err);
    setStatus(`${msg}：${err.message}`);
    setIsSuccess(false);
  };

  // Initialize
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Export Excel
  const handleExport = async () => {
    try {
      const res = await fetch(REIMBURSEMENT_API_ROUTE + "/export", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("匯出失敗");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reimbursements.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      handleError(err, "匯出失敗");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side bar */}
      <aside className="w-64 bg-teal-800 text-white p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">財務端</h2>
        <nav className="flex flex-col space-y-2">
          <button
            className="text-left hover:bg-gray-800 px-3 py-2 rounded"
            onClick={() => setActivePage(PAGE_PENDING_REQUEST)}
          >
            待審核請款
          </button>

          <button 
            className="text-left hover:bg-gray-800 px-3 py-2 rounded"
            onClick={() => setActivePage(PAGE_DEALING_REQUEST)}
          >
            待處理請款
          </button>

          <button
            className="text-left hover:bg-gray-800 px-3 py-2 rounded"
            onClick={() => setActivePage(PAGE_REQUEST_RECORD)}
          >
            歷史請款紀錄
          </button>

          {/* Logout */}
          <button
            className="text-left hover:bg-gray-800 px-3 py-2 rounded"
            onClick={() => setShowLogoutConfirm(true)}
          >
            登出
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {status && (
          <p className={`text-sm mb-4 font-medium ${
            isSuccess
              ? "text-green-600 bg-green-50 border border-green-200 p-2 rounded"
              : "text-red-600 bg-red-50 border-red-200 p-2 rounded"
          }`}>
            {status}
          </p>
        )}

        {/* Pending request */}
        {activePage === PAGE_PENDING_REQUEST && (<PendingingRequestPage token={token}/>)}

        {/* Dealing request */}
        {activePage === PAGE_DEALING_REQUEST && (<DealingRequestPage token={token}/>)}

        {/* Request records */}
        {activePage === PAGE_REQUEST_RECORD && (<RequestRecordPage token={token}/>)}

        {/* Logout confirm */}
        {showLogoutConfirm && (<LogoutConfirm setShowLogoutConfirm={setShowLogoutConfirm}/>)}
      </main>
    </div>
  );
}

export default ManagerDashboard;
