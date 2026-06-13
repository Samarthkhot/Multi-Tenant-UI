import { useEffect } from 'react'
import { useApp } from '../../contexts'

const icons = {
  success: (
    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
  error: (
    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  ),
  warning: (
    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
  ),
  info: (
    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  )
}

function ToastItem({ notification, onRemove }) {
  useEffect(() => {
    if (!notification.persistent) {
      const timer = setTimeout(() => onRemove(notification.id), notification.duration || 4000)
      return () => clearTimeout(timer)
    }
  }, [notification, onRemove])

  return (
    <div className={`
      flex items-start gap-3 px-4 py-3 bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl
      animate-in slide-in-from-right duration-300 max-w-sm w-full
    `}>
      {icons[notification.type] || icons.info}
      <div className="flex-1 min-w-0">
        {notification.title && <p className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</p>}
        <p className="text-sm text-slate-500 dark:text-slate-400">{notification.message}</p>
      </div>
      <button onClick={() => onRemove(notification.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition flex-shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { notifications, removeNotification } = useApp()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
      {notifications.map(n => (
        <ToastItem key={n.id} notification={n} onRemove={removeNotification} />
      ))}
    </div>
  )
}
