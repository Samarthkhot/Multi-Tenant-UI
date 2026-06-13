import { useState, useMemo, useCallback } from "react"
import { AuditService } from "../../services"
import { Card, DataTable, SearchInput, Button } from "../../components/ui"

export default function AuditLogs() {
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [page, setPage] = useState(1)

  const pagination = useMemo(() => {
    const filters = {}
    if (search) filters.search = search
    if (actionFilter) filters.action = actionFilter
    return AuditService.getPaginated(page, 20, filters)
  }, [page, search, actionFilter])

  const actions = useMemo(() => AuditService.getActions(), [])

  const handleClear = useCallback(() => {
    AuditService.clearLogs()
    setPage(1)
  }, [])

  const columns = [
    { header: 'Timestamp', accessor: 'timestamp', render: (v) => (
      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{new Date(v).toLocaleString()}</span>
    )},
    { header: 'Action', accessor: 'action', render: (v) => (
      <span className="text-sm font-medium text-slate-900 dark:text-white">{v.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
    )},
    { header: 'Actor', accessor: 'actor' },
    { header: 'Target', accessor: 'target', render: (v) => <span className="font-mono text-xs">{v}</span> },
    { header: 'Details', accessor: 'details', render: (v) => <span className="text-sm text-slate-500 dark:text-slate-400">{v}</span> },
    { header: 'IP', accessor: 'ip', render: (v) => <span className="text-xs font-mono text-slate-400">{v}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Logs</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track all system activities and changes</p>
        </div>
        <Button variant="danger" size="sm" onClick={handleClear}>
          Clear Logs
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search logs..." className="flex-1" />
          <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
            <option value="">All Actions</option>
            {actions.map(a => <option key={a} value={a}>{a.replace(/\./g, ' ')}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={pagination.data} page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} pageSize={20} emptyMessage="No audit logs found" />
      </Card>
    </div>
  )
}
