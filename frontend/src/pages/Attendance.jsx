import { useEffect, useState } from "react";

function Attendance() {
  const [employeeId, setEmployeeId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const storedEmployee = localStorage.getItem("employee");

        if (!storedEmployee) {
          throw new Error("Please login first.");
        }

        const employee = JSON.parse(storedEmployee);

        const id =
          employee.id ||
          employee.employee_id ||
          employee.employeeId;

        if (!id) {
          throw new Error("Employee ID is missing.");
        }

        setEmployeeId(id);

        const response = await fetch(`/api/attendance/${id}`);

        if (!response.ok) {
          throw new Error("Unable to load attendance history.");
        }

        const data = await response.json();

        setAttendance(Array.isArray(data) ? data : data.attendance || []);
      } catch (err) {
        setError(err.message || "Unable to load attendance.");
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  const handleAttendanceAction = async (action) => {
    setActionLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/attendance/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: employeeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Unable to ${action.replace("-", " ")}.`
        );
      }

      setMessage(
        data.message ||
          `Successfully completed ${action.replace("-", " ")}.`
      );

      // Refresh attendance history
      const historyResponse = await fetch(
        `/api/attendance/${employeeId}`
      );

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();

        setAttendance(
          Array.isArray(historyData)
            ? historyData
            : historyData.attendance || []
        );
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

<<<<<<< HEAD
  if (loading) {
    return <p>Loading attendance...</p>;
=======
    if (status === 'half-day') {
      return 'bg-orange-100 text-orange-700'
    }

    if (status === 'leave') {
      return 'bg-blue-100 text-blue-700'
    }

    return 'bg-red-100 text-red-700'
>>>>>>> origin/main
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
<<<<<<< HEAD
    <div>
      <div className="dashboard-heading">
        <h1>Attendance</h1>
        <p>Manage your daily attendance.</p>
      </div>

      {message && <div className="success-box">{message}</div>}

      {error && <div className="error-box">{error}</div>}

      <div className="attendance-actions">
        <button
          className="attendance-button"
          disabled={actionLoading}
          onClick={() => handleAttendanceAction("check-in")}
        >
          {actionLoading ? "Processing..." : "Check In"}
        </button>

        <button
          className="attendance-button checkout"
          disabled={actionLoading}
          onClick={() => handleAttendanceAction("check-out")}
        >
          {actionLoading ? "Processing..." : "Check Out"}
        </button>
      </div>

      <div className="attendance-section">
        <h2>Attendance History</h2>

        {attendance.length === 0 ? (
          <div className="empty-box">
            No attendance records found.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map((record, index) => (
                  <tr key={record.id || index}>
                    <td>
                      {record.date ||
                        record.attendance_date ||
                        "-"}
                    </td>

                    <td>
                      {record.check_in ||
                        record.check_in_time ||
                        "-"}
                    </td>

                    <td>
                      {record.check_out ||
                        record.check_out_time ||
                        "-"}
                    </td>

                    <td>
                      {record.status || "Present"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
=======
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

>>>>>>> origin/main
    </div>
  );
}

export default Attendance;