export const handleDeleteRequestData = async (route, id, token) => {
  try {
    const res = await fetch(route + `/${id}/`, {
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