import { useNavigate } from "react-router-dom"
import { IconShield, IconLightning, IconGlobe, IconArrowRight } from "../components/ui/Icons"

const features = [
  { icon: <IconShield className="w-5 h-5" />, label: 'Enterprise Security' },
  { icon: <IconLightning className="w-5 h-5" />, label: 'Real-time Analytics' },
  { icon: <IconGlobe className="w-5 h-5" />, label: 'Multi-tenant Architecture' },
]

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 relative overflow-hidden px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 text-xs md:text-sm mb-5 md:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            Enterprise-Grade Management Platform
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-3 md:mb-4 tracking-tight leading-tight">
            Multi-Tenant
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 block mt-1 md:mt-2">Management System</span>
          </h1>
          <p className="text-sm md:text-lg text-slate-500 max-w-2xl mx-auto px-2">
            A comprehensive, enterprise-grade platform for managing multiple tenants,
            users, billing, and system operations from a single unified dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto px-2 sm:px-0">
          <div
            onClick={() => navigate("/admin-login")}
            className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 md:p-8 cursor-pointer
              hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-600/5 dark:to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3 md:mb-4 shadow-lg shadow-indigo-500/20">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                  <circle cx="12" cy="7" r="2" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">Admin Portal</h2>
              <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6 leading-relaxed">
                Manage tenants, users, billing, monitor analytics, and configure system settings.
              </p>
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold
                shadow-lg shadow-indigo-600/25 group-hover:shadow-xl group-hover:shadow-indigo-600/40 transition-all duration-300">
                <span>Enter Admin Portal</span>
                <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/tenant-login")}
            className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 md:p-8 cursor-pointer
              hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 dark:from-emerald-600/5 dark:to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-3 md:mb-4 shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">Tenant Portal</h2>
              <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6 leading-relaxed">
                View your dashboard, manage team members, track billing and payments.
              </p>
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold
                shadow-lg shadow-emerald-600/25 group-hover:shadow-xl group-hover:shadow-emerald-600/40 transition-all duration-300">
                <span>Enter Tenant Portal</span>
                <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto text-center px-2">
          {features.map((item, i) => (
            <div key={i} className="text-slate-600 dark:text-slate-500 text-xs md:text-sm flex flex-col items-center gap-1.5 md:gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-400">
                {item.icon}
              </div>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Landing
