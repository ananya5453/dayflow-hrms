import { useMemo, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const initialAttendance = [
  {
    id: 'EMP001',
    name: 'Arjun Kumar',
    department: 'Technology',
    checkIn: '09:02',
    checkOut: '18:04',
    status: 'Present',
  },
  {
    id: 'EMP002',
    name: 'Priya Sharma',
    department: 'Human Resources',
    checkIn: '08:47',
    checkOut: '17:51',
    status: 'Present',
  },
  {
    id: 'EMP003',
    name: 'Rahul Menon',
    department: 'Design',
    checkIn: null,
    checkOut: null,
    status: 'On Leave',
  },
  {
    id: 'EMP004',
    name: 'Ananya Rao',
    department: 'Finance',
    checkIn: '09:31',
    checkOut: null,
    status: 'Late',
  },
  {
    id: 'EMP005',
    name: 'Vikram Singh',
    department: 'Product',
    checkIn: null,
    checkOut: null,
    status: 'Absent',
  },
]

function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return '—'
  }

  const [inHour, inMinute] = checkIn.split(':').map(Number)
  const [outHour, outMinute] = checkOut.split(':').map(Number)

  const start = inHour * 60 + inMinute
  const end = outHour * 60 + outMinute
  const totalMinutes = end - start

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

function Attendance() {
  const [attendance, setAttendance] = useState(initialAttendance)
  const [search, setSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState('2026-08-22')

  const filteredAttendance = useMemo(() => {
    return attendance.filter((employee) => {
      const searchValue = search.toLowerCase()

      return (
        employee.name.toLowerCase().includes(searchValue) ||
        employee.id.toLowerCase().includes(searchValue) ||
        employee.department.toLowerCase().includes(searchValue)
      )
    })
  }, [attendance, search])

  const summary = {
    present: attendance.filter(
      (employee) => employee.status === 'Present',
    ).length,

    absent: attendance.filter(
      (employee) => employee.status === 'Absent',
    ).length,

    leave: attendance.filter(
      (employee) => employee.status === 'On Leave',
    ).length,

    late: attendance.filter(
      (employee) => employee.status === 'Late',
    ).length,
  }

  const handleCheckIn = (id) => {
    const currentTime = new Date().toTimeString().slice(0, 5)

    setAttendance((previous) =>
      previous.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              checkIn: currentTime,
              status: 'Present',
            }
          : employee,
      ),
    )
  }

  const handleCheckOut = (id) => {
    const currentTime = new Date().toTimeString().slice(0, 5)

    setAttendance((previous) =>
      previous.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              checkOut: currentTime,
            }
          : employee,
      ),
    )
  }

  const getStatusClass = (status) => {
    if (status === 'Present') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'Late') {
      return 'bg-orange-100 text-orange-700'
    }

    if (status === 'On Leave') {
      return 'bg-blue-100 text-blue-700'
    }

    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">HR Management</p>
          <h1>Attendance</h1>
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
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div>
            <p className="text-sm text-gray-500">Present</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {summary.present}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Employees present
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-500">Absent</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {summary.absent}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Not checked in
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-500">On Leave</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {summary.leave}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Approved leave
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-500">Late</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {summary.late}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Late arrivals
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="space-y-5">
          <div className="max-w-md">
            <Input
              name="attendance-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employee..."
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Check In</th>
                  <th className="px-4 py-3 font-medium">Check Out</th>
                  <th className="px-4 py-3 font-medium">Working Hours</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 font-semibold text-gray-700">
                          {employee.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {employee.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {employee.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {employee.department}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {employee.checkIn || '—'}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {employee.checkOut || '—'}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-gray-700">
                      {calculateHours(
                        employee.checkIn,
                        employee.checkOut,
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          employee.status,
                        )}`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {!employee.checkIn &&
                          employee.status !== 'On Leave' && (
                            <Button
                              onClick={() =>
                                handleCheckIn(employee.id)
                              }
                            >
                              Check In
                            </Button>
                          )}

                        {employee.checkIn && !employee.checkOut && (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleCheckOut(employee.id)
                            }
                          >
                            Check Out
                          </Button>
                        )}

                        {employee.checkIn && employee.checkOut && (
                          <span className="py-2 text-xs text-gray-400">
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAttendance.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500">
                No attendance records found.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Attendance