import { useAuth } from "../contexts"
import { Card, Avatar, StatusBadge } from "../components/ui"

const Profile = () => {
  const { user } = useAuth()

  if (!user) return null

  const details = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Role', value: <StatusBadge status={user.adminRole || user.userRole || user.role} /> },
    { label: 'Account Type', value: user.role === 'admin' ? 'Administrator' : 'Tenant User' },
    { label: 'Login Time', value: new Date(user.loginTime).toLocaleString() },
  ]

  if (user.tenantId) {
    details.splice(3, 0, { label: 'Tenant ID', value: user.tenantId })
    details.splice(4, 0, { label: 'Organization', value: user.tenantName })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 px-1">
      <Card className="!p-4 md:!p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
          <Avatar name={user.name} email={user.email} size="xl" />
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate">{user.name}</h2>
            <p className="text-xs md:text-sm text-slate-500 truncate">{user.email}</p>
            <div className="mt-1.5 md:mt-2">
              <StatusBadge status={user.adminRole || user.userRole || user.role} />
            </div>
          </div>
        </div>
      </Card>

      <Card className="!p-4 md:!p-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base mb-3 md:mb-4">Account Details</h3>
        <dl className="divide-y divide-slate-200 dark:divide-slate-800/50">
          {details.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:justify-between py-2.5 md:py-3 gap-1 sm:gap-0">
              <dt className="text-xs md:text-sm text-slate-500">{item.label}</dt>
              <dd className="text-xs md:text-sm font-medium text-slate-900 dark:text-white">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="!p-4 md:!p-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base mb-3 md:mb-4">Session Info</h3>
        <dl className="divide-y divide-slate-200 dark:divide-slate-800/50">
          <div className="flex flex-col sm:flex-row sm:justify-between py-2.5 md:py-3 gap-1 sm:gap-0">
            <dt className="text-xs md:text-sm text-slate-500">Session ID</dt>
            <dd className="text-xs md:text-sm font-mono text-slate-900 dark:text-white">{user.id}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between py-2.5 md:py-3 gap-1 sm:gap-0">
            <dt className="text-xs md:text-sm text-slate-500">Authenticated</dt>
            <dd className="text-xs md:text-sm"><StatusBadge status={user.isAuthenticated ? 'active' : 'inactive'} /></dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}

export default Profile
