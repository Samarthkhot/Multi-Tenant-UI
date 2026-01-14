import StatCard from "../../components/ui/StatCard"

const stats = [
  {
    title: "Total Tenants",
    value: "120",
    progress: 80,
    icon: "🏢",
  },
  {
    title: "Active Users",
    value: "540",
    progress: 65,
    icon: "👥",
  },
  {
    title: "Revenue",
    value: "1200000",
    progress: 90,
    icon: "💰",
  },
  {
    title: "System Health",
    value: "99",
    progress: 99,
    icon: "⚡",
  },
]

const AdminDashboard = () => {
  const role = localStorage.getItem("role")

  return (
    <div className="space-y-10">

      {/* 🌈 Header Banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-10
        bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
        text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-2 tracking-wide">
            Welcome {role} 👋
          </h2>

          <p className="text-white/80 max-w-xl">
            Manage tenants, track revenue and monitor system health from your
            centralized dashboard.
          </p>
        </div>

        {/* Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
      </div>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <StatCard
              title={item.title}
              value={item.value}
              progress={item.progress}
              icon={item.icon}
            />
          </div>
        ))}
      </div>

      {/* 💡 Info Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white/80 dark:bg-slate-800 rounded-2xl p-6 border dark:border-slate-700 shadow-sm">
          <h3 className="font-semibold mb-2">📈 Growth</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            User registrations increased by 12% compared to last week.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800 rounded-2xl p-6 border dark:border-slate-700 shadow-sm">
          <h3 className="font-semibold mb-2">🛡 Security</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            All security checks passed. No suspicious activity detected.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800 rounded-2xl p-6 border dark:border-slate-700 shadow-sm">
          <h3 className="font-semibold mb-2">⚙ Maintenance</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Scheduled maintenance planned for tomorrow at 2:00 AM.
          </p>
        </div>

      </div>

    </div>
  )
}

export default AdminDashboard
