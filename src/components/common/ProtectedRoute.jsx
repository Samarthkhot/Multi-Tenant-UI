import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children, allowedRole }) => {
  const location = useLocation()
  const role = localStorage.getItem("role")

  // Not logged in
  if (!role) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Wrong role
  if (role !== allowedRole) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
