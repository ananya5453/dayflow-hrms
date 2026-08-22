import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 hidden sm:inline">
          {user?.name} · <span className="capitalize">{user?.role}</span>
        </span>
        <button onClick={handleLogout} className="btn-ghost text-sm">
          Log out
        </button>
      </div>
    </header>
  )
}
