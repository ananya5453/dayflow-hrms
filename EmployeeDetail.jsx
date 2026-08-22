import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getEmployee } from '../api/client'

export default function EmployeeDetail() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmployee(id)
      .then((res) => setEmployee(res.data))
      .catch(() => setError('Could not load this employee.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <Layout title="Employee Details">
      <Link to="/employees" className="text-sm text-flow hover:underline">← Back to employees</Link>

      {loading && <LoadingSpinner label="Loading employee…" />}
      {error && <p className="text-reject text-sm mt-4">{error}</p>}

      {employee && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card lg:col-span-2">
            <h2 className="text-lg font-bold mb-4">{employee.name}</h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-slate-500">Email</dt>
              <dd>{employee.email || '—'}</dd>
              <dt className="text-slate-500">Department</dt>
              <dd>{employee.department || '—'}</dd>
              <dt className="text-slate-500">Position</dt>
              <dd>{employee.position || '—'}</dd>
              <dt className="text-slate-500">Joined</dt>
              <dd>{employee.joined_date || '—'}</dd>
              <dt className="text-slate-500">Phone</dt>
              <dd>{employee.phone || '—'}</dd>
            </dl>
          </div>

          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wide">Quick actions</h3>
            <Link to={`/attendance?employeeId=${employee.id}`} className="btn-ghost justify-start">
              View attendance
            </Link>
            <Link to={`/payroll?employeeId=${employee.id}`} className="btn-ghost justify-start">
              View / edit payroll
            </Link>
          </div>
        </div>
      )}
    </Layout>
  )
}
