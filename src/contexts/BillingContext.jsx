/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { BillingService } from '../services'

const BillingContext = createContext()

const initialState = {
  invoices: [],
  selectedInvoice: null,
  stats: null,
  tenantSummary: null,
  pagination: { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 },
  loading: false
}

function billingReducer(state, action) {
  switch (action.type) {
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload }
    case 'SET_PAGINATED':
      return { ...state, pagination: action.payload }
    case 'SET_SELECTED':
      return { ...state, selectedInvoice: action.payload }
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'SET_TENANT_SUMMARY':
      return { ...state, tenantSummary: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function BillingProvider({ children }) {
  const [state, dispatch] = useReducer(billingReducer, initialState)

  const fetchInvoices = useCallback((tenantId) => {
    if (tenantId) {
      dispatch({ type: 'SET_INVOICES', payload: BillingService.getAll(tenantId) })
      dispatch({ type: 'SET_TENANT_SUMMARY', payload: BillingService.getTenantBillingSummary(tenantId) })
    } else {
      dispatch({ type: 'SET_INVOICES', payload: BillingService.getAll() })
    }
    dispatch({ type: 'SET_STATS', payload: BillingService.getStats() })
  }, [])

  const fetchPaginated = useCallback((page = 1, pageSize = 10, filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const result = BillingService.getPaginated(page, pageSize, filters)
    dispatch({ type: 'SET_PAGINATED', payload: result })
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  const getInvoice = useCallback((id) => {
    const invoice = BillingService.getById(id)
    dispatch({ type: 'SET_SELECTED', payload: invoice })
    return invoice
  }, [])

  const markAsPaid = useCallback((id) => {
    const invoice = BillingService.markAsPaid(id)
    return invoice
  }, [])

  const value = {
    ...state,
    fetchInvoices,
    fetchPaginated,
    getInvoice,
    markAsPaid
  }

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
}

export function useBilling() {
  const context = useContext(BillingContext)
  if (!context) throw new Error('useBilling must be used within BillingProvider')
  return context
}
