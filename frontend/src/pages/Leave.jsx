import { useMemo, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const initialRequests = [
  {
    id: 1,
    employee: 'Rahul Menon',
    employeeId: 'EMP003',
    type: 'Sick Leave',
    startDate: '2026-08-24',
    endDate: '2026-08-25',
    reason: 'Not feeling well.',
    status: 'Pending',
  },
  {
    id: 2,
    employee: 'Priya Sharma',
    employeeId: 'EMP002',
    type: 'Casual Leave',
    startDate: '2026-08-28',
    endDate: '2026-08-28',
    reason: 'Personal work.',
    status: 'Approved',
  },
  {
    id: 3,
    employee: 'Ananya Rao',
    employeeId: 'EMP004',
    type: 'Annual Leave',
    startDate: '2026-09-02',
    endDate: '2026-09-05',
    reason: 'Family vacation.',
    status: 'Pending',
  },
  {
    id: 4,
    employee: 'Vikram Singh',
    employeeId: 'EMP005',
    type: 'Casual Leave',
    startDate: '2026-08-20',
    endDate: '2026-08-20',
    reason: 'Personal appointment.',
    status: 'Rejected',
  },
]

const employees = [
  {
    name: 'Jeeval',
    id: 'ADMIN001',
  },
  {
    name: 'Arjun Kumar',
    id: 'EMP001',
  },
  {
    name: 'Priya Sharma',
    id: 'EMP002',
  },
  {
    name: 'Rahul Menon',
    id: 'EMP003',
  },
  {
    name: 'Ananya Rao',
    id: 'EMP004',
  },
  {
    name: 'Vikram Singh',
    id: 'EMP005',
  },
  {
    name: 'Karan Patel',
    id: 'EMP006',
  },
  {
    name: 'Sneha Iyer',
    id: 'EMP007',
  },
]

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0
  }

  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)

  const difference = end.getTime() - start.getTime()
  const days = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1

  return days > 0 ? days : 0
}

function formatDate(date) {
  if (!date) {
    return '—'
  }

  const [year, month, day] = date.split('-')

  return `${day}/${month}/${year}`
}

function Leave() {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [form, setForm] = useState({
    employee: 'Jeeval',
    employeeId: 'ADMIN001',
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  })

  const [formError, setFormError] = useState('')

  const filteredRequests = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesSearch =
        !searchValue ||
        request.employee.toLowerCase().includes(searchValue) ||
        request.employeeId.toLowerCase().includes(searchValue) ||
        request.type.toLowerCase().includes(searchValue)

      const matchesStatus =
        statusFilter === 'All' ||
        request.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, search, statusFilter])

  const pendingCount = requests.filter(
    (request) => request.status === 'Pending',
  ).length

  const approvedCount = requests.filter(
    (request) => request.status === 'Approved',
  ).length

  const rejectedCount = requests.filter(
    (request) => request.status === 'Rejected',
  ).length

  const totalLeaveDays = requests
    .filter((request) => request.status === 'Approved')
    .reduce(
      (total, request) =>
        total +
        calculateDays(request.startDate, request.endDate),
      0,
    )

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value

    const selectedEmployee = employees.find(
      (employee) => employee.id === employeeId,
    )

    if (!selectedEmployee) {
      return
    }

    setForm((previous) => ({
      ...previous,
      employee: selectedEmployee.name,
      employeeId: selectedEmployee.id,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.startDate || !form.endDate) {
      setFormError('Please select both start and end dates.')
      return
    }

    if (form.endDate < form.startDate) {
      setFormError(
        'End date cannot be earlier than the start date.',
      )
      return
    }

    if (!form.reason.trim()) {
      setFormError('Please enter a reason for the leave.')
      return
    }

    const newRequest = {
      id: Date.now(),
      employee: form.employee,
      employeeId: form.employeeId,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason.trim(),
      status: 'Pending',
    }

    setRequests((previous) => [
      newRequest,
      ...previous,
    ])

    setForm({
      employee: 'Jeeval',
      employeeId: 'ADMIN001',
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
    })
  }

  const updateRequestStatus = (id, status) => {
    setRequests((previous) =>
      previous.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
            }
          : request,
      ),
    )
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700'

      case 'Rejected':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-orange-100 text-orange-700'
    }
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">HR MANAGEMENT</p>

          <h1>Leave Management</h1>

          <p className="subtitle">
            Manage employee leave requests and approvals.
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm font-medium text-gray-500">
            Pending Requests
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {pendingCount}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Awaiting approval
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Approved
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {approvedCount}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Approved requests
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Rejected
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {rejectedCount}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Rejected requests
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Approved Days
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {totalLeaveDays}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Total approved leave days
          </p>
        </Card>
      </div>

      {/* APPLY LEAVE */}
      <Card className="mb-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Apply for Leave
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Submit a new leave request for an employee.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {/* EMPLOYEE */}
          <div>
            <label
              htmlFor="leave-employee"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Employee
            </label>

            <select
              id="leave-employee"
              value={form.employeeId}
              onChange={handleEmployeeChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name} ({employee.id})
                </option>
              ))}
            </select>
          </div>

          {/* LEAVE TYPE */}
          <div>
            <label
              htmlFor="leave-type"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Leave Type
            </label>

            <select
              id="leave-type"
              value={form.type}
              onChange={(event) =>
                updateForm('type', event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Annual Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>

          {/* START DATE */}
          <Input
            label="Start Date"
            name="leave-start"
            type="date"
            value={form.startDate}
            onChange={(event) =>
              updateForm('startDate', event.target.value)
            }
            required
          />

          {/* END DATE */}
          <Input
            label="End Date"
            name="leave-end"
            type="date"
            value={form.endDate}
            onChange={(event) =>
              updateForm('endDate', event.target.value)
            }
            required
          />

          {/* REASON */}
          <div className="md:col-span-2">
            <label
              htmlFor="leave-reason"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Reason
            </label>

            <textarea
              id="leave-reason"
              rows="3"
              value={form.reason}
              onChange={(event) =>
                updateForm('reason', event.target.value)
              }
              placeholder="Enter reason for leave..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* DAYS */}
          {form.startDate && form.endDate && (
            <div className="rounded-lg bg-indigo-50 p-4 md:col-span-2">
              <p className="text-sm text-indigo-600">
                Requested Leave
              </p>

              <p className="mt-1 text-xl font-semibold text-indigo-900">
                {calculateDays(
                  form.startDate,
                  form.endDate,
                )}{' '}
                day
                {calculateDays(
                  form.startDate,
                  form.endDate,
                ) !== 1
                  ? 's'
                  : ''}
              </p>
            </div>
          )}

          {/* ERROR */}
          {formError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 md:col-span-2">
              {formError}
            </div>
          )}

          {/* SUBMIT */}
          <div className="flex justify-end md:col-span-2">
            <Button type="submit">
              Submit Leave Request
            </Button>
          </div>
        </form>
      </Card>

      {/* REQUESTS */}
      <Card>
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Leave Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage employee leave applications.
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="w-full max-w-md">
              <Input
                label="Search"
                name="leave-search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search employee or leave type..."
              />
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-500">
                  <th className="px-4 py-3 font-medium">
                    Employee
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Leave Type
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Dates
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Days
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Reason
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    {/* EMPLOYEE */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                          {request.employee.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {request.employee}
                          </p>

                          <p className="text-xs text-gray-500">
                            {request.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {request.type}
                    </td>

                    {/* DATES */}
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div>
                        {formatDate(request.startDate)}
                      </div>

                      {request.startDate !==
                        request.endDate && (
                        <div>
                          {formatDate(request.endDate)}
                        </div>
                      )}
                    </td>

                    {/* DAYS */}
                    <td className="px-4 py-4 text-sm font-medium text-gray-700">
                      {calculateDays(
                        request.startDate,
                        request.endDate,
                      )}
                    </td>

                    {/* REASON */}
                    <td className="max-w-[220px] px-4 py-4 text-sm text-gray-600">
                      <span className="line-clamp-2">
                        {request.reason}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          request.status,
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-4">
                      {request.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="success"
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                'Approved',
                              )
                            }
                          >
                            Approve
                          </Button>

                          <Button
                            type="button"
                            variant="danger"
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                'Rejected',
                              )
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No action
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRequests.length === 0 && (
              <div className="py-16 text-center">
                <div className="mb-3 text-3xl">
                  🔍
                </div>

                <h3 className="font-semibold text-gray-800">
                  No leave requests found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or status filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Leave