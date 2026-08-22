import { useEffect, useState } from "react";

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getEmployeeId = () => {
    const storedEmployee = localStorage.getItem("employee");

    if (!storedEmployee) {
      throw new Error("Please login first.");
    }

    const employee = JSON.parse(storedEmployee);

    return (
      employee.id ||
      employee.employee_id ||
      employee.employeeId
    );
  };

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const employeeId = getEmployeeId();

      const response = await fetch("/api/leaves");

      if (!response.ok) {
        throw new Error("Unable to load leave records.");
      }

      const data = await response.json();

      const records = Array.isArray(data)
        ? data
        : data.leaves || [];

      // Show only this employee's records if the API returns
      // multiple employee records.
      const employeeLeaves = records.filter((leave) => {
        const id =
          leave.employee_id ||
          leave.employeeId ||
          leave.employee?.id;

        return !id || String(id) === String(employeeId);
      });

      setLeaves(employeeLeaves);
    } catch (err) {
      setError(err.message || "Unable to load leaves.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (endDate < startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setSubmitting(true);

      const employeeId = getEmployeeId();

      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: employeeId,
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason: reason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit leave application."
        );
      }

      setMessage(
        data.message || "Leave application submitted successfully."
      );

      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");

      await loadLeaves();
    } catch (err) {
      setError(
        err.message || "Unable to submit leave application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading leave records...</p>;
  }

  return (
    <div>
      <div className="dashboard-heading">
        <h1>Leave Management</h1>
        <p>Apply for leave and track your requests.</p>
      </div>

      {message && <div className="success-box">{message}</div>}

      {error && <div className="error-box">{error}</div>}

      <div className="leave-layout">

        {/* Application Form */}
        <div className="leave-card">
          <h2>Apply for Leave</h2>

          <form onSubmit={handleSubmit} className="leave-form">

            <label>Leave Type</label>

            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="">Select leave type</option>
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Paid">Paid Leave</option>
            </select>

            <label>Start Date</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label>End Date</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <label>Reason</label>

            <textarea
              rows="4"
              placeholder="Enter reason for leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Apply for Leave"}
            </button>

          </form>
        </div>

        {/* Leave History */}
        <div className="leave-card">
          <h2>My Leave Requests</h2>

          {leaves.length === 0 ? (
            <div className="empty-box">
              No leave applications found.
            </div>
          ) : (
            <div className="leave-list">

              {leaves.map((leave, index) => {
                const status =
                  leave.status || "Pending";

                return (
                  <div
                    className="leave-item"
                    key={leave.id || index}
                  >
                    <div>
                      <strong>
                        {leave.leave_type ||
                          leave.type ||
                          "Leave"}
                      </strong>

                      <p>
                        {leave.start_date || "-"} →{" "}
                        {leave.end_date || "-"}
                      </p>

                      <p>
                        {leave.reason || "No reason provided"}
                      </p>
                    </div>

                    <span
                      className={`status-badge ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Leave;