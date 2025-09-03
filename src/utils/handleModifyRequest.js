// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';
const DISBURSEMENT_API_ROUTE = 'http://localhost:3000/api/disbursement';

export const handleModifyReimbursement = async (data, id, token) => {
  try {
    const res = await fetch(REIMBURSEMENT_API_ROUTE + `/${id}/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });
    if (!res.ok) throw new Error("操作失敗");
    return (await res.json()).result;
  } catch (err) {
    throw err;
  }
}

export const handleModifyBudget = async (data, id, token) => {
  try {
    const res = await fetch(BUDGET_API_ROUTE + `/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("操作失敗");
    return (await res.json()).result;
  } catch (err) {
    throw err;
  }
}