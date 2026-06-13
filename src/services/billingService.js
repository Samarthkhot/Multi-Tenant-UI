import StorageService from './storageService'

const DB_KEY = 'invoices'

const BillingService = {
  getAll(tenantId) {
    if (tenantId) return StorageService.query(DB_KEY, inv => inv.tenantId === tenantId)
    return StorageService.getAll(DB_KEY)
  },

  getById(id) {
    return StorageService.getById(DB_KEY, id)
  },

  create(data) {
    return StorageService.create(DB_KEY, data)
  },

  update(id, data) {
    return StorageService.update(DB_KEY, id, data)
  },

  delete(id) {
    return StorageService.delete(DB_KEY, id)
  },

  markAsPaid(id) {
    return this.update(id, {
      status: 'paid',
      paidAt: new Date().toISOString().split('T')[0]
    })
  },

  getPaginated(page, pageSize, filters = {}) {
    const predicate = item => {
      if (filters.tenantId && item.tenantId !== filters.tenantId) return false
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (!item.id.toLowerCase().includes(s) && !item.tenantName.toLowerCase().includes(s)) return false
      }
      if (filters.status && item.status !== filters.status) return false
      return true
    }
    return StorageService.paginate(DB_KEY, page, pageSize, predicate)
  },

  getStats() {
    const invoices = this.getAll()
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
    const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
    return {
      total: invoices.length,
      paid: invoices.filter(i => i.status === 'paid').length,
      pending: invoices.filter(i => i.status === 'pending').length,
      overdue: invoices.filter(i => i.status === 'overdue').length,
      totalRevenue,
      pendingRevenue,
      averageInvoice: Math.round(totalRevenue / (invoices.filter(i => i.status === 'paid').length || 1))
    }
  },

  getTenantBillingSummary(tenantId) {
    const invoices = this.getAll(tenantId)
    const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0)
    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
    return {
      totalBilled,
      totalPaid,
      outstanding: totalBilled - totalPaid,
      invoicesCount: invoices.length,
      paidCount: invoices.filter(i => i.status === 'paid').length,
      pendingCount: invoices.filter(i => i.status === 'pending').length
    }
  }
}

export default BillingService
