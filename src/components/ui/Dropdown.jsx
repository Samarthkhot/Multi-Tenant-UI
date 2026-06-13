import { useState, useRef, useEffect } from 'react'

export default function Dropdown({ trigger, children, align = 'left', className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 min-w-[12rem] bg-white dark:bg-slate-800
            border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl
            py-1 animate-in fade-in zoom-in-95 duration-150
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ children, onClick, icon, danger = false, divider = false }) {
  return (
    <>
      {divider && <div className="my-1 border-t border-slate-200 dark:border-slate-700" />}
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 text-sm transition
          ${danger ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}
        `}
      >
        {icon && <span className="text-base">{icon}</span>}
        {children}
      </button>
    </>
  )
}
