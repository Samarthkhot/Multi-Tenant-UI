import { useEffect, useState } from "react"

const StatCard = ({ title, value, progress = 70, icon }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(value.replace(/\D/g, "")) || 100
    const duration = 800
    const step = Math.max(1, Math.floor(end / (duration / 16)))

    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        start = end
        clearInterval(timer)
      }
      setDisplayValue(start)
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="relative bg-white/80 dark:bg-slate-800 backdrop-blur
      rounded-2xl p-6 border dark:border-slate-700 shadow-sm
      hover:shadow-xl transition">

      {/* Icon */}
      <div className="text-3xl mb-3">
        {icon}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
        {displayValue}
      </h3>

      {/* Progress Bar */}
      <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

    </div>
  )
}

export default StatCard
