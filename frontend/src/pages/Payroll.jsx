import { useMemo, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const initialPayroll = [
  {
    id: 1,
    employeeId: 'EMP001',
    employee: 'Arjun Kumar',
    department: 'Engineering',
    basicSalary: 45000,
    allowances: 8000,
    deductions: 3000,
    status: 'Processed',
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employee: 'Priya Sharma',
    department: 'Human Resources',
    basicSalary: 42000,
    allowances: 7000,
    deductions: 2500,
    status: 'Processed',
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employee: 'Rahul Menon',
    department: 'Finance',
    basicSalary: 40000,
    allowances: 6000,
    deductions: 2000,
    status: 'Pending',
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employee: 'Ananya Rao',
    department: 'Marketing',
    basicSalary: 38000,
    allowances: 5500,
    deductions: 1800,
    status: 'Pending',
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employee: 'Vikram Singh',
    department: 'Engineering',
    basicSalary: 48000,
    allowances: 9000,
    deductions: 3500,
    status: 'Processed',
  },
]

const departments = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Operations',
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function Payroll() {
  const [payroll, setPayroll] = useState(initialPayroll)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [form, setForm] = useState({
    employee: '',
    employeeId: '',
    department: 'Engineering',
    basicSalary: '',
    allowances: '',
    deductions: '',
  })

  const [formError, setFormError] = useState('')

  const filteredPayroll = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return payroll.filter((record) => {
      const matchesSearch =
        !searchValue ||
        record.employee.toLowerCase().includes(searchValue) ||
        record.employeeId.toLowerCase().includes(searchValue) ||
        record.department.toLowerCase().includes(searchValue)

      const matchesStatus =
        statusFilter === 'All' ||
        record.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [payroll, search, statusFilter])

  const totalPayroll = payroll.reduce(
    (total, record) =>
      total +
      record.basicSalary +
      record.allowances -
      record.deductions,
    0,
  )

  const totalBasicSalary = payroll.reduce(
    (total, record) => total + record.basicSalary,
    0,
  )

  const totalAllowances = payroll.reduce(
    (total, record) => total + record.allowances,
    0,
  )

  const totalDeductions = payroll.reduce(
    (total, record) => total + record.deductions,
    0,
  )

  const processedCount = payroll.filter(
    (record) => record.status === 'Processed',
  ).length

  const pendingCount = payroll.filter(
    (record) => record.status === 'Pending',
  ).length

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const calculatedNetSalary =
    Number(form.basicSalary || 0) +
    Number(form.allowances || 0) -
    Number(form.deductions || 0)

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.employee.trim()) {
      setFormError('Please enter the employee name.')
      return
    }

    if (!form.employeeId.trim()) {
      setFormError('Please enter the employee ID.')
      return
    }

    if (!form.basicSalary || Number(form.basicSalary) <= 0) {
      setFormError('Please enter a valid basic salary.')
      return
    }

    if (Number(form.deductions || 0) > calculatedNetSalary + Number(form.deductions || 0)) {
      setFormError('Deductions cannot exceed the gross salary.')
      return
    }

    const newRecord = {
      id: Date.now(),
      employee: form.employee.trim(),
      employeeId: form.employeeId.trim().toUpperCase(),
      department: form.department,
      basicSalary: Number(form.basicSalary),
      allowances: Number(form.allowances || 0),
      deductions: Number(form.deductions || 0),
      status: 'Pending',
    }

    setPayroll((previous) => [
      ...previous,
      newRecord,
    ])

    setForm({
      employee: '',
      employeeId: '',
      department: 'Engineering',
      basicSalary: '',
      allowances: '',
      deductions: '',
    })
  }

  const processPayroll = (id) => {
    setPayroll((previous) =>
      previous.map((record) =>
        record.id === id
          ? { ...record, status: 'Processed' }
          : record,
      ),
    )
  }

  const deletePayroll = (id) => {
    setPayroll((previous) =>
      previous.filter((record) => record.id !== id),
    )
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">HR MANAGEMENT</p>

          <h1>Payroll Management</h1>

          <p className="subtitle">
            Manage employee salaries, allowances and deductions.
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm font-medium text-gray-500">
            Total Payroll
          </p>

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {formatCurrency(totalPayroll)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Monthly net payroll
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Basic Salaries
          </p>

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {formatCurrency(totalBasicSalary)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Total basic salary
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Allowances
          </p>

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {formatCurrency(totalAllowances)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Total allowances
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Deductions
          </p>

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {formatCurrency(totalDeductions)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Total deductions
          </p>
        </Card>
      </div>

      {/* STATUS */}
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Processed Payroll
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {processedCount}
              </p>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-full bg-green-100 text-xl">
              ✓
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending Payroll
              </p>

              <p className="mt-2 text-2xl font-bold text-orange-600">
                {pendingCount}
              </p>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-full bg-orange-100 text-xl">
              ⏳
            </div>
          </div>
        </Card>
      </div>

      {/* ADD PAYROLL */}
      <Card className="mb-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Payroll Record
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a salary record for an employee.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <Input
            label="Employee Name"
            name="employee"
            value={form.employee}
            onChange={(event) =>
              updateForm(
                'employee',
                event.target.value,
              )
            }
            placeholder="Enter employee name"
            required
          />

          <Input
            label="Employee ID"
            name="employee-id"
            value={form.employeeId}
            onChange={(event) =>
              updateForm(
                'employeeId',
                event.target.value,
              )
            }
            placeholder="Example: EMP008"
            required
          />

          <div>
            <label
              htmlFor="payroll-department"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Department
            </label>

            <select
              id="payroll-department"
              value={form.department}
              onChange={(event) =>
                updateForm(
                  'department',
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Basic Salary"
            name="basic-salary"
            type="number"
            value={form.basicSalary}
            onChange={(event) =>
              updateForm(
                'basicSalary',
                event.target.value,
              )
            }
            placeholder="45000"
            required
          />

          <Input
            label="Allowances"
            name="allowances"
            type="number"
            value={form.allowances}
            onChange={(event) =>
              updateForm(
                'allowances',
                event.target.value,
              )
            }
            placeholder="8000"
          />

          <Input
            label="Deductions"
            name="deductions"
            type="number"
            value={form.deductions}
            onChange={(event) =>
              updateForm(
                'deductions',
                event.target.value,
              )
            }
            placeholder="3000"
          />

          <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Calculated Net Salary
              </span>

              <strong className="text-xl text-gray-900">
                {formatCurrency(
                  calculatedNetSalary,
                )}
              </strong>
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Basic salary + allowances − deductions
            </p>
          </div>

          {formError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 md:col-span-2">
              {formError}
            </div>
          )}

          <div className="flex justify-end md:col-span-2">
            <Button type="submit">
              Add Payroll
            </Button>
          </div>
        </form>
      </Card>

      {/* PAYROLL TABLE */}
      <Card>
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Payroll Records
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review employee salary records.
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="w-full max-w-md">
              <Input
                label="Search"
                name="payroll-search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search employee, ID or department..."
              />
            </div>

            <div>
              <label
                htmlFor="payroll-status"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="payroll-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All</option>
                <option>Processed</option>
                <option>Pending</option>
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
                    Department
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Basic Salary
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Allowances
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Deductions
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Net Salary
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
                {filteredPayroll.map((record) => {
                  const netSalary =
                    record.basicSalary +
                    record.allowances -
                    record.deductions

                  return (
                    <tr
                      key={record.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                            {record.employee.charAt(0)}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {record.employee}
                            </p>

                            <p className="text-xs text-gray-500">
                              {record.employeeId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {record.department}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatCurrency(
                          record.basicSalary,
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-green-600">
                        +{formatCurrency(
                          record.allowances,
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-red-600">
                        -{formatCurrency(
                          record.deductions,
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(netSalary)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            record.status === 'Processed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {record.status === 'Pending' && (
                            <Button
                              type="button"
                              variant="success"
                              onClick={() =>
                                processPayroll(
                                  record.id,
                                )
                              }
                            >
                              Process
                            </Button>
                          )}

                          <Button
                            type="button"
                            variant="danger"
                            onClick={() =>
                              deletePayroll(record.id)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredPayroll.length === 0 && (
              <div className="py-16 text-center">
                <div className="mb-3 text-3xl">
                  🔍
                </div>

                <h3 className="font-semibold text-gray-800">
                  No payroll records found
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

export default Payroll