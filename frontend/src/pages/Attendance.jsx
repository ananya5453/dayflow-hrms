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

  if (loading) {
    return <p>Loading attendance...</p>;
  }

  return (
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
    </div>
  );
}

export default Attendance;