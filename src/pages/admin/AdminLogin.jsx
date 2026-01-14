import { useState } from "react"
import { useNavigate } from "react-router-dom"

const AdminLogin = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})

  const validate = () => {
    let newErrors = {}

    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format"

    if (!password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    localStorage.setItem("role", "admin")
    navigate("/admin-dashboard")
  }

  const isFormValid =
    email && password && /\S+@\S+\.\S+/.test(email)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md text-white">

        <h2 className="text-3xl font-bold mb-2 text-center">
          Admin Login 🔐
        </h2>

        <p className="text-center text-white/70 mb-8">
          Sign in to access your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-white/80">
              Email Address
            </label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30
              placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-300 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-white/80">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30
              placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-300 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            disabled={!isFormValid}
            className={`w-full py-3 rounded-lg font-semibold transition
              ${
                isFormValid
                  ? "bg-white text-purple-700 hover:bg-purple-600 hover:text-white"
                  : "bg-white/30 cursor-not-allowed"
              }`}
          >
            Login →
          </button>

        </form>

      </div>
    </div>
  )
}

export default AdminLogin
