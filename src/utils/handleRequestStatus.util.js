// Mark request payment as approved or rejected
export const handleVerify = async (route, id, status, token) => {
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
  } catch (err) {
    throw err;
  }
};

// Mark request payment as settled
export const handleSettle = async (route, id, token) => {
  try {
    const res = await fetch(route + `/${id}/settle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("結清失敗");
  } catch (err) {
    throw err;
  }
};