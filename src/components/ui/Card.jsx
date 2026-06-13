export default function Card({
  children, className = '', hover = true, glow = false, padding = true, onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800/90
        border border-slate-200 dark:border-slate-700/50
        rounded-2xl
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5' : ''}
        ${glow ? 'shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/5' : 'shadow-sm'}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {children}
    </div>
  )
}
