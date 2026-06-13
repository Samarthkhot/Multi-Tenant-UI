import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTenants, useApp } from "../../contexts"
import { Card, Button, DataTable, SearchInput, Modal, StatusBadge } from "../../components/ui"

const initialForm = {
  name: '', email: '', domain: '', plan: 'starter', address: '', phone: ''
}

export default function TenantManagement() {
  const navigate = useNavigate()
  const { pagination, fetchPaginated, createTenant, stats } = useTenants()
  const { addNotification } = useApp()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [planFilter, setPlanFilter] = useState("")
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const filters = {}
    if (search) filters.search = search
    if (statusFilter) filters.status = statusFilter
    if (planFilter) filters.plan = planFilter
    fetchPaginated(page, 10, filters)
  }, [page, search, statusFilter, planFilter, fetchPaginated])

  const validateForm = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email'
    if (!form.domain.trim()) errors.domain = 'Domain is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreate = () => {
    if (!validateForm()) return
    createTenant(form)
    setShowCreate(false)
    setForm(initialForm)
    addNotification({ type: 'success', title: 'Created', message: `${form.name} has been created` })
  }

  const columns = [
    { header: 'Tenant', accessor: 'name', render: (value, row) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{row.id}</p>
      </div>
    )},
    { header: 'Plan', accessor: 'plan', type: 'badge' },
    { header: 'Users', accessor: 'usersCount', type: 'number', align: 'right' },
    { header: 'Storage', accessor: 'storageUsed', render: (v) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full max-w-[80px]">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">{v}%</span>
      </div>
    )},
    { header: 'Status', accessor: 'status', type: 'badge' },
    { header: 'Joined', accessor: 'joinedAt', type: 'date' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tenants</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage all tenant organizations</p>
        </div>
        <Button variant="primary" icon="+" onClick={() => setShowCreate(true)}>
          Add Tenant
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-900 dark:text-white' },
            { label: 'Active', value: stats.active, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Suspended', value: stats.suspended, color: 'text-red-600 dark:text-red-400' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600 dark:text-amber-400' },
          ].map((s, i) => (
            <Card key={i} padding={false} hover={false}>
              <div className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search tenants..." className="flex-1" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => { setPlanFilter(e.target.value); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="">All Plans</option>
            <option value="enterprise">Enterprise</option>
            <option value="business">Business</option>
            <option value="starter">Starter</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={pagination.data}
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={setPage}
          onRowClick={(row) => navigate(row.id)}
          pageSize={10}
        />
      </Card>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Tenant" size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create Tenant</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Company Name', type: 'text', required: true },
            { key: 'email', label: 'Admin Email', type: 'email', required: true },
            { key: 'domain', label: 'Domain', type: 'text', required: true },
            { key: 'plan', label: 'Plan', type: 'select', options: [
              { value: 'starter', label: 'Starter' },
              { value: 'business', label: 'Business' },
              { value: 'enterprise', label: 'Enterprise' },
            ]},
            { key: 'phone', label: 'Phone', type: 'text' },
            { key: 'address', label: 'Address', type: 'text', className: 'col-span-2' },
          ].map((field) => (
            <div key={field.key} className={field.className || ''}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
              {formErrors[field.key] && <p className="text-xs text-red-500 mt-1">{formErrors[field.key]}</p>}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
