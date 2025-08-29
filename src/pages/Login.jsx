import React, { useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

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

      const data = await response.json(); // data = { token: "xxxxx" }
      const token = data.token;

      if (!token) throw new Error("後端未回傳 token");

      const decoded = jwtDecode(token); // Decode JWT
      const role = decoded.role;

      if (!role) throw new Error("token 中沒有 role");

      // 儲存 token
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

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
    <div className="login-container">
      <h2 className="login-title">FRC8584 財務系統</h2>

      <div className="login-field">
        <label>電子郵件</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="請輸入電子郵件"
        />
      </div>

      <div className="login-field">
        <label>密碼</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="請輸入密碼"
        />
      </div>

      <button className="login-button" onClick={handleLogin}>
        登入
      </button>

      <p className="login-status">{status}</p>
    </div>
  );
}

export default Login;