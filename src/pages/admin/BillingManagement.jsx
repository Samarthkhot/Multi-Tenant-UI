import { useEffect, useState } from "react"
import { useBilling, useApp } from "../../contexts"
import { Card, Button, DataTable, SearchInput, StatusBadge } from "../../components/ui"

export default function BillingManagement() {
  const { pagination, fetchPaginated, stats, markAsPaid } = useBilling()
  const { addNotification } = useApp()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const filters = {}
    if (search) filters.search = search
    if (statusFilter) filters.status = statusFilter
    fetchPaginated(page, 10, filters)
  }, [page, search, statusFilter, fetchPaginated])

  const handleMarkPaid = (id) => {
    markAsPaid(id)
    addNotification({ type: 'success', title: 'Paid', message: 'Invoice marked as paid' })
    fetchPaginated(page, 10, { search, status: statusFilter })
  }

  const columns = [
    { header: 'Invoice', accessor: 'id', render: (v) => <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">{v}</span> },
    { header: 'Tenant', accessor: 'tenantName' },
    { header: 'Period', accessor: 'period', type: 'date' },
    { header: 'Description', accessor: 'description', render: (v) => <span className="text-sm text-slate-500 dark:text-slate-400">{v}</span> },
    { header: 'Amount', accessor: 'amount', type: 'currency', align: 'right' },
    { header: 'Status', accessor: 'status', type: 'badge' },
    { header: 'Paid Date', accessor: 'paidAt', render: (v) => v ? new Date(v).toLocaleDateString() : '-' },
    { header: '', accessor: 'id', render: (v, row) => (
      row.status === 'pending' ? (
        <Button variant="success" size="xs" onClick={(e) => { e.stopPropagation(); handleMarkPaid(v) }}>Mark Paid</Button>
      ) : null
    )},
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Invoices</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage invoices and track revenue</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Pending', value: `$${stats.pendingRevenue.toLocaleString()}`, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Paid', value: stats.paid, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Avg Invoice', value: `$${stats.averageInvoice.toLocaleString()}`, color: 'text-indigo-600 dark:text-indigo-400' },
          ].map((s, i) => (
            <Card key={i} padding={false} hover={false}>
              <div className="p-4">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search invoices..." className="flex-1" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <DataTable columns={columns} data={pagination.data} page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} pageSize={10} />
      </Card>
    </div>
  )
}
