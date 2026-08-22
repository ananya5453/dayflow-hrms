import { useEffect, useMemo, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const API_URL = 'http://127.0.0.1:5000'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    designation: '',
    department: '',
    date_of_joining: '',
  })

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('You are not logged in.')
      }

      const response = await fetch(
        `${API_URL}/api/employees`,
        {
          method: 'GET',
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

      setEmployees(
        Array.isArray(data) ? data : [],
      )
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  // =====================================================
  // FILTER EMPLOYEES
  // =====================================================

  const filteredEmployees = useMemo(() => {
    const searchValue = search.toLowerCase().trim()

    return employees.filter((employee) => {
      const firstName =
        employee.first_name || ''

      const lastName =
        employee.last_name || ''

      const fullName =
        `${firstName} ${lastName}`.trim()

      const email =
        employee.email || ''

      const employeeCode =
        employee.employee_code ||
        employee.id?.toString() ||
        ''

      const employeeDepartment =
        employee.department || ''

      const employeeStatus =
        employee.status || 'Active'

      const searchMatch =
        fullName
          .toLowerCase()
          .includes(searchValue) ||
        email
          .toLowerCase()
          .includes(searchValue) ||
        employeeCode
          .toLowerCase()
          .includes(searchValue)

      const departmentMatch =
        department === 'All' ||
        employeeDepartment === department

      const statusMatch =
        status === 'All' ||
        employeeStatus === status

      return (
        searchMatch &&
        departmentMatch &&
        statusMatch
      )
    })
  }, [
    employees,
    search,
    department,
    status,
  ])

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // =====================================================
  // ADD EMPLOYEE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')

      const token =
        localStorage.getItem('token')

      if (!token) {
        throw new Error(
          'You are not logged in.',
        )
      }

      const response = await fetch(
        `${API_URL}/api/employees`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to add employee',
        )
      }

      // Reload employee list
      await loadEmployees()

      // Show temporary login credentials
      window.alert(
        `Employee created successfully!\n\n` +
        `Name: ${data.employee.first_name} ${data.employee.last_name}\n` +
        `Employee ID: ${data.employee.employee_code}\n` +
        `Email: ${form.email}\n` +
        `Temporary Password: ${data.temporary_password}\n\n` +
        `Please save these credentials.`,
      )

      // Reset form
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        designation: '',
        department: '',
        date_of_joining: '',
      })

      setShowModal(false)

    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  const handleDelete = async (employee) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to remove ${employee.first_name} ${employee.last_name}?`,
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      const token =
        localStorage.getItem('token')

      if (!token) {
        throw new Error(
          'You are not logged in.',
        )
      }

      const employeeId =
        employee.id ||
        employee.employee_id

      const response =
        await fetch(
          `${API_URL}/api/employees/${employeeId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to delete employee',
        )
      }

      await loadEmployees()

    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <p className="eyebrow">
            HR Management
          </p>

          <h1>
            Employees
          </h1>

          <p className="subtitle">
            Manage employees, departments and
            employment information.
          </p>

        </div>

        <Button
          onClick={() =>
            setShowModal(true)
          }
        >
          + Add Employee
        </Button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* EMPLOYEE CARD */}

      <Card>

        <div className="space-y-5">

          {/* FILTERS */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <Input
              name="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search by name, email or ID..."
            />

            <select
              value={department}
              onChange={(event) =>
                setDepartment(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >

              <option value="All">
                All Departments
              </option>

              <option value="Technology">
                Technology
              </option>

              <option value="Engineering">
                Engineering
              </option>

              <option value="Human Resources">
                Human Resources
              </option>

              <option value="Design">
                Design
              </option>

              <option value="Finance">
                Finance
              </option>

              <option value="Product">
                Product
              </option>

            </select>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >

              <option value="All">
                All Statuses
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

              <option value="On Leave">
                On Leave
              </option>

            </select>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            {loading ? (

              <div className="py-12 text-center text-sm text-gray-500">
                Loading employees...
              </div>

            ) : (

              <table className="w-full min-w-[950px] text-left">

                <thead>

                  <tr className="border-b border-gray-200 text-sm text-gray-500">

                    <th className="px-4 py-3 font-medium">
                      Employee
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Employee ID
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Role
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Department
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Joining Date
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredEmployees.map(
                    (employee) => {

                      const firstName =
                        employee.first_name ||
                        ''

                      const lastName =
                        employee.last_name ||
                        ''

                      const fullName =
                        `${firstName} ${lastName}`.trim()

                      const employeeId =
                        employee.employee_code ||
                        employee.id

                      const statusValue =
                        employee.status ||
                        'Active'

                      return (

                        <tr
                          key={employee.id}
                          className="border-b border-gray-100 last:border-0"
                        >

                          {/* EMPLOYEE */}

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
                                  {fullName ||
                                    'Unnamed Employee'}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {employee.email ||
                                    'No email'}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* ID */}

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {employeeId}
                          </td>

                          {/* ROLE */}

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {employee.designation ||
                              '—'}
                          </td>

                          {/* DEPARTMENT */}

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {employee.department ||
                              '—'}
                          </td>

                          {/* JOINING DATE */}

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {employee.date_of_joining ||
                              '—'}
                          </td>

                          {/* STATUS */}

                          <td className="px-4 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                statusValue ===
                                'Active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {statusValue}
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-4 py-4">

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  employee,
                                )
                              }
                              className="text-sm font-medium text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>

                          </td>

                        </tr>

                      )
                    },
                  )}

                </tbody>

              </table>

            )}

            {!loading &&
              filteredEmployees.length ===
                0 && (
                <div className="py-12 text-center text-sm text-gray-500">
                  No employees found.
                </div>
              )}

          </div>

        </div>

      </Card>

      {/* =================================================
          ADD EMPLOYEE MODAL
          ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            {/* MODAL HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Add Employee
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new employee to DayFlow.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Input
                  label="First Name"
                  name="first_name"
                  value={
                    form.first_name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="First name"
                  required
                />

                <Input
                  label="Last Name"
                  name="last_name"
                  value={
                    form.last_name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Last name"
                  required
                />

              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={
                  handleChange
                }
                placeholder="employee@company.com"
                required
              />

              <Input
                label="Job Role"
                name="designation"
                value={
                  form.designation
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Software Engineer"
                required
              />

              {/* DEPARTMENT */}

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Department
                </label>

                <select
                  name="department"
                  value={
                    form.department
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >

                  <option value="">
                    Select department
                  </option>

                  <option value="Technology">
                    Technology
                  </option>

                  <option value="Engineering">
                    Engineering
                  </option>

                  <option value="Human Resources">
                    Human Resources
                  </option>

                  <option value="Design">
                    Design
                  </option>

                  <option value="Finance">
                    Finance
                  </option>

                  <option value="Product">
                    Product
                  </option>

                </select>

              </div>

              {/* DATE */}

              <div>

                <label
                  htmlFor="date-of-joining"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Date of Joining
                </label>

                <input
                  id="date-of-joining"
                  type="date"
                  name="date_of_joining"
                  value={
                    form.date_of_joining
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4">

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setShowModal(false)
                  }
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? 'Adding...'
                    : 'Add Employee'}
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default Employees
