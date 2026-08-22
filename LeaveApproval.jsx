import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { getLeaves, approveLeave, rejectLeave } from '../api/client'

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Tracks which specific leave row has a request in flight, so only that
  // row's buttons show a "working" state instead of freezing the whole page.
  const [actingOn, setActingOn] = useState(null)
  const [filter, setFilter] = useState('pending')

  function loadLeaves() {
    setLoading(true)
    getLeaves()
      .then((res) => setLeaves(res.data))
      .catch(() => setError('Could not load leave requests.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadLeaves()
  }, [])

  async function handleDecision(id, action) {
    setActingOn(id)
    setError('')
    try {
      if (action === 'approve') {
        await approveLeave(id)
      } else {
        await rejectLeave(id)
      }
      // Update the record in place instead of re-fetching everything,
      // so the employee-facing status change feels instant here too.
      setLeaves((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: action === 'approve' ? 'Approved' : 'Rejected' } : l))
      )
    } catch {
      setError('That action failed. Please try again.')
    } finally {
      setActingOn(null)
    }
  }

  const visible = leaves.filter((l) => {
    if (filter === 'all') return true
    return l.status?.toLowerCase() === filter
  })

  return (
    <Layout title="Leave Approval">
      <div className="mb-4 flex gap-2">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'bg-ink text-white' : 'btn-ghost'} capitalize text-sm py-1.5`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner label="Loading leave requests…" />}
      {error && <p className="text-reject text-sm mb-3">{error}</p>}

      {!loading && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">To</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((leave) => {
                const isPending = leave.status?.toLowerCase() === 'pending'
                const isActing = actingOn === leave.id
                return (
                  <tr key={leave.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium">{leave.employee_name}</td>
                    <td className="px-4 py-3 text-slate-500">{leave.start_date}</td>
                    <td className="px-4 py-3 text-slate-500">{leave.end_date}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{leave.reason}</td>
                    <td className="px-4 py-3"><StatusBadge status={leave.status} /></td>
                    <td className="px-4 py-3">
                      {isPending && (
                        <div className="flex gap-2 justify-end">
                          <button
                            className="btn-approve py-1.5 px-3"
                            disabled={isActing}
                            onClick={() => handleDecision(leave.id, 'approve')}
                          >
                            {isActing ? '…' : 'Approve'}
                          </button>
                          <button
                            className="btn-reject py-1.5 px-3"
                            disabled={isActing}
                            onClick={() => handleDecision(leave.id, 'reject')}
                          >
                            {isActing ? '…' : 'Reject'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    No {filter !== 'all' ? filter : ''} leave requests.
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
