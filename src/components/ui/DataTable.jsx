import { useState } from 'react'
import Button from './Button'

export default function DataTable({
  columns = [],
  data = [],
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  onSort,
  sortField,
  sortDirection,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
  keyField = 'id',
  selectedId,
  pageSize = 10
}) {
  const [expandedRow, setExpandedRow] = useState(null)

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj)
  }

  const renderCell = (column, row) => {
    const value = column.accessor ? getNestedValue(row, column.accessor) : null

    if (column.render) return column.render(value, row)

    if (column.type === 'badge') {
      const colors = {
        active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        member: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        business: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        starter: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        super_admin: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
      }
      return (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-slate-100 text-slate-600'}`}>
          {value}
        </span>
      )
    }

    if (column.type === 'currency') {
      return <span className="font-mono">${typeof value === 'number' ? value.toLocaleString() : value}</span>
    }

    if (column.type === 'date') {
      return <span className="text-slate-500 dark:text-slate-400 text-sm">{value ? new Date(value).toLocaleDateString() : '-'}</span>
    }

    if (column.type === 'number') {
      return <span className="font-mono text-right">{typeof value === 'number' ? value.toLocaleString() : value}</span>
    }

    return <span>{value || '-'}</span>
  }

  const handleSort = (field) => {
    if (!onSort) return
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(field, direction)
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => col.sortable !== false && col.accessor ? handleSort(col.accessor) : undefined}
                  className={`
                    px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider
                    text-slate-500 dark:text-slate-400
                    ${col.sortable !== false && col.accessor ? 'cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none' : ''}
                    ${col.align === 'right' ? 'text-right' : ''}
                  `}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && col.accessor && sortField === col.accessor && (
                      <svg className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row[keyField]}
                  onClick={() => {
                    if (onRowClick) onRowClick(row)
                    setExpandedRow(expandedRow === row[keyField] ? null : row[keyField])
                  }}
                  className={`
                    transition-colors duration-150
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${selectedId === row[keyField] ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                  `}
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className={`px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300 ${col.align === 'right' ? 'text-right' : ''}`}
                    >
                      {renderCell(col, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange?.(i + 1)}
                className={`
                  min-w-[2rem] h-8 rounded-lg text-sm font-medium transition
                  ${page === i + 1
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
              >
                {i + 1}
              </button>
            ))}
            <Button
              variant="ghost" size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
