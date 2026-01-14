import { Routes, Route } from "react-router-dom"

import Landing from "./pages/Landing"
import AdminLogin from "./pages/admin/AdminLogin"
import TenantLogin from "./pages/tenant/TenantLogin"

import AdminDashboard from "./pages/admin/AdminDashboard"
import TenantDashboard from "./pages/tenant/TenantDashboard"

import ProtectedRoute from "./components/common/ProtectedRoute"
import LoginGuard from "./components/common/LoginGuard"
import DashboardLayout from "./layouts/DashboardLayout"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"


function App() {
  return (
    <Routes>

      {/* Landing */}
      <Route path="/" element={<Landing />} />

      {/* Login Routes */}
      <Route
        path="/admin-login"
        element={
          <LoginGuard role="admin">
            <AdminLogin />
          </LoginGuard>
        }
      />

      <Route
        path="/tenant-login"
        element={
          <LoginGuard role="tenant">
            <TenantLogin />
          </LoginGuard>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Tenant Dashboard */}
      <Route
        path="/tenant-dashboard"
        element={
          <ProtectedRoute allowedRole="tenant">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TenantDashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

    </Routes>
  )
}

export default App
