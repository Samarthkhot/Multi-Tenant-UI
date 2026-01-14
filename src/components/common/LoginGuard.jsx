import { Navigate } from "react-router-dom"

const LoginGuard = ({ children, role }) => {
  const currentRole = localStorage.getItem("role")

  if (currentRole === role) {
    return (
      <Navigate
        to={role === "admin" ? "/admin-dashboard" : "/tenant-dashboard"}
        replace
      />
    )
  }

  return children
}

export default LoginGuard
