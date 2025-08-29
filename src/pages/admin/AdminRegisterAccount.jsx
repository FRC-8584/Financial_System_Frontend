import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function AdminRegisterAccount() {
  const { token } = useOutletContext();
  const [status, setStatus] = useState("");

  return (
  <div id="createReimbursement" class="tab-content active">
    <h1 className="text-3xl font-bold mb-6">註冊使用者</h1>
    <form onSubmit={handleReimbursementSubmit} className="space-y-4" encType="multipart/form-data">
      <div>
        <label className="block mb-1 font-semibold">用戶名稱：</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={reimbursementTitle}
          onChange={(e) => setReimbursementTitle(e.target.value)}
          required
          />
      </div>
      <div>
        <label className="block mb-1 font-semibold">電子郵件：</label>
        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={reimbursementAmount}
          onChange={(e) => setReimbursementAmount(e.target.value)}
          required
          />
      </div>
      <div>
        <label className="block mb-1 font-semibold">密碼：</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={reimbursementDescription}
          onChange={(e) => setReimbursementDescription(e.target.value)}
          />
      </div>
      <div>
        <label className="block mb-1 font-semibold">權限：</label>
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
  )
}

export default AdminRegisterAccount;