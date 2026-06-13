export default function Avatar({ name, email, size = 'md', className = '' }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : email?.split('@')[0][0]?.toUpperCase() || '?'

  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-emerald-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-amber-500', 'bg-rose-500'
  ]
  const colorIndex = (name || email || '').length % colors.length

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  }

  return (
    <div
      className={`
        ${sizes[size] || sizes.md} ${colors[colorIndex]}
        rounded-full flex items-center justify-center text-white font-bold
        ${className}
      `}
      title={email}
    >
      {initials}
    </div>
  )
}
