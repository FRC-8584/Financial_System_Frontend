// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';

// Get reimbursement records
export const fetchReimbursements = async ({ setReimbursements, token }, isMy, param='') => {
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
export const fetchBudgets = async ({ setBudgets, token }, isMy, param='') => {
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