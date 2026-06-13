import { useEffect } from "react"
import { useAuth, useBilling, useUsers } from "../../contexts"
import { Card, StatusBadge, Button } from "../../components/ui"
import { useNavigate } from "react-router-dom"
import { IconUsers, IconBilling, IconDashboard, IconCheck } from "../../components/ui/Icons"

const TenantDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { tenantSummary, fetchInvoices } = useBilling()
  const { users, fetchUsers } = useUsers()

  useEffect(() => {
    if (user?.tenantId) {
      fetchInvoices(user.tenantId)
      fetchUsers(user.tenantId)
    }
  }, [user?.tenantId, fetchInvoices, fetchUsers])

  const statCards = [
    { label: "Team Members", value: users.length.toString(), icon: <IconUsers className="w-6 h-6" />, color: "from-blue-500 to-cyan-500" },
    { label: "Total Billed", value: `$${tenantSummary?.totalBilled?.toLocaleString() || '0'}`, icon: <IconBilling className="w-6 h-6" />, color: "from-emerald-500 to-teal-500" },
    { label: "Outstanding", value: `$${tenantSummary?.outstanding?.toLocaleString() || '0'}`, icon: <IconDashboard className="w-6 h-6" />, color: tenantSummary?.outstanding > 0 ? "from-amber-500 to-orange-500" : "from-emerald-500 to-teal-500" },
    { label: "Account Status", value: "Active", icon: <IconCheck className="w-6 h-6" />, color: "from-emerald-500 to-teal-500" },
  ]

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-5 md:p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-10 -right-10 w-40 md:w-60 h-40 md:h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1 md:mb-2">
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
              {user?.tenantName || 'Tenant Dashboard'}
            </h2>
            <StatusBadge status={user?.userRole || 'member'} />
          </div>
          <p className="text-white/70 md:text-white/80 text-xs md:text-sm">
            Welcome, {user?.name || 'User'} · {users.length} team members · ${tenantSummary?.totalPaid?.toLocaleString() || '0'} total paid
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {statCards.map((stat, i) => (
          <Card key={i} glow className="!p-4 md:!p-6">
            <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider truncate">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 md:mt-1 truncate">{stat.value}</p>
              </div>
              <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2 !p-4 md:!p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">Billing Summary</h3>
            <Button variant="ghost" size="xs" className="text-xs" onClick={() => navigate('billing')}>
              View All →
            </Button>
          </div>
          {tenantSummary ? (
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-slate-500">Total Billed</p>
                <p className="text-sm md:text-xl font-bold text-slate-900 dark:text-white">${tenantSummary.totalBilled.toLocaleString()}</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-slate-500">Total Paid</p>
                <p className="text-sm md:text-xl font-bold text-emerald-600 dark:text-emerald-400">${tenantSummary.totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-slate-500">Outstanding</p>
                <p className={`text-sm md:text-xl font-bold ${tenantSummary.outstanding > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  ${tenantSummary.outstanding.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs md:text-sm text-slate-500">Loading billing data...</p>
          )}
        </Card>

        <Card className="!p-4 md:!p-6">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base mb-3 md:mb-4">Team Members</h3>
          <div className="space-y-2 md:space-y-3">
            {users.slice(0, 4).map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-white truncate">{u.name}</p>
                  <p className="text-[10px] md:text-xs text-slate-500 truncate">{u.role}</p>
                </div>
                <StatusBadge status={u.status} />
              </div>
            ))}
            {users.length > 4 && (
              <Button variant="ghost" size="xs" className="w-full text-xs" onClick={() => navigate('users')}>
                View all {users.length} members →
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TenantDashboard
