import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CreateRequestPage } from "../user/CreateRequestPage";
import { MyPendingRequestPage } from "../user/MyPendingRequestPage";
import { MyDealingRequestPage } from "../user/MyDealingRequestPage";
import { MyRequestRecordPage } from "../user/MyRequestRecordPage";

import { LogoutConfirm } from "../../components/LogoutConfirm";
// Pages
const PAGE_CREATE_NEW_REQUEST = "createNewRequest";
const PAGE_MY_PENDING_REQUEST = "myPendingRequest";
const PAGE_MY_DEALING_REQUEST = "myDealingRequest";
const PAGE_MY_REQUEST_RECORD = "myRequestRecord";

function UserDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");// JWT token

  // Webside view configration
  const [activePage, setActivePage] = useState(PAGE_CREATE_NEW_REQUEST);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Status (Not use)
  // const [status, setStatus] = useState("");

  // Initialize
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Bar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">FRC8584 財務系統</h2>
        <nav className="flex flex-col space-y-2">
          {/* Create new request */}
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${activePage === PAGE_CREATE_NEW_REQUEST ? "bg-gray-800" : ""}`}
            onClick={() => setActivePage(PAGE_CREATE_NEW_REQUEST)}
          >
            新增請款
          </button>

          {/* My pending request */}
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${activePage === PAGE_MY_PENDING_REQUEST ? "bg-gray-800" : ""}`}
            onClick={() => {
              setActivePage(PAGE_MY_PENDING_REQUEST);
            }}
          >
            審核中款項
          </button>

          {/* My dealing request */}
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${activePage === PAGE_MY_DEALING_REQUEST ? "bg-gray-800" : ""}`}
            onClick={() => {
              setActivePage(PAGE_MY_DEALING_REQUEST);
            }}
          >
            處理中款項
          </button>

          {/* My request record */}
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${activePage === PAGE_MY_REQUEST_RECORD ? "bg-gray-800" : ""}`}
            onClick={() => {
              setActivePage(PAGE_MY_REQUEST_RECORD);
            }}
          >
            我的請款紀錄
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
        {/* Page of creating new request */}
        {activePage === PAGE_CREATE_NEW_REQUEST && (<CreateRequestPage token={token}/>)}

        {/* Page of my pending request */}
        {activePage === PAGE_MY_PENDING_REQUEST && (<MyPendingRequestPage token={token}/>)}

        {/* Page of my dealing request */}
        {activePage === PAGE_MY_DEALING_REQUEST && (<MyDealingRequestPage token={token}/>)}

        {/* Page of my request */}
        {activePage === PAGE_MY_REQUEST_RECORD && (<MyRequestRecordPage token={token}/>)}

        {/* Logout confirm */}
        {showLogoutConfirm && (<LogoutConfirm setShowLogoutConfirm={setShowLogoutConfirm}/>)}
      </main>
    </div>
  );
}

export default UserDashboard;