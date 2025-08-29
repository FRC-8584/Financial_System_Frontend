import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";

// Dashboard
import UserDashboard from "./pages/dashboards/UserDashboard.jsx";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard.jsx";
import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";

import UserRequestRecord from "./pages/user/UserRequestRecord.jsx"
import UserCreateRequest from "./pages/user/UserCreateRequest.jsx"
import UserPendingRequest from "./pages/user/UserPendingRequest.jsx"
import UserDealingRequest from "./pages/user/UserDealingRequest.jsx"

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* User Dashboard */}
      <Route path="/user-dashboard" element={<UserDashboard />}>
        <Route index element={<UserRequestRecord />} />
        <Route path="requestRecord" element={<UserRequestRecord />} />
        <Route path="createRequest" element={<UserCreateRequest />} />
        <Route path="pendingRequest" element={<UserPendingRequest />} />
        <Route path="dealingRequest" element={<UserDealingRequest />} />
      </Route>

      {/* Manager Dashboard */}
      <Route path="/manager-dashboard" element={<ManagerDashboard />}>
        {/* <Route path="requestRecord" element={<ManagerRequestRecord />} />
        <Route path="pendingRequest" element={<ManagerPendingRequest />} />
        <Route path="dealingRequest" element={<ManagerDealingRequest />} /> */}
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin-dashboard" element={<AdminDashboard />}>
        {/* <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} /> */}
      </Route>
    </Routes>
  );
}

export default App;