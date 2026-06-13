import { Routes, Route } from "react-router-dom"
import { AuthProvider, TenantProvider, UserProvider, BillingProvider } from "./contexts"
import { ToastContainer } from "./components/ui"

import Landing from "./pages/Landing"
import AdminLogin from "./pages/admin/AdminLogin"
import TenantLogin from "./pages/tenant/TenantLogin"

import AdminDashboard from "./pages/admin/AdminDashboard"
import TenantDashboard from "./pages/tenant/TenantDashboard"

import ProtectedRoute from "./components/common/ProtectedRoute"
import LoginGuard from "./components/common/LoginGuard"
import DashboardLayout from "./Layouts/DashboardLayout"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"

import TenantManagement from "./pages/admin/TenantManagement"
import TenantDetail from "./pages/admin/TenantDetail"
import UserManagement from "./pages/admin/UserManagement"
import BillingManagement from "./pages/admin/BillingManagement"
import AuditLogs from "./pages/admin/AuditLogs"

import TenantUsers from "./pages/tenant/TenantUsers"
import TenantBilling from "./pages/tenant/TenantBilling"

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <UserProvider>
          <BillingProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/admin-login" element={<LoginGuard role="admin"><AdminLogin /></LoginGuard>} />
        <Route path="/tenant-login" element={<LoginGuard role="tenant"><TenantLogin /></LoginGuard>} />

        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><DashboardLayout role="admin" /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="tenants" element={<TenantManagement />} />
          <Route path="tenants/:tenantId" element={<TenantDetail />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="billing" element={<BillingManagement />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/tenant-dashboard" element={<ProtectedRoute allowedRole="tenant"><DashboardLayout role="tenant" /></ProtectedRoute>}>
          <Route index element={<TenantDashboard />} />
          <Route path="users" element={<TenantUsers />} />
          <Route path="billing" element={<TenantBilling />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
          </BillingProvider>
        </UserProvider>
      </TenantProvider>
    </AuthProvider>
  )
}

export default App
