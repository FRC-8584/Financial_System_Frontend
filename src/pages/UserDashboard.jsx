import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';
const DISBURSEMENT_API_ROUTE = 'http://localhost:3000/api/disbursement';

// Pages
const PAGE_CREATE_NEW_REQUEST = "createNewRequest";
const PAGE_MY_PENDING_REQUEST = "myPendingRequest";
const PAGE_MY_DEALING_REQUEST = "myDealingRequest";
const PAGE_MY_REQUEST = "myRequest";

// Tabs
const TAB_REIMBURSEMENT = "reimbursement";
const TAB_BUDGET = "budget";

function UserDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");// JWT token

  // Webside view configration
  const [page, setPage] = useState(PAGE_CREATE_NEW_REQUEST);
  const [activeTab, setActiveTab] = useState(TAB_REIMBURSEMENT);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Reimbursement request form
  const [reimbursementTitle, setReimbursementTitle] = useState("");
  const [reimbursementAmount, setReimbursementAmount] = useState("");
  const [reimbursementDescription, setReimbursementDescription] = useState("");
  const [reimbursementReceipt, setReimbursementReceipt] = useState(null);

  // Budget request form
  const [budgetTitle, setBudgetTitle] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetDescription, setBudgetDescription] = useState("");

  // Record selected request payment ids (Not use yet)
  // const [selectedIds, setSelectedIds] = useState([]);

  // Select request payment conditions
  const [selectRequirements, setSelectRequirements] = useState("");

  // Data of request payments
  const [reimbursements, setReimbursements] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Status
  const [status, setStatus] = useState("");

  // Initialize
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/");
  //   } else {
  //     fetchReimbursements();
  //     fetchBudgets();
  //   }
  // }, [token, navigate, selectRequirements]);

  // Get reimbursement records
  const fetchReimbursements = async () => {
    console.log(selectRequirements);
    try {
      const res = await fetch(REIMBURSEMENT_API_ROUTE + '/me' + selectRequirements.trim(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("載入紀錄失敗");
      const data = await res.json();
      setReimbursements(data);
    } catch (err) {
      console.error(err);
      setStatus("載入紀錄錯誤：" + err.message);
    }
  };

  // Get budget records
  const fetchBudgets = async () => {
    console.log(selectRequirements);
    try {
      const res = await fetch(BUDGET_API_ROUTE + '/me' + selectRequirements.trim(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("載入預算失敗");
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error(err);
      setStatus("載入預算錯誤：" + err.message);
    }
  };

  // Send reimbursement request
  const handleReimbursementSubmit = async (e) => {
    e.preventDefault();
    if (!reimbursementReceipt) {
      setStatus("請上傳單據圖片");
      return;
    }
    const formData = new FormData();
    formData.append("title", reimbursementTitle);
    formData.append("amount", reimbursementAmount);
    formData.append("description", reimbursementDescription);
    formData.append("receipt", reimbursementReceipt);

    try {
      const res = await fetch(REIMBURSEMENT_API_ROUTE + '/', {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("請款送出失敗");

      setStatus("款項已送出！");
      setReimbursementTitle("");
      setReimbursementAmount("");
      setReimbursementDescription("");
      setReimbursementReceipt(null);
      await fetchReimbursements();
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  // Send budget request
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(BUDGET_API_ROUTE + '/', {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}` ,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: budgetTitle,
          amount: budgetAmount,
          description: budgetDescription,
        }),
      });
      if (!res.ok) throw new Error("請款送出失敗");

      setStatus("款項已送出！");
      setBudgetTitle("");
      setBudgetAmount("");
      setBudgetDescription("");
      await fetchBudgets();
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Bar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">FRC8584 財務系統</h2>
        <nav className="flex flex-col space-y-2">
          {/* Create new request */}
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${page === PAGE_CREATE_NEW_REQUEST ? "bg-gray-800" : ""}`}
            onClick={() => setPage(PAGE_CREATE_NEW_REQUEST)}
          >
            新增請款
          </button>

          {/* My pending request */}
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${page === PAGE_MY_PENDING_REQUEST ? "bg-gray-800" : ""}`}
            onClick={() => {
              setSelectRequirements("?status=pending");
              setPage(PAGE_MY_PENDING_REQUEST);
            }}
          >
            審核中款項
          </button>

          {/* My dealing request */}
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${page === PAGE_MY_DEALING_REQUEST ? "bg-gray-800" : ""}`}
            onClick={() => {
              setSelectRequirements("?status=approved");
              setPage(PAGE_MY_DEALING_REQUEST);
            }}
          >
            處理中款項
          </button>

          {/* My request record */}
          <button
            className={`text-left px-3 py-2 rounded hover:bg-gray-800 ${page === PAGE_MY_REQUEST ? "bg-gray-800" : ""}`}
            onClick={() => {
              setSelectRequirements("");
              setPage(PAGE_MY_REQUEST);
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
        {page === PAGE_CREATE_NEW_REQUEST && (
          <>
          {/* Tab button */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-bold ${
                activeTab === TAB_REIMBURSEMENT ? "border-b-4 border-black-500 text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TAB_REIMBURSEMENT)}
            >
              新增報帳
            </button>
            <button
              className={`px-4 py-2 font-bold ${
                activeTab === TAB_BUDGET ? "border-b-4 border-black-500 text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TAB_BUDGET)}
            >
              新增申請經費
            </button>
          </div>

          {/* Tab of creating new reimbursement */}
          {activeTab === TAB_REIMBURSEMENT && (
          <div id="createReimbursement" class="tab-content active">
            <h1 className="text-3xl font-bold mb-6">新增報帳</h1>
            <form onSubmit={handleReimbursementSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block mb-1 font-semibold">品項：</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={reimbursementTitle}
                  onChange={(e) => setReimbursementTitle(e.target.value)}
                  required
                  />
              </div>
              <div>
                <label className="block mb-1 font-semibold">報帳金額：</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={reimbursementAmount}
                  onChange={(e) => setReimbursementAmount(e.target.value)}
                  required
                  />
              </div>
              <div>
                <label className="block mb-1 font-semibold">備註：</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={reimbursementDescription}
                  onChange={(e) => setReimbursementDescription(e.target.value)}
                  />
              </div>
              <div>
                <label className="block mb-1 font-semibold">發票或證明上傳：</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => setReimbursementReceipt(e.target.files[0])}
                  required
                  />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                送出款項
              </button>
            </form>
            {status && <p className="mt-4 text-sm">{status}</p>}
          </div>
          )}

          {/* Tab of creating new budget */}
          {activeTab === TAB_BUDGET && (
          <div id="createBudget" class="tab-content">
            <h1 className="text-3xl font-bold mb-6">新增申請經費</h1>
            <form onSubmit={handleBudgetSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block mb-1 font-semibold">品項：</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={budgetTitle}
                  onChange={(e) => setBudgetTitle(e.target.value)}
                  required
                  />
              </div>
              <div>
                <label className="block mb-1 font-semibold">申請金額：</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  required
                  />
              </div>
              <div>
                <label className="block mb-1 font-semibold">備註：</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={budgetDescription}
                  onChange={(e) => setBudgetDescription(e.target.value)}
                  />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                送出款項
              </button>
            </form>
            {status && <p className="mt-4 text-sm">{status}</p>}
          </div>
          )}
          </>
        )}

        {/* Page of my pending request */}
        {page === PAGE_MY_PENDING_REQUEST && (
          <>
          {/* Tab button */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-bold ${
                activeTab === TAB_REIMBURSEMENT ? "border-b-4 border-black-500 text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TAB_REIMBURSEMENT)}
            >
              審核中報帳款項
            </button>
            <button
              className={`px-4 py-2 font-bold ${
                activeTab === TAB_BUDGET ? "border-b-4 border-black-500 text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TAB_BUDGET)}
            >
              審核中申請經費款項
            </button>
          </div>

          {/* Tab of my pending reimbursement */}
          {activeTab === TAB_REIMBURSEMENT && (
          <div>
            <h1 className="text-3xl font-bold mb-6">我的報帳紀錄</h1>
            <table className="w-full border-collapse">
              {reimbursements.length > 0 ? (
                <>
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3">品項</th>
                      <th className="p-3">金額</th>
                      <th className="p-3">狀態</th>
                      <th className="p-3">申請時間</th>
                      <th className="p-3">單據</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reimbursements.map((rec) => (
                      <tr key={rec.id} className="border-b">
                        <td className="p-3">{rec.title}</td>
                        <td className="p-3">{rec.amount}</td>
                        <td className="p-3">{rec.status}</td>
                        <td className="p-3">{new Date(rec.createdAt).toLocaleString()}</td>
                        <td className="p-3">
                          <a
                            href={rec.receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-black underline"
                          >
                            查看
                          </a>
                        </td>
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
          )}

          {/* Tab of my pending budget */}
          {activeTab === TAB_BUDGET && (
          <div>
            <h1 className="text-3xl font-bold mb-6">我的申請經費紀錄</h1>
            <table className="w-full border-collapse">
              {budgets.length > 0 ? (
              <>
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">品項</th>
                    <th className="p-3">金額</th>
                    <th className="p-3">狀態</th>
                    <th className="p-3">申請時間</th>
                  </tr>
                </thead>
                <tbody>
                    {budgets.map((rec) => (
                      <tr key={rec.id} className="border-b">
                        <td className="p-3">{rec.title}</td>
                        <td className="p-3">{rec.amount}</td>
                        <td className="p-3">{rec.status}</td>
                        <td className="p-3">{new Date(rec.createdAt).toLocaleString()}</td>
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
          )}
          </>
        )}

        {/* Page of my dealing request */}
        {page === PAGE_MY_DEALING_REQUEST && (
          <>
          {/* Tab button */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-bold ${
                activeTab === TAB_REIMBURSEMENT ? "border-b-4 border-black-500 text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TAB_REIMBURSEMENT)}
            >
              處理中報帳款項
            </button>
            <button
              className={`px-4 py-2 font-bold ${
                activeTab === TAB_BUDGET ? "border-b-4 border-black-500 text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TAB_BUDGET)}
            >
              處理中申請經費款項
            </button>
          </div>

          {/* Tab of my dealing reimbursement */}
          {activeTab === TAB_REIMBURSEMENT && (
          <div>
            <h1 className="text-3xl font-bold mb-6">我的報帳紀錄</h1>
            <table className="w-full border-collapse">
              {reimbursements.length > 0 ? (
                <>
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3">品項</th>
                      <th className="p-3">金額</th>
                      <th className="p-3">狀態</th>
                      <th className="p-3">申請時間</th>
                      <th className="p-3">單據</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reimbursements.map((rec) => (
                      <tr key={rec.id} className="border-b">
                        <td className="p-3">{rec.title}</td>
                        <td className="p-3">{rec.amount}</td>
                        <td className="p-3">{rec.status}</td>
                        <td className="p-3">{new Date(rec.createdAt).toLocaleString()}</td>
                        <td className="p-3">
                          <a
                            href={rec.receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-black underline"
                          >
                            查看
                          </a>
                        </td>
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
          )}

          {/* Tab of my dealing budget */}
          {activeTab === TAB_BUDGET && (
          <div>
            <h1 className="text-3xl font-bold mb-6">我的申請經費紀錄</h1>
            <table className="w-full border-collapse">
              {budgets.length > 0 ? (
              <>
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">品項</th>
                    <th className="p-3">金額</th>
                    <th className="p-3">狀態</th>
                    <th className="p-3">申請時間</th>
                  </tr>
                </thead>
                <tbody>
                    {budgets.map((rec) => (
                      <tr key={rec.id} className="border-b">
                        <td className="p-3">{rec.title}</td>
                        <td className="p-3">{rec.amount}</td>
                        <td className="p-3">{rec.status}</td>
                        <td className="p-3">{new Date(rec.createdAt).toLocaleString()}</td>
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
          )}
          </>
        )}

        {/* Page of my request */}
        {page === PAGE_MY_REQUEST && (
          <>
          {/* Tab button */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-bold ${
                activeTab === TAB_REIMBURSEMENT ? "border-b-4 border-black-500 text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TAB_REIMBURSEMENT)}
            >
              報帳紀錄
            </button>
            <button
              className={`px-4 py-2 font-bold ${
                activeTab === TAB_BUDGET ? "border-b-4 border-black-500 text-black-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(TAB_BUDGET)}
            >
              申請經費紀錄
            </button>
          </div>

          {/* Tab of my reimbursement */}
          {activeTab === TAB_REIMBURSEMENT && (
          <div>
            <h1 className="text-3xl font-bold mb-6">我的報帳紀錄</h1>
            <table className="w-full border-collapse">
              {reimbursements.length > 0 ? (
                <>
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3">品項</th>
                      <th className="p-3">金額</th>
                      <th className="p-3">狀態</th>
                      <th className="p-3">申請時間</th>
                      <th className="p-3">單據</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reimbursements.map((rec) => (
                      <tr key={rec.id} className="border-b">
                        <td className="p-3">{rec.title}</td>
                        <td className="p-3">{rec.amount}</td>
                        <td className="p-3">{rec.status}</td>
                        <td className="p-3">{new Date(rec.createdAt).toLocaleString()}</td>
                        <td className="p-3">
                          <a
                            href={rec.receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-black underline"
                          >
                            查看
                          </a>
                        </td>
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
          )}

          {/* Tab of my budget */}
          {activeTab === TAB_BUDGET && (
          <div>
            <h1 className="text-3xl font-bold mb-6">我的申請經費紀錄</h1>
            <table className="w-full border-collapse">
              {budgets.length > 0 ? (
              <>
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">品項</th>
                    <th className="p-3">金額</th>
                    <th className="p-3">狀態</th>
                    <th className="p-3">申請時間</th>
                  </tr>
                </thead>
                <tbody>
                    {budgets.map((rec) => (
                      <tr key={rec.id} className="border-b">
                        <td className="p-3">{rec.title}</td>
                        <td className="p-3">{rec.amount}</td>
                        <td className="p-3">{rec.status}</td>
                        <td className="p-3">{new Date(rec.createdAt).toLocaleString()}</td>
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
          )}
          </>
        )}

        {/* Logout confirm */}
        {showLogoutConfirm && (
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
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
        )}
      </main>
    </div>
  );
}

export default UserDashboard;