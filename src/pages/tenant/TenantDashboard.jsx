import StatCard from "../../components/ui/StatCard"
import Badge from "../../components/ui/Badge"

const stats = [
  { title: "Active Bookings", value: "8", progress: 60, icon: "📘" },
  { title: "Pending Payments", value: "12000", progress: 40, icon: "💳" },
  { title: "Account Validity", value: "100", progress: 100, icon: "✅" },
]

const tableData = [
  { id: 1, date: "2025-01-01", type: "Room Booking", status: "Completed" },
  { id: 2, date: "2025-01-05", type: "Payment", status: "Pending" },
  { id: 3, date: "2025-01-10", type: "Maintenance", status: "In Progress" },
]

const getStatusColor = (status) => {
  if (status === "Completed") return "green"
  if (status === "Pending") return "yellow"
  return "blue"
}

const TenantDashboard = () => {
  const tenantId = localStorage.getItem("tenantId")

  return (
    <div className="space-y-8">

      {/* Header Card */}
      <div className="flex items-center justify-between bg-gradient-to-r
        from-emerald-500 to-teal-500 text-white rounded-2xl p-6 shadow-lg">

        <div>
          <h2 className="text-2xl font-bold">
            Tenant #{tenantId}
          </h2>
          <p className="text-white/80 text-sm">
            Account Overview
          </p>
        </div>

        <Badge text="Active" color="green" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            progress={item.progress}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-800 rounded-2xl border dark:border-slate-700 overflow-hidden shadow-sm">
        <table className="w-full text-sm">

          <thead className="bg-slate-100 dark:bg-slate-700 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((row) => (
              <tr
                key={row.id}
                className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <td className="p-3">{row.id}</td>
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.type}</td>
                <td className="p-3">
                  <Badge
                    text={row.status}
                    color={getStatusColor(row.status)}
                  />
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}

export default TenantDashboard
