import { useState } from 'react'

import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'
import Payroll from './pages/Payroll'
import Performance from './pages/Performance'
import Login from './pages/Login'

import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [activePage, setActivePage] = useState('Dashboard')

  // If user is not logged in, show Login page
  if (!user) {
    return (
      <Login
        onLogin={(data) => {
          setUser(data.user)
          setActivePage('Dashboard')
        }}
      />
    )
  }

  const navigation = [
    { name: 'Dashboard', icon: '⌂' },
    { name: 'Employees', icon: '♙' },
    { name: 'Attendance', icon: '◷' },
    { name: 'Leave', icon: '▣' },
    { name: 'Payroll', icon: '₹' },
    { name: 'Performance', icon: '↗' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('employee')

    setUser(null)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />

      case 'Employees':
        return <Employees />

      case 'Attendance':
        return <Attendance />

      case 'Leave':
        return <Leave />

      case 'Payroll':
        return <Payroll />

      case 'Performance':
        return <Performance />

      default:
        return (
          <div className="coming-soon">
            <span className="coming-soon-icon">
              🚧
            </span>

            <h2>{activePage}</h2>

            <p>
              This module will be implemented next.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            D
          </div>

          <div className="brand-text">
            <h2>DayFlow</h2>

            <span>
              HR Management
            </span>
          </div>

        </div>

        <nav className="navigation">

          <span className="nav-label">
            WORKSPACE
          </span>

          {navigation.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`nav-item ${
                activePage === item.name
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setActivePage(item.name)
              }
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>
            </button>
          ))}

        </nav>

        <div className="sidebar-bottom">

          <button
            type="button"
            className="nav-item"
            onClick={handleLogout}
          >
            <span className="nav-icon">
              ↪
            </span>

            <span>
              Logout
            </span>
          </button>

          <div className="user-card">

            <div className="avatar">
              {user?.email?.charAt(0).toUpperCase() || 'J'}
            </div>

            <div className="user-details">

              <strong>
                {user?.email || 'User'}
              </strong>

              <span>
                {user?.role || 'Employee'}
              </span>

            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="main-content">

        <header className="topbar">

          <div className="breadcrumb">

            <span>
              DayFlow
            </span>

            <span className="breadcrumb-separator">
              /
            </span>

            <span className="breadcrumb-current">
              {activePage}
            </span>

          </div>

          <div className="topbar-actions">

            <button
              type="button"
              className="icon-button"
              title="Search"
            >
              ⌕
            </button>

            <button
              type="button"
              className="icon-button notification"
              title="Notifications"
            >
              ♧
              <span className="notification-dot" />
            </button>

            <button
              type="button"
              className="profile"
            >
              <div className="avatar small">
                {user?.email?.charAt(0).toUpperCase() || 'J'}
              </div>

              <div className="profile-details">

                <strong>
                  {user?.email || 'User'}
                </strong>

                <span>
                  {user?.role || 'Employee'}
                </span>

              </div>
            </button>

          </div>

        </header>

        <section className="content">
          {renderPage()}
        </section>

      </main>

    </div>
  )
}

export default App