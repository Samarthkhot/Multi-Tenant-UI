import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth, useApp } from "../../contexts"
import { Button } from "../../components/ui"

const AdminLogin = () => {
  const navigate = useNavigate()
  const { loginAdmin } = useAuth()
  const { addNotification } = useApp()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format"
    if (!password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const result = await loginAdmin(email, password)
    setLoading(false)

    if (result) {
      addNotification({ type: 'success', title: 'Welcome back!', message: `Logged in as ${result.name}` })
      navigate("/admin-dashboard")
    } else {
      setErrors({ auth: "Invalid admin credentials" })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 dark:via-indigo-500/50 to-transparent" />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl blur-xl opacity-20 dark:opacity-30" />
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl p-8 shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-800/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl shadow-indigo-500/30 animate-float">
                🧑‍💼
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enterprise system management portal</p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-amber-500 dark:text-amber-300 text-xs font-semibold">Test Credentials</p>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-mono">Email: <span className="text-slate-700 dark:text-slate-300">Samarth@gmail.com</span></p>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-mono">Password: <span className="text-slate-700 dark:text-slate-300">samarth123</span></p>
            </div>

            {errors.auth && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.auth}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 mb-1.5 block font-medium">Email Address</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-200"
                    placeholder="admin@company.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 mb-1.5 block font-medium">Password</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{errors.password}</p>}
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} icon="→" iconPosition="right">
                Sign In to Dashboard
              </Button>
            </form>

            <p className="text-center mt-6">
              <button onClick={() => navigate("/")} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm transition inline-flex items-center gap-1">
                ← Back to home
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
