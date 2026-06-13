import { useEffect, useState } from "react"
import { useUsers, useApp } from "../../contexts"
import { Card, Button, DataTable, SearchInput, Modal, Avatar, StatusBadge } from "../../components/ui"

const initialForm = { name: '', email: '', password: 'password123', role: 'member', status: 'active', tenantId: '' }

export default function UserManagement() {
  const { pagination, fetchPaginated, createUser, updateUser, deleteUser, stats } = useUsers()
  const { addNotification } = useApp()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const filters = {}
    if (search) filters.search = search
    if (statusFilter) filters.status = statusFilter
    if (roleFilter) filters.role = roleFilter
    fetchPaginated(page, 10, filters)
  }, [page, search, statusFilter, roleFilter, fetchPaginated])

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name required'
    if (!form.email.trim()) errors.email = 'Email required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email'
    if (!form.tenantId.trim()) errors.tenantId = 'Tenant ID required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (editingUser) {
      updateUser(editingUser.id, form)
      addNotification({ type: 'success', title: 'Updated', message: `${form.name} updated` })
    } else {
      createUser(form)
      addNotification({ type: 'success', title: 'Created', message: `${form.name} created` })
    }
    setShowCreate(false)
    setEditingUser(null)
    setForm(initialForm)
    fetchPaginated(page, 10, { search, status: statusFilter, role: roleFilter })
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, password: '', role: user.role, status: user.status, tenantId: user.tenantId })
    setShowCreate(true)
  }

  const handleDelete = (id) => {
    deleteUser(id)
    addNotification({ type: 'warning', title: 'Deleted', message: 'User removed' })
    fetchPaginated(page, 10, { search, status: statusFilter, role: roleFilter })
  }

  const columns = [
    { header: 'User', accessor: 'name', render: (v, row) => (
      <div className="flex items-center gap-3">
        <Avatar name={v} email={row.email} size="sm" />
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{v}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{row.email}</p>
        </div>
      </div>
    )},
    { header: 'Tenant', accessor: 'tenantId', render: (v) => <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{v}</span> },
    { header: 'Role', accessor: 'role', type: 'badge' },
    { header: 'Department', accessor: 'department', render: (v) => v || '-' },
    { header: 'Status', accessor: 'status', type: 'badge' },
    { header: '', accessor: 'id', render: (v, row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); handleEdit(row) }} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(v) }} className="text-xs text-red-600 dark:text-red-400 hover:underline">Delete</button>
      </div>
    )},
  ]

  const formFields = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'password', label: 'Password', type: 'password' },
    { key: 'tenantId', label: 'Tenant ID', type: 'text', required: true },
    { key: 'role', label: 'Role', type: 'select', options: [
      { value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'member', label: 'Member' }
    ]},
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }
    ]},
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage all users across tenants</p>
        </div>
        <Button variant="primary" icon="+" onClick={() => { setEditingUser(null); setForm(initialForm); setShowCreate(true) }}>Add User</Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Active', value: stats.active },
            { label: 'Inactive', value: stats.inactive },
            { label: 'Admins', value: stats.admins },
            { label: 'Members', value: stats.members },
          ].map((s, i) => (
            <Card key={i} padding={false} hover={false}>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search users..." className="flex-1" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>
        </div>
        <DataTable columns={columns} data={pagination.data} page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} pageSize={10} />
      </Card>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title={editingUser ? 'Edit User' : 'Create User'}
        footer={<><Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit}>{editingUser ? 'Save' : 'Create'}</Button></>}>
        <div className="grid grid-cols-2 gap-4">
          {formFields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                  {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input type={field.type} value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              )}
              {formErrors[field.key] && <p className="text-xs text-red-500 mt-1">{formErrors[field.key]}</p>}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
