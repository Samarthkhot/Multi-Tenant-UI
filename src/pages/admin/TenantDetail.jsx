/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTenants, useUsers, useBilling, useApp } from "../../contexts"
import { Card, Button, StatusBadge, DataTable, Modal, ConfirmDialog, Tabs, Avatar } from "../../components/ui"

export default function TenantDetail() {
  const { tenantId } = useParams()
  const navigate = useNavigate()
  const { getTenant, selectedTenant, updateTenant, deleteTenant } = useTenants()
  const { users: tenantUsers, fetchUsers, createUser } = useUsers()
  const { invoices: tenantInvoices, fetchInvoices } = useBilling()
  const { addNotification } = useApp()

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [userForm, setUserForm] = useState({ name: '', email: '', password: 'password123', role: 'member' })

  useEffect(() => {
    getTenant(tenantId)
    fetchUsers(tenantId)
    fetchInvoices(tenantId)
  }, [tenantId, getTenant, fetchUsers, fetchInvoices])

  useEffect(() => {
    if (selectedTenant) setEditForm(selectedTenant)
  }, [selectedTenant])

  const handleUpdate = () => {
    updateTenant(tenantId, editForm)
    setShowEdit(false)
    addNotification({ type: 'success', title: 'Updated', message: 'Tenant updated successfully' })
  }

  const handleDelete = () => {
    deleteTenant(tenantId)
    setShowDelete(false)
    addNotification({ type: 'warning', title: 'Deleted', message: 'Tenant has been removed' })
    navigate('/admin-dashboard/tenants')
  }

  const handleAddUser = () => {
    createUser({ ...userForm, tenantId })
    setShowAddUser(false)
    setUserForm({ name: '', email: '', password: 'password123', role: 'member' })
    addNotification({ type: 'success', title: 'User Added', message: `${userForm.name} added to tenant` })
  }

  if (!selectedTenant) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const userColumns = [
    { header: 'Name', accessor: 'name', render: (v, row) => (
      <div className="flex items-center gap-3">
        <Avatar name={v} email={row.email} size="sm" />
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{v}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{row.email}</p>
        </div>
      </div>
    )},
    { header: 'Role', accessor: 'role', type: 'badge' },
    { header: 'Status', accessor: 'status', type: 'badge' },
  ]

  const invoiceColumns = [
    { header: 'Invoice', accessor: 'id' },
    { header: 'Period', accessor: 'period', type: 'date' },
    { header: 'Amount', accessor: 'amount', type: 'currency', align: 'right' },
    { header: 'Status', accessor: 'status', type: 'badge' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'overview', content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Organization Details</h4>
          <dl className="space-y-3">
            {[
              { label: 'Company', value: selectedTenant.name },
              { label: 'ID', value: selectedTenant.id },
              { label: 'Email', value: selectedTenant.email },
              { label: 'Domain', value: selectedTenant.domain },
              { label: 'Phone', value: selectedTenant.phone || '-' },
              { label: 'Address', value: selectedTenant.address || '-' },
              { label: 'Plan', value: <StatusBadge status={selectedTenant.plan} /> },
              { label: 'Status', value: <StatusBadge status={selectedTenant.status} /> },
              { label: 'Joined', value: new Date(selectedTenant.joinedAt).toLocaleDateString() },
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
                <dt className="text-sm text-slate-500 dark:text-slate-400">{item.label}</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Usage Statistics</h4>
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTenant.usersCount} <span className="text-sm font-normal text-slate-400">/ {selectedTenant.usersLimit || '∞'}</span></p>
              <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(selectedTenant.usersCount / (selectedTenant.usersLimit || 100)) * 100}%` }} />
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Storage Used</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTenant.storageUsed}% <span className="text-sm font-normal text-slate-400">/ {selectedTenant.storageLimit || '∞'} GB</span></p>
              <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedTenant.storageUsed}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )},
    { id: 'users', label: 'Users', icon: 'users', badge: tenantUsers.length, content: (
      <div>
        <div className="flex justify-end mb-4">
          <Button variant="primary" size="sm" icon="+" onClick={() => setShowAddUser(true)}>Add User</Button>
        </div>
        <DataTable columns={userColumns} data={tenantUsers} />
      </div>
    )},
    { id: 'billing', label: 'Billing', icon: 'billing', badge: tenantInvoices.length, content: (
      <DataTable columns={invoiceColumns} data={tenantInvoices} />
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin-dashboard/tenants')}>
          ← Back
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white truncate">{selectedTenant.name}</h2>
            <StatusBadge status={selectedTenant.status} />
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 truncate">{selectedTenant.id} · {selectedTenant.plan} plan</p>
        </div>
        <div className="flex gap-2 flex-shrink-0 self-start sm:self-auto">
          <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>Delete</Button>
        </div>
      </div>

      <Card>
        <Tabs tabs={tabs} />
      </Card>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Tenant" size="lg"
        footer={<><Button variant="ghost" onClick={() => setShowEdit(false)}>Cancel</Button><Button variant="primary" onClick={handleUpdate}>Save Changes</Button></>}>
        <div className="grid grid-cols-2 gap-4">
          {['name', 'email', 'domain', 'plan', 'status', 'phone'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{field}</label>
              {['plan', 'status'].includes(field) ? (
                <select value={editForm[field] || ''} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                  {field === 'plan'
                    ? ['starter', 'business', 'enterprise'].map(o => <option key={o} value={o}>{o}</option>)
                    : ['active', 'suspended', 'pending'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type="text" value={editForm[field] || ''} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              )}
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
            <textarea value={editForm.address || ''} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAddUser} onClose={() => setShowAddUser(false)} title="Add Team Member"
        footer={<><Button variant="ghost" onClick={() => setShowAddUser(false)}>Cancel</Button><Button variant="primary" onClick={handleAddUser}>Add User</Button></>}>
        <div className="space-y-4">
          {['name', 'email', 'role'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{field}</label>
              {field === 'role' ? (
                <select value={userForm[field]} onChange={(e) => setUserForm({ ...userForm, [field]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="member">Member</option>
                </select>
              ) : (
                <input type={field === 'email' ? 'email' : 'text'} value={userForm[field]} onChange={(e) => setUserForm({ ...userForm, [field]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              )}
            </div>
          ))}
        </div>
      </Modal>

      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Tenant" message={`Are you sure you want to delete ${selectedTenant.name}? This action cannot be undone.`}
        confirmLabel="Delete" variant="danger" />
    </div>
  )
}
