import { useEffect, useState } from "react";

function Dashboard() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const storedEmployee = localStorage.getItem("employee");

        if (!storedEmployee) {
          setError("Please login first.");
          return;
        }

        const loggedInEmployee = JSON.parse(storedEmployee);

        const employeeId =
          loggedInEmployee.id ||
          loggedInEmployee.employee_id ||
          loggedInEmployee.employeeId;

        if (!employeeId) {
          setError("Employee ID was not returned by the login API.");
          return;
        }

        const response = await fetch(`/api/employees/${employeeId}`);

        if (!response.ok) {
          throw new Error("Failed to load employee information.");
        }

        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        setError(err.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="error-box">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your Dayflow employee portal.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Employee</h3>
          <p>
            {employee?.name ||
              employee?.full_name ||
              employee?.employee_name ||
              "Employee"}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Employee ID</h3>
          <p>
            {employee?.id ||
              employee?.employee_id ||
              "Not available"}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Department</h3>
          <p>{employee?.department || "Not available"}</p>
        </div>

        <div className="dashboard-card">
          <h3>Position</h3>
          <p>
            {employee?.position ||
              employee?.role ||
              "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;