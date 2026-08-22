import { useEffect, useState } from "react";

function Payroll() {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayroll = async () => {
      try {
        const storedEmployee = localStorage.getItem("employee");

        if (!storedEmployee) {
          throw new Error("Please login first.");
        }

        const employee = JSON.parse(storedEmployee);

        const employeeId =
          employee.id ||
          employee.employee_id ||
          employee.employeeId;

        if (!employeeId) {
          throw new Error("Employee ID is missing.");
        }

        const response = await fetch(
          `/api/payroll/${employeeId}`
        );

        if (!response.ok) {
          throw new Error("Unable to load payroll information.");
        }

        const data = await response.json();
        setPayroll(data);
      } catch (err) {
        setError(err.message || "Unable to load payroll.");
      } finally {
        setLoading(false);
      }
    };

    loadPayroll();
  }, []);

  if (loading) {
    return <p>Loading payroll...</p>;
  }

  if (error) {
    return (
      <div className="error-box">
        <h2>Unable to load payroll</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-heading">
        <h1>Payroll</h1>
        <p>View your salary information.</p>
      </div>

      <div className="payroll-card">
        <h2>Salary Details</h2>

        <div className="payroll-row">
          <span>Basic Salary</span>
          <strong>
            {payroll?.basic_salary ?? payroll?.basicSalary ?? "-"}
          </strong>
        </div>

        <div className="payroll-row">
          <span>Allowances</span>
          <strong>
            {payroll?.allowances ?? "-"}
          </strong>
        </div>

        <div className="payroll-row">
          <span>Deductions</span>
          <strong>
            {payroll?.deductions ?? "-"}
          </strong>
        </div>

        <div className="payroll-row total">
          <span>Net Salary</span>
          <strong>
            {payroll?.net_salary ??
              payroll?.netSalary ??
              "-"}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default Payroll;