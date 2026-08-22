import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getEmployees } from '../api/client'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch(() => setError('Could not load employees.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return employees
    return employees.filter(
      (e) =>
        e.name?.toLowerCase().includes(term) ||
        e.email?.toLowerCase().includes(term) ||
        e.department?.toLowerCase().includes(term)
    )
  }, [employees, search])

  return (
    <Layout title="Employees">
      <div className="mb-4">
        <input
          className="input max-w-sm"
          placeholder="Search by name, email, or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <LoadingSpinner label="Loading employees…" />}
      {error && <p className="text-reject text-sm">{error}</p>}

      {!loading && !error && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{emp.name}</td>
                  <td className="px-4 py-3 text-slate-500">{emp.email}</td>
                  <td className="px-4 py-3 text-slate-500">{emp.department || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/employees/${emp.id}`} className="text-flow font-medium hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    No employees match "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
