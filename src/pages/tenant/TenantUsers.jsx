import { useEffect, useState } from "react"
import { useAuth, useUsers, useApp } from "../../contexts"
import { Card, Button, DataTable, SearchInput, Modal, Avatar, StatusBadge } from "../../components/ui"

export default function TenantUsers() {
  const { user } = useAuth()
  const { pagination, fetchPaginated, createUser, updateUser } = useUsers()
  const { addNotification } = useApp()

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: 'password123', role: 'member', status: 'active' })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (user?.tenantId) {
      fetchPaginated(page, 10, { tenantId: user.tenantId, search })
    }
  }, [page, search, user?.tenantId, fetchPaginated])

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name required'
    if (!form.email.trim()) errors.email = 'Email required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (editing) {
      updateUser(editing.id, form)
      addNotification({ type: 'success', title: 'Updated', message: `${form.name} updated` })
    } else {
      createUser({ ...form, tenantId: user.tenantId })
      addNotification({ type: 'success', title: 'Added', message: `${form.name} added to team` })
    }
    setShowModal(false)
    setEditing(null)
    setForm({ name: '', email: '', password: 'password123', role: 'member', status: 'active' })
    fetchPaginated(page, 10, { tenantId: user.tenantId, search })
  }

  const columns = [
    { header: 'Member', accessor: 'name', render: (v, row) => (
      <div className="flex items-center gap-3">
        <Avatar name={v} email={row.email} size="sm" />
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{v}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{row.email}</p>
        </div>
      </div>
    )},
    { header: 'Role', accessor: 'role', type: 'badge' },
    { header: 'Department', accessor: 'department', render: (v) => v || '-' },
    { header: 'Status', accessor: 'status', type: 'badge' },
    { header: '', accessor: 'id', render: (v, row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); setEditing(row); setForm(row); setShowModal(true) }} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your organization's team</p>
        </div>
        <Button variant="primary" icon="+" onClick={() => { setEditing(null); setForm({ name: '', email: '', password: 'password123', role: 'member', status: 'active' }); setShowModal(true) }}>
          Add Member
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search members..." />
        </div>
        <DataTable columns={columns} data={pagination.data} page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} pageSize={10} emptyMessage="No team members found" />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Member' : 'Add Member'}
        footer={<><Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit}>{editing ? 'Save' : 'Add'}</Button></>}>
        <div className="space-y-4">
          {['name', 'email', 'role', 'status'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{field} {field === 'name' && <span className="text-red-500">*</span>}</label>
              {['role', 'status'].includes(field) ? (
                <select value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
                  {field === 'role'
                    ? ['admin', 'manager', 'member'].map(o => <option key={o} value={o}>{o}</option>)
                    : ['active', 'inactive'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={field} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
              )}
              {formErrors[field] && <p className="text-xs text-red-500 mt-1">{formErrors[field]}</p>}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
