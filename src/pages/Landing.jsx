import { useNavigate } from "react-router-dom"

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">

      {/* Decorative Blur Circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse" />

      {/* Main Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-4xl w-full text-white">

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-3 tracking-wide">
          Tekno Tantra 🚀
        </h1>

        <p className="text-center text-white/80 mb-10">
          Multi-Tenant Admin Dashboard Platform
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Admin Card */}
          <div
            onClick={() => navigate("/admin-login")}
            className="cursor-pointer group bg-white/10 border border-white/20 rounded-2xl p-8
            hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <h2 className="text-2xl font-bold mb-2">
              🧑‍💼 Admin Portal
            </h2>
            <p className="text-white/80 mb-6">
              Manage tenants, monitor analytics, and configure system settings.
            </p>

            <button className="px-5 py-2 rounded-lg bg-white text-purple-700 font-semibold group-hover:bg-purple-600 group-hover:text-white transition">
              Enter Admin →
            </button>
          </div>

          {/* Tenant Card */}
          <div
            onClick={() => navigate("/tenant-login")}
            className="cursor-pointer group bg-white/10 border border-white/20 rounded-2xl p-8
            hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <h2 className="text-2xl font-bold mb-2">
              🏢 Tenant Portal
            </h2>
            <p className="text-white/80 mb-6">
              View bookings, payments, and manage your tenant profile easily.
            </p>

            <button className="px-5 py-2 rounded-lg bg-white text-pink-600 font-semibold group-hover:bg-pink-600 group-hover:text-white transition">
              Enter Tenant →
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Landing
