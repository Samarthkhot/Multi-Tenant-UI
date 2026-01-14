import { useEffect, useState } from "react"

const Settings = () => {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <div className="max-w-lg bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6">

      <h2 className="text-2xl font-bold mb-4">
        Settings
      </h2>

      <div className="flex items-center justify-between">
        <span className="text-slate-700 dark:text-slate-200">
          Theme Mode
        </span>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg border dark:border-slate-600
          hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          {theme === "light" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

    </div>
  )
}

export default Settings
