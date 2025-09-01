import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Form from "../../components/form/Form.jsx";
import InputField from "../../components/form/InputField.jsx";
import SubmitButton from "../../components/form/SubmitButton.jsx";
import { handleRegister } from "../../utils/handleUserData.js";
import PageLayout from "../../components/layout/pages/PageLayout.jsx";

function AdminRegisterAccount() {
  const { token } = useOutletContext();
  const [status, setStatus] = useState("");

  const [userProfileForm, setUserProfileForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const handleChange = (setter) => (e) => {
    const { name, value, files } = e.target;

    setter((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRegisterationSubmit = async (e) => {
    e.preventDefault();
    if (!userProfileForm.name) {
      setStatus("請輸入名稱");
      return;
    }
    if (!userProfileForm.email) {
      setStatus("請輸入電子郵件");
      return;
    }
    if (!userProfileForm.password) {
      setStatus("請輸入密碼");
      return;
    }

    try {
      await handleRegister(userProfileForm, token)
      setStatus("已成功註冊！");
      setUserProfileForm({ name: "", email: "", password: "", role: null });
    } catch (err) {
      setStatus("錯誤：" + err.message);
    }
  };

  return (
  <PageLayout title={"註冊使用者"}>
    <Form onSubmit={handleRegisterationSubmit}>
      <InputField
        label="使用者名稱"
        type="text"
        name="name"
        value={userProfileForm.name}
        onChange={handleChange(setUserProfileForm)}
      />
      <InputField
        label="電子郵件地址"
        type="email"
        name="email"
        value={userProfileForm.email}
        onChange={handleChange(setUserProfileForm)}
      />
      <InputField
        label="密碼"
        type="password"
        name="password"
        value={userProfileForm.password}
        onChange={handleChange(setUserProfileForm)}
      />
      <label className="font-semibold">權限</label>
      <select
        name="role"
        value={userProfileForm.role}
        onChange={handleChange(setUserProfileForm)}
        className="border p-2 w-full rounded-lg"
      >
        <option value="member">一般成員</option>
        <option value="manager">財務管理員</option>
        <option value="admin">管理員</option>
      </select>
      <SubmitButton text="註冊用戶" />
    </Form>
    {status && <p className="mt-4 text-sm">{status}</p>}
  </PageLayout>
  );
}

export default AdminRegisterAccount;