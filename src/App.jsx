import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserTools from "./pages/User/UserTools";
import CreateRequest from "./pages/User/CreateRequest";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserTools />} />
      <Route path="/create-request" element={<CreateRequest />}/>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;