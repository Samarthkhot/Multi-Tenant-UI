const Profile = () => {
  const role = localStorage.getItem("role")

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">
        Profile
      </h2>

      <p className="text-slate-600 dark:text-slate-300">
        Logged in as: <b>{role}</b>
      </p>
    </div>
  )
}

export default Profile
