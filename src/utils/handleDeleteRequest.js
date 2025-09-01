// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';
const DISBURSEMENT_API_ROUTE = 'http://localhost:3000/api/disbursement';

export const handleDeleteReimbursement = async (id, token) => {
  try {
    const res = await fetch(REIMBURSEMENT_API_ROUTE + `/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("操作失敗");
  } catch (err) {
    throw err;
  }
}

export const handleDeleteBudget = async (id, token) => {
  try {
    const res = await fetch(BUDGET_API_ROUTE + `/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("操作失敗");
  } catch (err) {
    throw err;
  }
}