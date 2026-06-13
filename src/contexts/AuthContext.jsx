/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { AuthService } from '../services'

const AuthContext = createContext()

const initialState = {
  session: null,
  isAuthenticated: false,
  isAdmin: false,
  isTenant: false,
  loading: true
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
        isAuthenticated: action.payload?.isAuthenticated || false,
        isAdmin: action.payload?.role === 'admin',
        isTenant: action.payload?.role === 'tenant',
        loading: false
      }
    case 'CLEAR_SESSION':
      return { ...initialState, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    AuthService.seedInitialData()
    const session = AuthService.getSession()
    dispatch({ type: 'SET_SESSION', payload: session })
  }, [])

  const login = useCallback(async (email, password) => {
    const session = AuthService.login(email, password)
    if (session) {
      dispatch({ type: 'SET_SESSION', payload: session })
      return session
    }
    return null
  }, [])

  const loginAdmin = useCallback(async (email, password) => {
    const session = AuthService.loginAdmin(email, password)
    if (session) {
      dispatch({ type: 'SET_SESSION', payload: session })
      return session
    }
    return null
  }, [])

  const loginTenant = useCallback(async (tenantId, email, password) => {
    const session = AuthService.loginTenant(tenantId, email, password)
    if (session) {
      dispatch({ type: 'SET_SESSION', payload: session })
      return session
    }
    return null
  }, [])

  const logout = useCallback(() => {
    AuthService.logout()
    dispatch({ type: 'CLEAR_SESSION' })
  }, [])

  const value = {
    ...state,
    login,
    loginAdmin,
    loginTenant,
    logout,
    user: state.session
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
