import { useEffect, useMemo, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const API_URL = 'http://127.0.0.1:5000'

function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return '—'
  }

  const start = new Date(checkIn)
  const end = new Date(checkOut)

  const totalMinutes = Math.max(
    0,
    Math.round((end - start) / 60000),
  )

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

function formatTime(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function Attendance() {
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState({})
  const [search, setSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  )

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState('')

  // --------------------------------------------------
  // LOAD EMPLOYEES
  // --------------------------------------------------

  const loadEmployees = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('You are not logged in.')
    }

    const response = await fetch(
      `${API_URL}/api/employees`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to load employees',
      )
    }

    return Array.isArray(data) ? data : []
  }

  // --------------------------------------------------
  // LOAD ATTENDANCE FOR EMPLOYEE
  // --------------------------------------------------

  const loadEmployeeAttendance = async (employee) => {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('You are not logged in.')
    }

    const employeeId =
      employee.id || employee.employee_id

    const response = await fetch(
      `${API_URL}/api/attendance/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to load attendance',
      )
    }

    return {
      employeeId,
      records: Array.isArray(data) ? data : [],
    }
  }

  // --------------------------------------------------
  // LOAD EVERYTHING
  // --------------------------------------------------

  const loadAttendance = async () => {
    try {
      setLoading(true)
      setError('')

      const employeeData = await loadEmployees()

      setEmployees(employeeData)

      const attendanceMap = {}

      for (const employee of employeeData) {
        try {
          const result =
            await loadEmployeeAttendance(employee)

          attendanceMap[result.employeeId] =
            result.records
        } catch (err) {
          console.error(
            `Attendance error for employee ${employee.id}:`,
            err,
          )

          attendanceMap[
            employee.id || employee.employee_id
          ] = []
        }
      }

      setAttendance(attendanceMap)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAttendance()
  }, [])

  // --------------------------------------------------
  // GET RECORD FOR SELECTED DATE
  // --------------------------------------------------

  const getRecordForDate = (employee) => {
    const employeeId =
      employee.id || employee.employee_id

    const records = attendance[employeeId] || []

    return (
      records.find(
        (record) => record.date === selectedDate,
      ) || null
    )
  }

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredEmployees = useMemo(() => {
    const searchValue = search.toLowerCase()

    return employees.filter((employee) => {
      const firstName =
        employee.first_name || ''

      const lastName =
        employee.last_name || ''

      const fullName =
        `${firstName} ${lastName}`.trim()

      const employeeCode =
        employee.employee_code ||
        employee.id?.toString() ||
        ''

      const department =
        employee.department || ''

      return (
        fullName
          .toLowerCase()
          .includes(searchValue) ||
        employeeCode
          .toLowerCase()
          .includes(searchValue) ||
        department
          .toLowerCase()
          .includes(searchValue)
      )
    })
  }, [employees, search])

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  const summary = {
    present: 0,
    absent: 0,
    leave: 0,
    late: 0,
  }

  filteredEmployees.forEach((employee) => {
    const record = getRecordForDate(employee)

    if (!record) {
      summary.absent += 1
      return
    }

    if (record.status === 'present') {
      summary.present += 1
    } else if (record.status === 'leave') {
      summary.leave += 1
    } else if (record.status === 'half-day') {
      summary.late += 1
    } else {
      summary.absent += 1
    }
  })

  // --------------------------------------------------
  // CHECK IN
  // --------------------------------------------------

  const handleCheckIn = async (employee) => {
    try {
      setActionLoading(employee.id)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('You are not logged in.')
      }

      const response = await fetch(
        `${API_URL}/api/attendance/check-in`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Check-in failed',
        )
      }

      await loadAttendance()
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  // --------------------------------------------------
  // CHECK OUT
  // --------------------------------------------------

  const handleCheckOut = async (employee) => {
    try {
      setActionLoading(employee.id)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('You are not logged in.')
      }

      const response = await fetch(
        `${API_URL}/api/attendance/check-out`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Check-out failed',
        )
      }

      await loadAttendance()
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  // --------------------------------------------------
  // STATUS STYLE
  // --------------------------------------------------

  const getStatusClass = (status) => {
    if (status === 'present') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'half-day') {
      return 'bg-orange-100 text-orange-700'
    }

    if (status === 'leave') {
      return 'bg-blue-100 text-blue-700'
    }

    return 'bg-red-100 text-red-700'
  }

  const getStatusText = (status) => {
    if (status === 'present') {
      return 'Present'
    }

    if (status === 'half-day') {
      return 'Half Day'
    }

    if (status === 'leave') {
      return 'On Leave'
    }

    return 'Absent'
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>

          <p className="eyebrow">
            HR Management
          </p>

          <h1>
            Attendance
          </h1>

          <p className="subtitle">
            Track employee attendance and working hours.
          </p>

        </div>

        <div>

          <label
            htmlFor="attendance-date"
            className="mb-1 block text-xs text-gray-500"
          >
            Attendance Date
          </label>

          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUMMARY */}

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <p className="text-sm text-gray-500">
            Present
          </p>

          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {summary.present}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Employees present
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Absent
          </p>

          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {summary.absent}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Not checked in
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            On Leave
          </p>

          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {summary.leave}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Approved leave
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Half Day
          </p>

          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {summary.late}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Less than 4 hours
          </p>
        </Card>

      </div>

      {/* TABLE */}

      <Card>

        <div className="space-y-5">

          <div className="max-w-md">

            <Input
              name="attendance-search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search employee..."
            />

          </div>

          {loading ? (

            <div className="py-12 text-center text-sm text-gray-500">
              Loading attendance...
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px] text-left">

                <thead>

                  <tr className="border-b border-gray-200 text-sm text-gray-500">

                    <th className="px-4 py-3 font-medium">
                      Employee
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Department
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Check In
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Check Out
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Working Hours
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

                  {filteredEmployees.map((employee) => {

                    const employeeId =
                      employee.id ||
                      employee.employee_id

                    const record =
                      getRecordForDate(employee)

                    const firstName =
                      employee.first_name || ''

                    const lastName =
                      employee.last_name || ''

                    const fullName =
                      `${firstName} ${lastName}`.trim()

                    const status =
                      record?.status || 'absent'

                    return (

                      <tr
                        key={employeeId}
                        className="border-b border-gray-100 last:border-0"
                      >

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 font-semibold text-gray-700">

                              {firstName
                                ? firstName
                                    .charAt(0)
                                    .toUpperCase()
                                : 'E'}

                            </div>

                            <div>

                              <p className="font-medium text-gray-900">
                                {fullName || 'Unnamed Employee'}
                              </p>

                              <p className="text-xs text-gray-500">
                                {employee.employee_code ||
                                  employeeId}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {employee.department || '—'}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatTime(record?.check_in)}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatTime(record?.check_out)}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-gray-700">

                          {record?.work_hours
                            ? `${record.work_hours}h`
                            : calculateHours(
                                record?.check_in,
                                record?.check_out,
                              )}

                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              status,
                            )}`}
                          >
                            {getStatusText(status)}
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <div className="flex gap-2">

                            {!record?.check_in && (
                              <Button
                                disabled={
                                  actionLoading ===
                                  employeeId
                                }
                                onClick={() =>
                                  handleCheckIn(employee)
                                }
                              >
                                {actionLoading ===
                                employeeId
                                  ? 'Checking...'
                                  : 'Check In'}
                              </Button>
                            )}

                            {record?.check_in &&
                              !record?.check_out && (
                                <Button
                                  variant="secondary"
                                  disabled={
                                    actionLoading ===
                                    employeeId
                                  }
                                  onClick={() =>
                                    handleCheckOut(
                                      employee,
                                    )
                                  }
                                >
                                  {actionLoading ===
                                  employeeId
                                    ? 'Checking...'
                                    : 'Check Out'}
                                </Button>
                              )}

                            {record?.check_in &&
                              record?.check_out && (
                                <span className="py-2 text-xs text-gray-400">
                                  Completed
                                </span>
                              )}

                          </div>

                        </td>

                      </tr>

                    )
                  })}

                </tbody>

              </table>

              {filteredEmployees.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-500">
                  No employees found.
                </div>
              )}

            </div>

          )}

        </div>

      </Card>

    </div>
  )
}

export default Attendance