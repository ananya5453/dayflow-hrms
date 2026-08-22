import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getEmployees, getLeaves } from '../api/client'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Two independent calls — Promise.all keeps them concurrent instead of sequential.
    Promise.all([getEmployees(), getLeaves()])
      .then(([empRes, leaveRes]) => {
        const employees = empRes.data
        const leaves = leaveRes.data
        setStats({
          totalEmployees: employees.length,
          pendingLeaves: leaves.filter((l) => l.status?.toLowerCase() === 'pending').length,
          approvedLeaves: leaves.filter((l) => l.status?.toLowerCase() === 'approved').length,
          rejectedLeaves: leaves.filter((l) => l.status?.toLowerCase() === 'rejected').length,
        })
      })
      .catch(() => setError('Could not load dashboard data. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Dashboard">
      {loading && <LoadingSpinner label="Loading dashboard…" />}
      {error && <p className="text-reject text-sm">{error}</p>}

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Employees" value={stats.totalEmployees} />
            <StatCard label="Pending Leaves" value={stats.pendingLeaves} accent="pending" />
            <StatCard label="Approved Leaves" value={stats.approvedLeaves} accent="approve" />
            <StatCard label="Rejected Leaves" value={stats.rejectedLeaves} accent="reject" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <QuickLink to="/employees" title="Employees" desc="View the full employee directory." />
            <QuickLink to="/leaves" title="Leave Approval" desc="Review and act on pending requests." />
            <QuickLink to="/payroll" title="Payroll" desc="Look up or edit an employee's salary." />
          </div>
        </>
      )}
    </Layout>
  )
}

function StatCard({ label, value, accent }) {
  const accentClass =
    accent === 'pending' ? 'text-pending' : accent === 'approve' ? 'text-approve' : accent === 'reject' ? 'text-reject' : 'text-ink'

  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-extrabold font-display mt-1 ${accentClass}`}>{value}</p>
    </div>
  )
}

function QuickLink({ to, title, desc }) {
  return (
    <Link to={to} className="card hover:border-flow transition-colors">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-slate-500 mt-1">{desc}</p>
    </Link>
  )
}
