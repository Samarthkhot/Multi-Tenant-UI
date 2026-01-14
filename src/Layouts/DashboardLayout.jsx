import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("role")
    localStorage.removeItem("tenantId")
    localStorage.removeItem("theme")
    navigate("/")
  }

  // Sidebar link styling
  const navClass = ({ isActive }) =>
    `block px-3 py-2 rounded transition
     text-slate-700 dark:text-slate-200
     hover:bg-slate-200 dark:hover:bg-slate-700
     ${
       isActive
         ? "bg-slate-300 dark:bg-slate-600 font-semibold"
         : "bg-transparent"
     }`

  // Dynamic header title based on route
  const getTitle = () => {
    if (location.pathname.includes("profile")) return "Profile"
    if (location.pathname.includes("settings")) return "Settings"
    return "Dashboard"
  }

  return (
    <div className="h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <div className="flex h-full">

        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 h-screen w-64
          bg-white dark:bg-slate-800
          border-r border-slate-200 dark:border-slate-700
          p-4 z-50 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
        >
          <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">
            Tekno Tantra
          </h2>

          <nav className="space-y-2">

            <NavLink
                to=""
                end
                onClick={() => setOpen(false)}
                className={navClass}
            >
                <span className="mr-2">📊</span>
                Dashboard
            </NavLink>

            <NavLink
                to="profile"
                onClick={() => setOpen(false)}
                className={navClass}
            >
                <span className="mr-2">👤</span>
                Profile
            </NavLink>

            <NavLink
                to="settings"
                onClick={() => setOpen(false)}
                className={navClass}
            >
                <span className="mr-2">⚙️</span>
                Settings
            </NavLink>

            <button
                onClick={handleLogout}
                className="w-full flex items-center text-left px-3 py-2 rounded
                hover:bg-red-600/20 text-red-500 transition"
            >
                <span className="mr-2">🚪</span>
                Logout
            </button>

            </nav>

        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col">

          {/* Header */}
          <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>

            {/* ✅ Dynamic title */}
            <h1 className="font-semibold">{getTitle()}</h1>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
