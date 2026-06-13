/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { TenantService } from '../services'

const TenantContext = createContext()

const initialState = {
  tenants: [],
  selectedTenant: null,
  stats: null,
  pagination: { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 },
  loading: false
}

function tenantReducer(state, action) {
  switch (action.type) {
    case 'SET_TENANTS':
      return { ...state, tenants: action.payload }
    case 'SET_PAGINATED':
      return { ...state, pagination: action.payload }
    case 'SET_SELECTED':
      return { ...state, selectedTenant: action.payload }
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function TenantProvider({ children }) {
  const [state, dispatch] = useReducer(tenantReducer, initialState)

  const fetchTenants = useCallback(() => {
    dispatch({ type: 'SET_TENANTS', payload: TenantService.getAll() })
    dispatch({ type: 'SET_STATS', payload: TenantService.getStats() })
  }, [])

  const fetchPaginated = useCallback((page = 1, pageSize = 10, filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const result = TenantService.getPaginated(page, pageSize, filters)
    dispatch({ type: 'SET_PAGINATED', payload: result })
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  const getTenant = useCallback((id) => {
    const tenant = TenantService.getById(id)
    dispatch({ type: 'SET_SELECTED', payload: tenant })
    return tenant
  }, [])

  const createTenant = useCallback((data) => {
    const tenant = TenantService.create(data)
    fetchTenants()
    return tenant
  }, [fetchTenants])

  const updateTenant = useCallback((id, data) => {
    const tenant = TenantService.update(id, data)
    fetchTenants()
    return tenant
  }, [fetchTenants])

  const deleteTenant = useCallback((id) => {
    const result = TenantService.delete(id)
    fetchTenants()
    return result
  }, [fetchTenants])

  const value = {
    ...state,
    fetchTenants,
    fetchPaginated,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenants() {
  const context = useContext(TenantContext)
  if (!context) throw new Error('useTenants must be used within TenantProvider')
  return context
}
