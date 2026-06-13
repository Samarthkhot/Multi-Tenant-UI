import StorageService from './storageService'

const DB_KEY = 'users'

const UserService = {
  getAll(tenantId) {
    if (tenantId) return StorageService.query(DB_KEY, u => u.tenantId === tenantId)
    return StorageService.getAll(DB_KEY)
  },

  getById(id) {
    return StorageService.getById(DB_KEY, id)
  },

  create(data) {
    return StorageService.create(DB_KEY, {
      ...data,
      status: data.status || 'active',
      joinedAt: new Date().toISOString().split('T')[0]
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
      if (filters.tenantId && item.tenantId !== filters.tenantId) return false
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (!item.name.toLowerCase().includes(s) && !item.email.toLowerCase().includes(s)) return false
      }
      if (filters.status && item.status !== filters.status) return false
      if (filters.role && item.role !== filters.role) return false
      return true
    }
    return StorageService.paginate(DB_KEY, page, pageSize, predicate)
  },

  getStats() {
    const users = this.getAll()
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      admins: users.filter(u => u.role === 'admin').length,
      managers: users.filter(u => u.role === 'manager').length,
      members: users.filter(u => u.role === 'member').length
    }
  }
}

export default UserService
