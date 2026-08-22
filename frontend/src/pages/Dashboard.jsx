import Card from '../components/Card'

function Dashboard() {
  const stats = [
    {
      title: 'Total Employees',
      value: '124',
      change: '+8%',
      description: 'from last month',
    },
    {
      title: 'Present Today',
      value: '112',
      change: '90.3%',
      description: 'attendance rate',
    },
    {
      title: 'On Leave',
      value: '8',
      change: '-2',
      description: 'from yesterday',
    },
    {
      title: 'Pending Requests',
      value: '4',
      change: 'Action needed',
      description: 'leave requests',
    },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">HRMS Dashboard</p>
          <h1>Good morning, Jeeval 👋</h1>
          <p className="subtitle">
            Here's what's happening across your organization today.
          </p>
        </div>

        <div className="dashboard-date">
          <span>Today</span>
          <strong>22 August 2026</strong>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <div className="stat-card">
              <span className="stat-title">{stat.title}</span>
              <strong className="stat-value">{stat.value}</strong>
              <span className="stat-change">{stat.change}</span>
              <span className="stat-description">{stat.description}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="dashboard-grid">
        <Card>
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Attendance Overview</h2>
                <p>Employee attendance for this week</p>
              </div>
            </div>

            <div className="attendance-bars">
              {[
                ['Mon', 92],
                ['Tue', 95],
                ['Wed', 88],
                ['Thu', 94],
                ['Fri', 90],
              ].map(([day, percentage]) => (
                <div className="attendance-day" key={day}>
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{ height: `${percentage}%` }}
                    />
                  </div>
                  <span>{day}</span>
                  <small>{percentage}%</small>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Recent Activity</h2>
                <p>Latest HR activities</p>
              </div>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot" />
                <div>
                  <strong>Arjun Kumar</strong>
                  <p>Checked in at 9:02 AM</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-dot" />
                <div>
                  <strong>Priya Sharma</strong>
                  <p>Submitted a leave request</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-dot" />
                <div>
                  <strong>Rahul Menon</strong>
                  <p>Updated employee profile</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-dot" />
                <div>
                  <strong>Ananya Rao</strong>
                  <p>Completed performance review</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard