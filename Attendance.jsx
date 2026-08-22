import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmployeeSelect from '../components/EmployeeSelect.jsx'
import { getAttendance } from '../api/client'

export default function Attendance() {
  const [searchParams, setSearchParams] = useSearchParams()
  const employeeId = searchParams.get('employeeId') || ''
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!employeeId) {
      setRecords([])
      return
    }
    setLoading(true)
    setError('')
    getAttendance(employeeId)
      .then((res) => setRecords(res.data))
      .catch(() => setError('Could not load attendance for this employee.'))
      .finally(() => setLoading(false))
  }, [employeeId])

  return (
    <Layout title="Attendance Overview">
      <div className="mb-4">
        <label className="label">Employee</label>
        <EmployeeSelect
          value={employeeId}
          onChange={(id) => setSearchParams(id ? { employeeId: id } : {})}
        />
      </div>

      {loading && <LoadingSpinner label="Loading attendance…" />}
      {error && <p className="text-reject text-sm">{error}</p>}

      {!employeeId && !loading && (
        <p className="text-slate-400 text-sm">Select an employee to see their attendance record.</p>
      )}

      {employeeId && !loading && !error && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Check In</th>
                <th className="px-4 py-3 font-medium">Check Out</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => (
                <tr key={rec.id ?? i} className="border-t border-slate-100">
                  <td className="px-4 py-3">{rec.date}</td>
                  <td className="px-4 py-3 text-slate-500">{rec.check_in || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{rec.check_out || '—'}</td>
                  <td className="px-4 py-3">{rec.status || '—'}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    No attendance records found.
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
