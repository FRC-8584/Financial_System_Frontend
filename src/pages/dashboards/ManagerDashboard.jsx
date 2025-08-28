import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PendingingRequestPage } from "../manager/PendingRequestPage";
import { DealingRequestPage } from "../manager/DealingRequestPage";

import { LogoutConfirm } from "../../components/LogoutConfirm";

// Server API routes
const USER_API_ROUTE = 'http://localhost:3000/api/user';
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';
const DISBURSEMENT_API_ROUTE = 'http://localhost:3000/api/disbursement';

// Pages
const PAGE_PENDING_REQUEST = "pendingRequest";
const PAGE_DEALING_REQUEST = "dealingRequest";
const PAGE_REQUEST_RECORD = "requestRecord";

// Tabs
const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function ManagerDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");// JWT token

  // Webside view configration
  const [activePage, setActivePage] = useState(PAGE_PENDING_REQUEST);
  const [activeTab, setActiveTab] = useState(TAB_REIMBURSEMENT);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // 報帳申請審核
  const [claims, setClaims] = useState([]);

  // Select request payment conditions
  const [selectRequirements, setSelectRequirements] = useState("");

  // Data of request payments
  const [budgets, setBudgets] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [disbursements, setDisbursements] = useState([]);

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
    } else {
      loadPageData(PAGE_PENDING_REQUEST);
    }
  }, [token, navigate]);

  // Accroding pages to load data
  const loadPageData = async (page) => {
    setActivePage(page);
    if (page === PAGE_PENDING_REQUEST) {
      await fetchReimbursements("?status=pending");
      await fetchBudgets("?status=pending");
    }
    else if (page === PAGE_DEALING_REQUEST) {
      await fetchReimbursements("?status=approved");
      await fetchBudgets("?status=approved");
    }
    else if (page === PAGE_REQUEST_RECORD) {
      await fetchDisbursements("");
    }
  };

  // Get budget records
  const fetchBudgets = async (param = "") => {
    try {
      const res = await fetch(BUDGET_API_ROUTE + "/" + param.trim(), {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("載入失敗");
      setBudgets(await res.json());
    } catch (err) {
      handleError(err, "載入申請經費款項錯誤")
    }
  };

  // Get reimbursement records
  const fetchReimbursements = async (param = "") => {
    try {
      const res = await fetch(REIMBURSEMENT_API_ROUTE + "/" + param.trim(), {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("載入失敗");
      setReimbursements(await res.json());
    } catch (err) {
      handleError(err, "載入報帳款項錯誤")
    }
  };

  // Get disbursement records
  const fetchDisbursements = async (param = "") => {
    try {
      const res = await fetch(DISBURSEMENT_API_ROUTE + "/" + param.trim(), {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("載入失敗");
      setDisbursements(await res.json());
    } catch (err) {
      handleError(err, "載入請款紀錄錯誤")
    }
  };

  // Mark request payment as approved or rejected
  const handleVerify = async (route, id, status) => {
    try {
      const res = await fetch(route + `/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("操作失敗");
      setStatus("已核銷該款項！");
    } catch (err) {
      handleError(err, "操作失敗");
    }
  };

  // Mark request payment as settled
  const handleSettle = async (route, id) => {
    try {
      const res = await fetch(route + `/${id}/settle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("結清失敗");
      setStatus("已結清該款項！");
    } catch (err) {
      handleError(err, "結清失敗");
    }
  };

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
          <button onClick={() => loadPageData(PAGE_PENDING_REQUEST)} className="text-left hover:bg-teal-700 px-3 py-2 rounded">
            待審核請款
          </button>
          <button onClick={() => loadPageData(PAGE_DEALING_REQUEST)} className="text-left hover:bg-teal-700 px-3 py-2 rounded">
            待處理請款
          </button>
          <button onClick={() => loadPageData(PAGE_REQUEST_RECORD)} className="text-left hover:bg-teal-700 px-3 py-2 rounded">
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
        {activePage === PAGE_REQUEST_RECORD && (
          <>
          {/* Disbursement record */}
          <div>
            <h1 className="text-3xl font-bold mb-6">歷史請款紀錄</h1>
            <table className="w-full border-collapse">
              {disbursements.length > 0 ? (
              <>
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">品項</th>
                    <th className="p-3">金額</th>
                    <th className="p-3">結清時間</th>
                  </tr>
                </thead>
                <tbody>
                    {disbursements.map((rec) => (
                      <tr key={rec.id} className="border-b">
                        <td className="p-3">{rec.title}</td>
                        <td className="p-3">{rec.amount}</td>
                        <td className="p-3">{new Date(rec.settledAt).toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </>
              ) : (
                <tbody>
                  <tr>
                    <td className="p-3 text-center" colSpan="5">
                      尚無紀錄
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          </>
        )}

        {/* Logout confirm */}
        {showLogoutConfirm && (<LogoutConfirm setShowLogoutConfirm={setShowLogoutConfirm}/>)}
      </main>
    </div>
  );
}

export default ManagerDashboard;
