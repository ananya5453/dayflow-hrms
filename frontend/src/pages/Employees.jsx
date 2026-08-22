import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const initialEmployees = [
  {
    id: 'EMP001',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@dayflow.com',
    role: 'Software Engineer',
    department: 'Technology',
    status: 'Active',
    joiningDate: '2025-06-12',
  },
  {
    id: 'EMP002',
    name: 'Priya Sharma',
    email: 'priya.sharma@dayflow.com',
    role: 'HR Manager',
    department: 'Human Resources',
    status: 'Active',
    joiningDate: '2024-08-19',
  },
  {
    id: 'EMP003',
    name: 'Rahul Menon',
    email: 'rahul.menon@dayflow.com',
    role: 'UI/UX Designer',
    department: 'Design',
    status: 'On Leave',
    joiningDate: '2025-01-08',
  },
  {
    id: 'EMP004',
    name: 'Ananya Rao',
    email: 'ananya.rao@dayflow.com',
    role: 'Financial Analyst',
    department: 'Finance',
    status: 'Active',
    joiningDate: '2023-11-20',
  },
  {
    id: 'EMP005',
    name: 'Vikram Singh',
    email: 'vikram.singh@dayflow.com',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
    joiningDate: '2024-03-15',
  },
]

function Employees() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
  })

  const filteredEmployees = employees.filter((employee) => {
    const searchMatch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.id.toLowerCase().includes(search.toLowerCase())

    const departmentMatch =
      department === 'All' || employee.department === department

    const statusMatch = status === 'All' || employee.status === status

    return searchMatch && departmentMatch && statusMatch
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const newEmployee = {
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: form.name,
      email: form.email,
      role: form.role,
      department: form.department,
      status: 'Active',
      joiningDate: new Date().toISOString().split('T')[0],
    }

    setEmployees((previous) => [...previous, newEmployee])

    setForm({
      name: '',
      email: '',
      role: '',
      department: '',
    })

    setShowModal(false)
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to remove this employee?',
    )

    if (confirmed) {
      setEmployees((previous) =>
        previous.filter((employee) => employee.id !== id),
      )
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">HR Management</p>
          <h1>Employees</h1>
          <p className="subtitle">
            Manage employees, departments and employment information.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)}>
          + Add Employee
        </Button>
      </div>

      <Card>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or ID..."
            />

            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All Departments</option>
              <option value="Technology">Technology</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Design">Design</option>
              <option value="Finance">Finance</option>
              <option value="Product">Product</option>
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Employee ID</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
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
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {employee.id}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {employee.role}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {employee.department}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          employee.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(employee.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEmployees.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500">
                No employees found.
              </div>
            )}
          </div>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
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
                onClick={() => setShowModal(false)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="employee@company.com"
                required
              />

              <Input
                label="Job Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
                required
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Department
                </label>

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select department</option>
                  <option value="Technology">Technology</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Design">Design</option>
                  <option value="Finance">Finance</option>
                  <option value="Product">Product</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>

                <Button type="submit">
                  Add Employee
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