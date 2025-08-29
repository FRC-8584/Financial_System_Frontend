// Server API routes
const USER_API_ROUTE = 'http://localhost:3000/api/user';

export const handleRegister = async (data, token) => {
  try {
    const res = await fetch(USER_API_ROUTE + '/', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("註冊失敗");
  } catch (err) {
    throw err;
  }
}

export const fetchAllUsersProfile = async ({ setUsersProfile, token }, param='') => {
  try {
    const res = await fetch(USER_API_ROUTE + '/' + param.trim(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("載入失敗");
    setUsersProfile(await res.json());
  } catch (err) {
    throw err;
  }
};

export const fetchMyProfile = async ({ setMyProfile, token }) => {
  try {
    const res = await fetch(USER_API_ROUTE + '/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("載入失敗");
    setMyProfile(await res.json());
  } catch (err) {
    throw err;
  }
};