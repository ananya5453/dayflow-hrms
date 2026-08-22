import { useMemo, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const initialReviews = [
  {
    id: 1,
    employeeId: 'EMP001',
    employee: 'Arjun Kumar',
    department: 'Engineering',
    reviewPeriod: 'Q2 2026',
    score: 92,
    rating: 'Excellent',
    goal: 'Complete platform migration',
    feedback: 'Consistently delivers high-quality work and supports the engineering team.',
    status: 'Completed',
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employee: 'Priya Sharma',
    department: 'Human Resources',
    reviewPeriod: 'Q2 2026',
    score: 87,
    rating: 'Very Good',
    goal: 'Improve employee engagement',
    feedback: 'Strong communication skills and excellent employee coordination.',
    status: 'Completed',
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employee: 'Rahul Menon',
    department: 'Finance',
    reviewPeriod: 'Q2 2026',
    score: 78,
    rating: 'Good',
    goal: 'Improve financial reporting',
    feedback: 'Good performance with opportunities to improve reporting efficiency.',
    status: 'Under Review',
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employee: 'Ananya Rao',
    department: 'Marketing',
    reviewPeriod: 'Q2 2026',
    score: 71,
    rating: 'Good',
    goal: 'Increase campaign conversion',
    feedback: 'Shows good creativity and is progressing toward campaign targets.',
    status: 'Under Review',
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employee: 'Vikram Singh',
    department: 'Engineering',
    reviewPeriod: 'Q2 2026',
    score: 95,
    rating: 'Outstanding',
    goal: 'Lead new product development',
    feedback: 'Outstanding technical leadership and excellent project ownership.',
    status: 'Completed',
  },
]

const departments = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Operations',
]

const reviewPeriods = [
  'Q1 2026',
  'Q2 2026',
  'Q3 2026',
  'Q4 2026',
]

function getRating(score) {
  const numericScore = Number(score)

  if (numericScore >= 90) {
    return 'Excellent'
  }

  if (numericScore >= 80) {
    return 'Very Good'
  }

  if (numericScore >= 70) {
    return 'Good'
  }

  if (numericScore >= 60) {
    return 'Needs Improvement'
  }

  return 'Unsatisfactory'
}

function getRatingClass(rating) {
  switch (rating) {
    case 'Outstanding':
    case 'Excellent':
      return 'bg-green-100 text-green-700'

    case 'Very Good':
      return 'bg-blue-100 text-blue-700'

    case 'Good':
      return 'bg-indigo-100 text-indigo-700'

    case 'Needs Improvement':
      return 'bg-orange-100 text-orange-700'

    default:
      return 'bg-red-100 text-red-700'
  }
}

function Performance() {
  const [reviews, setReviews] = useState(initialReviews)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [ratingFilter, setRatingFilter] = useState('All')

  const [form, setForm] = useState({
    employee: '',
    employeeId: '',
    department: 'Engineering',
    reviewPeriod: 'Q2 2026',
    score: '',
    goal: '',
    feedback: '',
  })

  const [formError, setFormError] = useState('')

  const filteredReviews = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return reviews.filter((review) => {
      const matchesSearch =
        !searchValue ||
        review.employee.toLowerCase().includes(searchValue) ||
        review.employeeId.toLowerCase().includes(searchValue) ||
        review.department.toLowerCase().includes(searchValue) ||
        review.goal.toLowerCase().includes(searchValue)

      const matchesStatus =
        statusFilter === 'All' ||
        review.status === statusFilter

      const matchesRating =
        ratingFilter === 'All' ||
        review.rating === ratingFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRating
      )
    })
  }, [reviews, search, statusFilter, ratingFilter])

  const averageScore =
    reviews.length > 0
      ? Math.round(
          reviews.reduce(
            (total, review) =>
              total + Number(review.score),
            0,
          ) / reviews.length,
        )
      : 0

  const completedReviews = reviews.filter(
    (review) => review.status === 'Completed',
  ).length

  const underReview = reviews.filter(
    (review) => review.status === 'Under Review',
  ).length

  const excellentReviews = reviews.filter(
    (review) => Number(review.score) >= 90,
  ).length

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError('')

    const score = Number(form.score)

    if (!form.employee.trim()) {
      setFormError('Please enter the employee name.')
      return
    }

    if (!form.employeeId.trim()) {
      setFormError('Please enter the employee ID.')
      return
    }

    if (!form.goal.trim()) {
      setFormError('Please enter the performance goal.')
      return
    }

    if (!form.score || score < 0 || score > 100) {
      setFormError(
        'Performance score must be between 0 and 100.',
      )
      return
    }

    if (!form.feedback.trim()) {
      setFormError('Please enter manager feedback.')
      return
    }

    const newReview = {
      id: Date.now(),
      employee: form.employee.trim(),
      employeeId: form.employeeId.trim().toUpperCase(),
      department: form.department,
      reviewPeriod: form.reviewPeriod,
      score,
      rating: getRating(score),
      goal: form.goal.trim(),
      feedback: form.feedback.trim(),
      status: 'Under Review',
    }

    setReviews((previous) => [
      ...previous,
      newReview,
    ])

    setForm({
      employee: '',
      employeeId: '',
      department: 'Engineering',
      reviewPeriod: 'Q2 2026',
      score: '',
      goal: '',
      feedback: '',
    })
  }

  const completeReview = (id) => {
    setReviews((previous) =>
      previous.map((review) =>
        review.id === id
          ? {
              ...review,
              status: 'Completed',
            }
          : review,
      ),
    )
  }

  const deleteReview = (id) => {
    setReviews((previous) =>
      previous.filter(
        (review) => review.id !== id,
      ),
    )
  }

  return (
    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <p className="eyebrow">
            HR MANAGEMENT
          </p>

          <h1>
            Performance Management
          </h1>

          <p className="subtitle">
            Track employee goals, reviews and performance.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Average Score
          </p>

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {averageScore}/100
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Across all reviews
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Completed Reviews
          </p>

          <p className="mt-3 text-2xl font-bold text-green-600">
            {completedReviews}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Successfully completed
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Under Review
          </p>

          <p className="mt-3 text-2xl font-bold text-orange-600">
            {underReview}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Reviews awaiting completion
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Excellent Performers
          </p>

          <p className="mt-3 text-2xl font-bold text-indigo-600">
            {excellentReviews}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Score of 90 or above
          </p>
        </Card>

      </div>

      {/* SCORE OVERVIEW */}

      <Card className="mb-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Performance Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current average employee performance.
          </p>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${Math.min(
                averageScore,
                100,
              )}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <span className="text-gray-500">
            0
          </span>

          <span className="font-semibold text-indigo-600">
            {averageScore}%
          </span>

          <span className="text-gray-500">
            100
          </span>
        </div>
      </Card>

      {/* ADD REVIEW */}

      <Card className="mb-5">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Performance Review
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a performance review for an employee.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >

          <Input
            label="Employee Name"
            name="performance-employee"
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
            name="performance-employee-id"
            value={form.employeeId}
            onChange={(event) =>
              updateForm(
                'employeeId',
                event.target.value,
              )
            }
            placeholder="Example: EMP006"
            required
          />

          <div>
            <label
              htmlFor="performance-department"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Department
            </label>

            <select
              id="performance-department"
              value={form.department}
              onChange={(event) =>
                updateForm(
                  'department',
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {departments.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="performance-period"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Review Period
            </label>

            <select
              id="performance-period"
              value={form.reviewPeriod}
              onChange={(event) =>
                updateForm(
                  'reviewPeriod',
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {reviewPeriods.map(
                (period) => (
                  <option
                    key={period}
                    value={period}
                  >
                    {period}
                  </option>
                ),
              )}
            </select>
          </div>

          <Input
            label="Performance Score"
            name="performance-score"
            type="number"
            value={form.score}
            onChange={(event) =>
              updateForm(
                'score',
                event.target.value,
              )
            }
            placeholder="0 - 100"
            required
          />

          <Input
            label="Goal / KPI"
            name="performance-goal"
            value={form.goal}
            onChange={(event) =>
              updateForm(
                'goal',
                event.target.value,
              )
            }
            placeholder="Example: Improve customer satisfaction"
            required
          />

          <div className="md:col-span-2">

            <label
              htmlFor="performance-feedback"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Manager Feedback
            </label>

            <textarea
              id="performance-feedback"
              value={form.feedback}
              onChange={(event) =>
                updateForm(
                  'feedback',
                  event.target.value,
                )
              }
              placeholder="Enter performance feedback..."
              rows="4"
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          {form.score && (
            <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                  <p className="text-sm text-gray-500">
                    Performance Rating
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {getRating(form.score)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Score
                  </p>

                  <p className="mt-1 text-2xl font-bold text-indigo-600">
                    {form.score}/100
                  </p>
                </div>

              </div>

            </div>
          )}

          {formError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 md:col-span-2">
              {formError}
            </div>
          )}

          <div className="flex justify-end md:col-span-2">
            <Button type="submit">
              Add Review
            </Button>
          </div>

        </form>

      </Card>

      {/* REVIEWS */}

      <Card>

        <div className="space-y-5">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Performance Reviews
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review employee performance and progress.
            </p>
          </div>

          {/* FILTERS */}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            <Input
              label="Search"
              name="performance-search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search employee, ID or goal..."
            />

            <div>
              <label
                htmlFor="performance-status"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="performance-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All</option>
                <option>Completed</option>
                <option>Under Review</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="performance-rating"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Rating
              </label>

              <select
                id="performance-rating"
                value={ratingFilter}
                onChange={(event) =>
                  setRatingFilter(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All</option>
                <option>Outstanding</option>
                <option>Excellent</option>
                <option>Very Good</option>
                <option>Good</option>
                <option>Needs Improvement</option>
                <option>Unsatisfactory</option>
              </select>
            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px] text-left">

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-500">

                  <th className="px-4 py-3 font-medium">
                    Employee
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Department
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Period
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Goal / KPI
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Score
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Rating
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

                {filteredReviews.map(
                  (review) => (
                    <tr
                      key={review.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >

                      {/* EMPLOYEE */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                            {review.employee.charAt(
                              0,
                            )}
                          </div>

                          <div>

                            <p className="font-medium text-gray-900">
                              {review.employee}
                            </p>

                            <p className="text-xs text-gray-500">
                              {review.employeeId}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* DEPARTMENT */}

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {review.department}
                      </td>

                      {/* PERIOD */}

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {review.reviewPeriod}
                      </td>

                      {/* GOAL */}

                      <td className="max-w-[260px] px-4 py-4">

                        <p className="text-sm font-medium text-gray-800">
                          {review.goal}
                        </p>

                        <p className="mt-1 max-w-[260px] truncate text-xs text-gray-400">
                          {review.feedback}
                        </p>

                      </td>

                      {/* SCORE */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <span className="font-semibold text-gray-900">
                            {review.score}
                          </span>

                          <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">

                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{
                                width: `${review.score}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      {/* RATING */}

                      <td className="px-4 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getRatingClass(
                            review.rating,
                          )}`}
                        >
                          {review.rating}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            review.status ===
                            'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {review.status}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-4 py-4">

                        <div className="flex gap-2">

                          {review.status ===
                            'Under Review' && (
                            <Button
                              type="button"
                              variant="success"
                              onClick={() =>
                                completeReview(
                                  review.id,
                                )
                              }
                            >
                              Complete
                            </Button>
                          )}

                          <Button
                            type="button"
                            variant="danger"
                            onClick={() =>
                              deleteReview(
                                review.id,
                              )
                            }
                          >
                            Delete
                          </Button>

                        </div>

                      </td>

                    </tr>
                  ),
                )}

              </tbody>

            </table>

            {filteredReviews.length === 0 && (
              <div className="py-16 text-center">

                <div className="mb-3 text-3xl">
                  🔍
                </div>

                <h3 className="font-semibold text-gray-800">
                  No performance reviews found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>

              </div>
            )}

          </div>

        </div>

      </Card>

    </div>
  )
}

export default Performance