import StorageService from './storageService'

const DB_KEY = 'tenants'

const TenantService = {
  getAll() {
    return StorageService.getAll(DB_KEY)
  },

  getById(id) {
    return StorageService.getById(DB_KEY, id)
  },

  create(data) {
    const planLimits = { starter: { usersLimit: 10, storageLimit: 50 }, business: { usersLimit: 50, storageLimit: 200 }, enterprise: { usersLimit: 1000, storageLimit: 1000 } }
    const limits = planLimits[data.plan] || planLimits.starter
    return StorageService.create(DB_KEY, {
      ...data,
      usersCount: 0,
      storageUsed: 0,
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
      ...limits
    })
  },

  update(id, data) {
    return StorageService.update(DB_KEY, id, data)
  },

  delete(id) {
    return StorageService.delete(DB_KEY, id)
  },

  getPaginated(page, pageSize, filters = {}) {
    const predicate = item => {
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (!item.name.toLowerCase().includes(s) && !item.id.toLowerCase().includes(s) && !item.email.toLowerCase().includes(s)) return false
      }
      if (filters.status && item.status !== filters.status) return false
      if (filters.plan && item.plan !== filters.plan) return false
      return true
    }
    return StorageService.paginate(DB_KEY, page, pageSize, predicate)
  },

  getStats() {
    const tenants = this.getAll()
    return {
      total: tenants.length,
      active: tenants.filter(t => t.status === 'active').length,
      suspended: tenants.filter(t => t.status === 'suspended').length,
      pending: tenants.filter(t => t.status === 'pending').length,
      totalUsers: tenants.reduce((sum, t) => sum + (t.usersCount || 0), 0),
      averageStorage: Math.round(tenants.reduce((sum, t) => sum + (t.storageUsed || 0), 0) / (tenants.length || 1)),
      enterprise: tenants.filter(t => t.plan === 'enterprise').length,
      business: tenants.filter(t => t.plan === 'business').length,
      starter: tenants.filter(t => t.plan === 'starter').length
    }
  }
}

export default TenantService
