import { useApp, useAuth } from "../contexts"
import { Card, Button } from "../components/ui"

const Settings = () => {
  const { theme, setTheme } = useApp()
  const { user } = useAuth()

  const settingItems = [
    {
      title: 'Appearance',
      desc: 'Toggle between light and dark mode',
      action: (
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 rounded-xl p-1">
          <button
            onClick={() => setTheme('light')}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
              theme === 'light' ? 'bg-slate-300 dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            ☀️ Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
              theme === 'dark' ? 'bg-slate-300 dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            🌙 Dark
          </button>
        </div>
      )
    },
    {
      title: 'Notifications',
      desc: 'Email notification preferences',
      action: <Button variant="secondary" size="sm">Configure</Button>
    },
    {
      title: 'Security',
      desc: 'Password and authentication settings',
      action: <Button variant="secondary" size="sm">Manage</Button>
    },
    ...(user?.role === 'admin' ? [{
      title: 'System Settings',
      desc: 'Global configuration and preferences',
      action: <Button variant="secondary" size="sm">Open</Button>
    }] : [])
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 px-1">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-xs md:text-sm text-slate-500">Manage your preferences</p>
      </div>

      {settingItems.map((item, i) => (
        <Card key={i} className="!p-4 md:!p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">{item.title}</h3>
              <p className="text-xs md:text-sm text-slate-500">{item.desc}</p>
            </div>
            <div className="flex-shrink-0 self-start sm:self-auto">
              {item.action}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default Settings
