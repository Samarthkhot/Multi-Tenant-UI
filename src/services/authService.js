import StorageService from './storageService'

const TENANTS_DB = 'tenants'
const USERS_DB = 'users'

const ADMINS = [
  { email: 'Samarth@gmail.com', password: 'samarth123', name: 'Samarth Khot', role: 'super_admin' },
  { email: 'admin@system.com', password: 'admin123', name: 'System Admin', role: 'admin' }
]

const AuthService = {
  loginAdmin(email, password) {
    const admin = ADMINS.find(a => a.email === email && a.password === password)
    if (!admin) return null

    const session = {
      id: 'admin_' + admin.email,
      email: admin.email,
      name: admin.name,
      role: 'admin',
      adminRole: admin.role,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    }

    StorageService.set('session', session)
    return session
  },

  loginTenant(tenantId, email, password) {
    const tenant = StorageService.getById(TENANTS_DB, tenantId)
    if (!tenant) return null

    const user = StorageService.query(USERS_DB, u => u.tenantId === tenantId && u.email === email)
    if (user.length === 0) return null

    const matchedUser = user[0]
    if (matchedUser.password !== password) return null

    const session = {
      id: matchedUser.id,
      tenantId,
      tenantName: tenant.name,
      email: matchedUser.email,
      name: matchedUser.name,
      role: 'tenant',
      userRole: matchedUser.role || 'member',
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    }

    StorageService.set('session', session)
    return session
  },

  login(email, password) {
    const admin = ADMINS.find(a => a.email === email && a.password === password)
    if (admin) {
      const session = {
        id: 'admin_' + admin.email,
        email: admin.email,
        name: admin.name,
        role: 'admin',
        adminRole: admin.role,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      }
      StorageService.set('session', session)
      return session
    }

    const user = StorageService.getAll(USERS_DB).find(u => u.email === email && u.password === password)
    if (user) {
      const tenant = StorageService.getById(TENANTS_DB, user.tenantId)
      const session = {
        id: user.id,
        tenantId: user.tenantId,
        tenantName: tenant?.name || 'Unknown',
        email: user.email,
        name: user.name,
        role: 'tenant',
        userRole: user.role || 'member',
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      }
      StorageService.set('session', session)
      return session
    }

    return null
  },

  logout() {
    StorageService.remove('session')
    StorageService.remove('theme')
  },

  getSession() {
    return StorageService.get('session')
  },

  getSessionRaw() {
    try {
      const item = localStorage.getItem('mt_session')
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  isAuthenticated() {
    const session = this.getSession()
    return session && session.isAuthenticated
  },

  isAdmin() {
    const session = this.getSession()
    return session && session.role === 'admin'
  },

  isTenant() {
    const session = this.getSession()
    return session && session.role === 'tenant'
  },

  seedInitialData() {
    if (StorageService.get('_seeded')) return

    const defaultTenants = [
      { id: 'TEN-001', name: 'Acme Corporation', email: 'admin@acme.com', domain: 'acme.com', plan: 'enterprise', status: 'active', usersCount: 45, storageUsed: 85, joinedAt: '2024-01-15', address: '123 Business Ave, New York, NY 10001', phone: '+1 (212) 555-0101' },
      { id: 'TEN-002', name: 'Globex Industries', email: 'admin@globex.com', domain: 'globex.com', plan: 'business', status: 'active', usersCount: 23, storageUsed: 62, joinedAt: '2024-03-22', address: '456 Corporate Blvd, San Francisco, CA 94105', phone: '+1 (415) 555-0202' },
      { id: 'TEN-003', name: 'Initech Solutions', email: 'admin@initech.com', domain: 'initech.com', plan: 'starter', status: 'suspended', usersCount: 8, storageUsed: 30, joinedAt: '2024-06-10', address: '789 Innovation Dr, Austin, TX 78701', phone: '+1 (512) 555-0303' },
      { id: 'TEN-004', name: 'Hooli Technologies', email: 'admin@hooli.com', domain: 'hooli.com', plan: 'enterprise', status: 'active', usersCount: 120, storageUsed: 92, joinedAt: '2023-11-05', address: '321 Tech Park, Palo Alto, CA 94304', phone: '+1 (650) 555-0404' },
      { id: 'TEN-005', name: 'Stark Enterprises', email: 'admin@stark.com', domain: 'stark.com', plan: 'business', status: 'active', usersCount: 67, storageUsed: 78, joinedAt: '2024-02-28', address: '10880 Malibu Point, Malibu, CA 90265', phone: '+1 (310) 555-0505' },
      { id: 'TEN-006', name: 'Wayne Industries', email: 'admin@wayne.com', domain: 'wayne.com', plan: 'enterprise', status: 'active', usersCount: 200, storageUsed: 95, joinedAt: '2023-08-15', address: '1007 Mountain Dr, Gotham, NY 10012', phone: '+1 (212) 555-0606' },
      { id: 'TEN-007', name: 'Oscorp Technologies', email: 'admin@oscorp.com', domain: 'oscorp.com', plan: 'starter', status: 'pending', usersCount: 5, storageUsed: 15, joinedAt: '2025-01-20', address: '950 6th Ave, New York, NY 10001', phone: '+1 (212) 555-0707' },
      { id: 'TEN-008', name: 'Umbrella Corporation', email: 'admin@umbrella.com', domain: 'umbrella.com', plan: 'business', status: 'active', usersCount: 34, storageUsed: 55, joinedAt: '2024-04-18', address: '200 Raccoon St, Raccoon City, OH 44101', phone: '+1 (216) 555-0808' },
      { id: 'TEN-009', name: 'Cyberdyne Systems', email: 'admin@cyberdyne.com', domain: 'cyberdyne.com', plan: 'enterprise', status: 'suspended', usersCount: 15, storageUsed: 40, joinedAt: '2024-07-01', address: '1 Skynet Plaza, Los Angeles, CA 90001', phone: '+1 (213) 555-0909' },
      { id: 'TEN-010', name: 'Soylent Corp', email: 'admin@soylent.com', domain: 'soylent.com', plan: 'starter', status: 'active', usersCount: 12, storageUsed: 25, joinedAt: '2025-03-10', address: '500 Green Way, Chicago, IL 60601', phone: '+1 (312) 555-1010' },
    ]

    const defaultUsers = []
    defaultTenants.forEach(tenant => {
      defaultUsers.push({
        id: `usr_${tenant.id}`,
        tenantId: tenant.id,
        name: `${tenant.name} Admin`,
        email: `admin@${tenant.domain}`,
        password: 'password123',
        role: 'admin',
        status: 'active',
        department: 'Management',
        phone: tenant.phone,
        joinedAt: tenant.joinedAt
      })
      for (let i = 1; i <= Math.min(5, Math.floor(tenant.usersCount / 5)); i++) {
        defaultUsers.push({
          id: `usr_${tenant.id}_${i}`,
          tenantId: tenant.id,
          name: `User ${i} - ${tenant.name}`,
          email: `user${i}@${tenant.domain}`,
          password: 'password123',
          role: i === 1 ? 'manager' : 'member',
          status: i % 3 === 0 ? 'inactive' : 'active',
          department: ['Engineering', 'Marketing', 'Sales', 'Support', 'Finance'][i - 1],
          phone: `+1 (555) 555-${String(1000 + i).slice(1)}`,
          joinedAt: new Date(new Date(tenant.joinedAt).getTime() + i * 86400000 * 30).toISOString().split('T')[0]
        })
      }
    })

    const defaultInvoices = []
    const plans = { starter: 99, business: 299, enterprise: 999 }
    defaultTenants.forEach(tenant => {
      for (let m = 0; m < 6; m++) {
        const date = new Date(2025, m, 1)
        const amount = plans[tenant.plan] || 99
        const statuses = ['paid', 'paid', 'paid', 'paid', 'pending', 'paid']
        defaultInvoices.push({
          id: `INV-${String(m + 1).padStart(3, '0')}-${tenant.id.slice(-4)}`,
          tenantId: tenant.id,
          tenantName: tenant.name,
          amount,
          currency: 'USD',
          status: statuses[m],
          period: date.toISOString().split('T')[0],
          dueDate: new Date(date.getFullYear(), date.getMonth() + 1, 15).toISOString().split('T')[0],
          paidAt: statuses[m] === 'paid' ? new Date(date.getFullYear(), date.getMonth(), 5).toISOString().split('T')[0] : null,
          description: `${tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)} Plan - ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`
        })
      }
    })

    const defaultAuditLogs = []
    const actions = ['tenant.created', 'tenant.updated', 'user.login', 'user.created', 'invoice.created', 'invoice.paid', 'settings.updated', 'tenant.suspended']
    const actors = ['Samarth Khot', 'System Admin', 'System', 'Acme Corporation Admin', 'Hooli Technologies Admin']
    for (let i = 0; i < 50; i++) {
      const date = new Date(Date.now() - i * 3600000 * (Math.random() * 24 + 1))
      defaultAuditLogs.push({
        id: `log_${i}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        actor: actors[Math.floor(Math.random() * actors.length)],
        target: `TEN-${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`,
        details: `Performed ${actions[Math.floor(Math.random() * actions.length)]} operation`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        timestamp: date.toISOString()
      })
    }

    StorageService.set('tenants', defaultTenants)
    StorageService.set('users', defaultUsers)
    StorageService.set('invoices', defaultInvoices)
    StorageService.set('audit_logs', defaultAuditLogs)
    StorageService.set('_seeded', true)
  }
}

export default AuthService
