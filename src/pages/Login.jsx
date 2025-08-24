import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("登入失敗");

      const data = await response.json();         // 假設 data = { token: "xxxxx" }
      const token = data.token;

      if (!token) throw new Error("後端未回傳 token");

      const decoded = jwtDecode(token);          // 解碼 JWT
      const role = decoded.role;

      if (!role) throw new Error("token 中沒有 role");

      // 儲存 token
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // 根據角色導頁
      setStatus("✅ 登入成功，導向中...");
      setTimeout(() => {
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "manager") navigate("/manager-dashboard");
        else navigate("/user-dashboard");
      }, 1000);
    } catch (err) {
      setStatus("❌ " + err.message);
    }
  };

  return (
    <div className="w-96 mx-auto mt-20 bg-white p-8 shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Financial-system</h2>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">your email</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="請輸入帳號"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">密碼</label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="請輸入密碼"
        />
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        onClick={handleLogin}
      >
        登入
      </button>

      <p className="mt-4 text-center text-sm text-gray-700">{status}</p>
    </div>
  );
}

export default Login;
