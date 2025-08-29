export const handleModifyRequestData = async (data, route, id, token) => {
  try {
    const res = await fetch(route + `/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("操作失敗");
  } catch (err) {
    throw err;
  }
}