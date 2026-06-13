import StorageService from './storageService'

const DB_KEY = 'audit_logs'

const AuditService = {
  getAll() {
    return StorageService.getAll(DB_KEY)
  },

  log(action, actor, target, details) {
    return StorageService.create(DB_KEY, {
      action,
      actor,
      target,
      details,
      ip: '127.0.0.1',
      timestamp: new Date().toISOString()
    })
  },

  getPaginated(page, pageSize, filters = {}) {
    const predicate = item => {
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (!item.action.toLowerCase().includes(s) && !item.actor.toLowerCase().includes(s) && !item.target.toLowerCase().includes(s)) return false
      }
      if (filters.action && item.action !== filters.action) return false
      if (filters.actor && !item.actor.toLowerCase().includes(filters.actor.toLowerCase())) return false
      return true
    }
    return StorageService.paginate(DB_KEY, page, pageSize, predicate)
  },

  getActions() {
    const logs = this.getAll()
    return [...new Set(logs.map(l => l.action))]
  },

  clearLogs() {
    StorageService.set(DB_KEY, [])
  }
}

export default AuditService
