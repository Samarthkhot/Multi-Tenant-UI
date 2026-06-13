import { useState } from 'react'
import { IconOverview, IconUsers, IconBilling } from './Icons'

const iconMap = {
  overview: IconOverview,
  users: IconUsers,
  billing: IconBilling,
}

export default function Tabs({ tabs = [], defaultTab, onChange, variant = 'underline', className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.id))

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeContent = tabs.find(t => t.id === activeTab)?.content

  return (
    <div className={className}>
      <div className={`
        flex gap-1 border-b border-slate-200 dark:border-slate-700
        ${variant === 'pills' ? 'border-b-0' : ''}
      `}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            className={`
              px-4 py-3 text-sm font-medium transition-all duration-200
              ${variant === 'underline'
                ? activeTab === tab.id
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-[1px]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                : activeTab === tab.id
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg'
              }
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${tab.icon ? 'inline-flex items-center gap-2' : ''}
            `}
          >
            {tab.icon && (() => {
              const IconComp = iconMap[tab.icon]
              return IconComp ? <IconComp className="w-4 h-4" /> : <span className="text-lg">{tab.icon}</span>
            })()}
            {tab.label}
            {tab.badge != null && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {activeContent && (
        <div className="mt-4">
          {activeContent}
        </div>
      )}
    </div>
  )
}
