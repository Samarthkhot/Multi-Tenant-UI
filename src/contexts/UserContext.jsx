/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { UserService } from '../services'

const UserContext = createContext()

const initialState = {
  users: [],
  selectedUser: null,
  stats: null,
  pagination: { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 },
  loading: false
}

function userReducer(state, action) {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload }
    case 'SET_PAGINATED':
      return { ...state, pagination: action.payload }
    case 'SET_SELECTED':
      return { ...state, selectedUser: action.payload }
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const fetchUsers = useCallback((tenantId) => {
    dispatch({ type: 'SET_USERS', payload: UserService.getAll(tenantId) })
    dispatch({ type: 'SET_STATS', payload: UserService.getStats() })
  }, [])

  const fetchPaginated = useCallback((page = 1, pageSize = 10, filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const result = UserService.getPaginated(page, pageSize, filters)
    dispatch({ type: 'SET_PAGINATED', payload: result })
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  const getUser = useCallback((id) => {
    const user = UserService.getById(id)
    dispatch({ type: 'SET_SELECTED', payload: user })
    return user
  }, [])

  const createUser = useCallback((data) => {
    const user = UserService.create(data)
    return user
  }, [])

  const updateUser = useCallback((id, data) => {
    const user = UserService.update(id, data)
    return user
  }, [])

  const deleteUser = useCallback((id) => {
    return UserService.delete(id)
  }, [])

  const value = {
    ...state,
    fetchUsers,
    fetchPaginated,
    getUser,
    createUser,
    updateUser,
    deleteUser
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUsers() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUsers must be used within UserProvider')
  return context
}
