import { useEffect } from "react"
import { useAuth, useTenants, useUsers, useBilling } from "../../contexts"
import { Card, Button, StatusBadge } from "../../components/ui"
import { StatCardSkeleton } from "../../components/ui"
import { useNavigate } from "react-router-dom"
import { IconUsers, IconBilling, IconLightning, IconDashboard, IconAudit, IconSettings } from "../../components/ui/Icons"

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { tenants, stats: tenantStats, fetchTenants } = useTenants()
  const { stats: userStats, fetchUsers } = useUsers()
  const { stats: billingStats, fetchInvoices } = useBilling()

  useEffect(() => {
    fetchTenants()
    fetchUsers()
    fetchInvoices()
  }, [fetchTenants, fetchUsers, fetchInvoices])

  if (!tenantStats) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="h-32 md:h-40 rounded-2xl bg-slate-200 dark:bg-slate-800/50 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  const statCards = [
    { label: "Total Tenants", value: tenantStats.total.toString(), icon: <IconDashboard className="w-6 h-6" />, color: "from-indigo-500 to-purple-600", progress: (tenantStats.active / tenantStats.total) * 100 },
    { label: "Active Users", value: userStats?.total?.toString() || "0", icon: <IconUsers className="w-6 h-6" />, color: "from-blue-500 to-cyan-500", progress: userStats ? (userStats.active / userStats.total) * 100 : 0 },
    { label: "Revenue", value: `$${(billingStats?.totalRevenue || 0).toLocaleString()}`, icon: <IconBilling className="w-6 h-6" />, color: "from-emerald-500 to-teal-500", progress: billingStats ? (billingStats.paid / billingStats.total) * 100 : 0 },
    { label: "System Health", value: "99.9%", icon: <IconLightning className="w-6 h-6" />, color: "from-amber-500 to-orange-500", progress: 99 },
  ]

  const recentTenants = tenants.slice(0, 5)

  const quickActions = [
    { label: 'Manage Tenants', icon: <IconDashboard className="w-4 h-4" />, path: 'tenants' },
    { label: 'Manage Users', icon: <IconUsers className="w-4 h-4" />, path: 'users' },
    { label: 'View Billing', icon: <IconBilling className="w-4 h-4" />, path: 'billing' },
    { label: 'Audit Logs', icon: <IconAudit className="w-4 h-4" />, path: 'audit' },
  ]

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-5 md:p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-10 -right-10 w-40 md:w-60 h-40 md:h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-24 md:w-40 h-24 md:h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-xl md:text-3xl font-extrabold mb-1 md:mb-2 tracking-tight">
            Welcome back, {user?.name || 'Admin'}
          </h2>
          <p className="text-white/70 md:text-white/80 text-xs md:text-sm max-w-xl leading-relaxed">
            Your ecosystem is running smoothly. {tenantStats.active} active tenants, {userStats?.active || 0} active users, and ${(billingStats?.totalRevenue || 0).toLocaleString()} in revenue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {statCards.map((stat, i) => (
          <Card key={i} glow className="relative overflow-hidden !p-4 md:!p-6">
            <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider truncate">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 md:mt-1 truncate">{stat.value}</p>
              </div>
              <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                {stat.icon}
              </div>
            </div>
            <div className="h-1 md:h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(stat.progress, 100)}%` }} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2 !p-4 md:!p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">Recent Tenants</h3>
            <Button variant="ghost" size="xs" className="text-xs" onClick={() => navigate('tenants')}>
              View All →
            </Button>
          </div>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left pb-2 md:pb-3 px-4 md:px-0 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left pb-2 md:pb-3 px-4 md:px-0 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                  <th className="text-left pb-2 md:pb-3 px-4 md:px-0 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Users</th>
                  <th className="text-left pb-2 md:pb-3 px-4 md:px-0 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                {recentTenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition cursor-pointer" onClick={() => navigate(`tenants/${t.id}`)}>
                    <td className="py-2 md:py-3 px-4 md:px-0">
                      <p className="font-medium text-slate-900 dark:text-white text-xs md:text-sm truncate max-w-[120px] md:max-w-none">{t.name}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">{t.id}</p>
                    </td>
                    <td className="py-2 md:py-3 px-4 md:px-0"><StatusBadge status={t.plan} /></td>
                    <td className="py-2 md:py-3 px-4 md:px-0 text-slate-500 dark:text-slate-400 text-xs md:text-sm">{t.usersCount}</td>
                    <td className="py-2 md:py-3 px-4 md:px-0"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-3 md:space-y-4">
          <Card className="!p-4 md:!p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base mb-3 md:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 md:gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-2 md:gap-3 px-3 py-2.5 md:py-2.5 rounded-xl text-xs md:text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
                >
                  <span className="flex-shrink-0">{action.icon}</span>
                  <span className="truncate">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="!p-4 md:!p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base mb-3 md:mb-4">Plan Distribution</h3>
            <div className="space-y-2 md:space-y-3">
              {[
                { label: 'Enterprise', count: tenantStats.enterprise, color: 'bg-amber-500', total: tenantStats.total },
                { label: 'Business', count: tenantStats.business, color: 'bg-blue-500', total: tenantStats.total },
                { label: 'Starter', count: tenantStats.starter, color: 'bg-slate-500', total: tenantStats.total },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs md:text-sm mb-0.5 md:mb-1">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="h-1 md:h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(item.count / item.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
