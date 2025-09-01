// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';
const DISBURSEMENT_API_ROUTE = 'http://localhost:3000/api/disbursement';

// Get reimbursement records
export const fetchReimbursements = async ({ setReimbursements, param = '', token }, isMy = false) => {
  try {
    const res = await fetch(REIMBURSEMENT_API_ROUTE + (isMy ? '/me' : '/') + param.trim(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("載入報帳款項失敗");
    setReimbursements(await res.json());
  } catch (err) {
    throw err;
  }
};

// Get budget records
export const fetchBudgets = async ({ setBudgets, param = '', token }, isMy = false) => {
  try {
    const res = await fetch(BUDGET_API_ROUTE + (isMy ? '/me' : '/') + param.trim(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("載入申請經費款項失敗");
    setBudgets(await res.json());
  } catch (err) {
    throw err;
  }
};

// Get disbursement records
export const fetchDisbursements = async ({ setDisbursements, param = '', token }) => {
  try {
    const res = await fetch(DISBURSEMENT_API_ROUTE + '/' + param.trim(), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("載入請款紀錄失敗");
    setDisbursements(await res.json());
  } catch (err) {
    throw err;
  }
};