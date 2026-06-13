import { useEffect } from "react"
import { useAuth, useBilling } from "../../contexts"
import { Card, DataTable } from "../../components/ui"

export default function TenantBilling() {
  const { user } = useAuth()
  const { invoices, tenantSummary, fetchInvoices } = useBilling()

  useEffect(() => {
    if (user?.tenantId) fetchInvoices(user.tenantId)
  }, [user?.tenantId, fetchInvoices])

  const columns = [
    { header: 'Invoice', accessor: 'id', render: (v) => <span className="font-mono font-medium text-slate-900 dark:text-white">{v}</span> },
    { header: 'Period', accessor: 'period', type: 'date' },
    { header: 'Description', accessor: 'description', render: (v) => <span className="text-sm text-slate-500 dark:text-slate-400">{v}</span> },
    { header: 'Amount', accessor: 'amount', type: 'currency', align: 'right' },
    { header: 'Status', accessor: 'status', type: 'badge' },
    { header: 'Paid On', accessor: 'paidAt', render: (v) => v ? new Date(v).toLocaleDateString() : '-' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Billing</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">View your invoices and payment history</p>
      </div>

      {tenantSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding={false} hover={false}>
            <div className="p-5 text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">${tenantSummary.totalBilled.toLocaleString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Billed</p>
            </div>
          </Card>
          <Card padding={false} hover={false}>
            <div className="p-5 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${tenantSummary.totalPaid.toLocaleString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Paid</p>
            </div>
          </Card>
          <Card padding={false} hover={false}>
            <div className="p-5 text-center">
              <p className={`text-2xl font-bold ${tenantSummary.outstanding > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                ${tenantSummary.outstanding.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Outstanding</p>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Invoice History</h3>
        <DataTable columns={columns} data={invoices} emptyMessage="No invoices found" />
      </Card>
    </div>
  )
}
