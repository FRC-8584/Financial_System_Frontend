// Server API routes
const BUDGET_API_ROUTE = 'http://localhost:3000/api/budget';
const REIMBURSEMENT_API_ROUTE = 'http://localhost:3000/api/reimbursement';

export const submitReimbursement = async (token, data) => {
  try {
    const res = await fetch(REIMBURSEMENT_API_ROUTE + '/', {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });

    if (!res.ok) throw new Error("報帳送出失敗");
    return await res.json();
  } catch (err) {
    throw err;
  }
};

export const submitBudget = async (token, data) => {
  try {
    const res = await fetch(BUDGET_API_ROUTE  + '/', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("經費申請送出失敗");
    return await res.json();
  } catch (err) {
    throw err;
  }
};
