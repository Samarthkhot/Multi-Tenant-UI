import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth, useApp } from "../contexts"
import { Avatar } from "../components/ui"
import { IconDashboard, IconUsers, IconBilling, IconAudit, IconSettings, IconProfile, IconLogout, IconTenant } from "../components/ui/Icons"

const adminNav = [
  { to: "", end: true, label: "Dashboard", icon: <IconDashboard className="w-5 h-5" /> },
  { to: "tenants", label: "Tenants", icon: <IconTenant className="w-5 h-5" /> },
  { to: "users", label: "Users", icon: <IconUsers className="w-5 h-5" /> },
  { to: "billing", label: "Billing", icon: <IconBilling className="w-5 h-5" /> },
  { to: "audit", label: "Audit Logs", icon: <IconAudit className="w-5 h-5" /> },
  { to: "settings", label: "Settings", icon: <IconSettings className="w-5 h-5" /> },
  { to: "profile", label: "Profile", icon: <IconProfile className="w-5 h-5" /> },
]

const tenantNav = [
  { to: "", end: true, label: "Dashboard", icon: <IconDashboard className="w-5 h-5" /> },
  { to: "users", label: "Team", icon: <IconUsers className="w-5 h-5" /> },
  { to: "billing", label: "Billing", icon: <IconBilling className="w-5 h-5" /> },
  { to: "settings", label: "Settings", icon: <IconSettings className="w-5 h-5" /> },
  { to: "profile", label: "Profile", icon: <IconProfile className="w-5 h-5" /> },
]

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const { sidebarOpen, setSidebar, theme, toggleTheme } = useApp()

  const navigation = role === 'admin' ? adminNav : tenantNav

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getTitle = () => {
    const path = location.pathname
    const navItem = navigation.find(n => {
      if (n.end) return path.endsWith(role === 'admin' ? '/admin-dashboard' : '/tenant-dashboard')
      return path.includes(n.to)
    })
    return navItem?.label || "Dashboard"
  }

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? role === 'admin'
          ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm'
          : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
    }`

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-hidden">
      {sidebarOpen && (
        <div onClick={() => setSidebar(false)} className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden" />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 md:w-72
        bg-white dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800/50
        flex flex-col transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-base font-bold text-white flex-shrink-0 ${
              role === 'admin'
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
            }`}>
              {role === 'admin' ? 'A' : 'T'}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white leading-tight truncate">
                {role === 'admin' ? 'Admin Console' : 'Tenant Portal'}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {role === 'admin' ? 'System Management' : (user?.tenantName || 'Dashboard')}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebar(false)}
              className={navClass}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800/50 space-y-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm
              text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200"
          >
            <span className="text-lg flex-shrink-0">{theme === 'light' ? '🌙' : '☀️'}</span>
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm
              text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
          >
            <IconLogout className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/50 px-3 md:px-6 py-2.5 md:py-3 flex items-center justify-between gap-3 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button
              onClick={() => setSidebar(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400 flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base md:text-lg font-semibold text-slate-800 dark:text-white truncate">{getTitle()}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 truncate max-w-[150px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="truncate">{user?.name || user?.email || 'Online'}</span>
            </div>
            <Avatar name={user?.name} email={user?.email} size="sm" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
