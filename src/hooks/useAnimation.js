import { useState, useEffect, useRef } from 'react'

export function useCountUp(end, duration = 1500, start = 0) {
  const [count, setCount] = useState(start)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const endNum = typeof end === 'string' ? parseInt(end.replace(/\D/g, '')) || 0 : end
    const step = Math.max(1, Math.floor(endNum / (duration / 16)))

    const timer = setInterval(() => {
      setCount(prev => {
        const next = prev + step
        if (next >= endNum) {
          clearInterval(timer)
          return endNum
        }
        return next
      })
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration])

  return count
}

export function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(element)
      }
    }, { threshold: 0.1, ...options })

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return [ref, isVisible]
}
