const STORAGE_PREFIX = 'mt_'

const StorageService = {
  get(key) {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key) {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
  },

  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => localStorage.removeItem(k))
  },

  getAll(key) {
    return this.get(key) || []
  },

  getById(key, id) {
    const items = this.getAll(key)
    return items.find(item => item.id === id) || null
  },

  create(key, item) {
    const items = this.getAll(key)
    const newItem = { ...item, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    items.push(newItem)
    this.set(key, items)
    return newItem
  },

  update(key, id, updates) {
    const items = this.getAll(key)
    const index = items.findIndex(item => item.id === id)
    if (index === -1) return null
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() }
    this.set(key, items)
    return items[index]
  },

  delete(key, id) {
    const items = this.getAll(key)
    const filtered = items.filter(item => item.id !== id)
    if (filtered.length === items.length) return false
    this.set(key, items.filter(item => item.id !== id))
    return true
  },

  query(key, predicate) {
    return this.getAll(key).filter(predicate)
  },

  paginate(key, page = 1, pageSize = 10, predicate) {
    let items = predicate ? this.query(key, predicate) : this.getAll(key)
    const total = items.length
    const totalPages = Math.ceil(total / pageSize)
    const data = items.slice((page - 1) * pageSize, page * pageSize)
    return { data, total, page, pageSize, totalPages }
  }
}

export default StorageService
