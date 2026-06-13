/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

const AppContext = createContext()

const initialState = {
  theme: localStorage.getItem('mt_theme') || 'light',
  sidebarOpen: false,
  notifications: [],
  loading: false
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] }
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) }
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const html = document.documentElement
    if (state.theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('mt_theme', state.theme)
  }, [state.theme])

  const setTheme = useCallback((theme) => {
    dispatch({ type: 'SET_THEME', payload: theme })
  }, [])

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })
  }, [state.theme])

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }, [])

  const setSidebar = useCallback((open) => {
    dispatch({ type: 'SET_SIDEBAR', payload: open })
  }, [])

  const addNotification = useCallback((notification) => {
    const id = Date.now()
    dispatch({ type: 'ADD_NOTIFICATION', payload: { ...notification, id } })
    if (!notification.persistent) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
      }, notification.duration || 4000)
    }
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }, [])

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const value = {
    ...state,
    setTheme,
    toggleTheme,
    toggleSidebar,
    setSidebar,
    addNotification,
    removeNotification,
    setLoading
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
