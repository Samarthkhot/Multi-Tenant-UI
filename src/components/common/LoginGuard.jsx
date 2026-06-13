import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts"

const LoginGuard = ({ children, role }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  if (isAuthenticated) {
    const session = JSON.parse(localStorage.getItem('mt_session') || '{}')
    if (session.role === role) {
      return <Navigate to={role === "admin" ? "/admin-dashboard" : "/tenant-dashboard"} replace />
    }
  }

  return children
}

export default LoginGuard
