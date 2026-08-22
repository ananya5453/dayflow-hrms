
import { useState } from 'react'

import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'
import Payroll from './pages/Payroll'

import './App.css'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const navigation = [
    { name: 'Dashboard', icon: '⌂' },
    { name: 'Employees', icon: '♙' },
    { name: 'Attendance', icon: '◷' },
    { name: 'Leave', icon: '▣' },
    { name: 'Payroll', icon: '₹' },
    { name: 'Performance', icon: '↗' },
  ]

  const implementedPages = [
    'Dashboard',
    'Employees',
    'Attendance',
    'Leave',
    'Payroll',
  ]

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

      default:
        return (
          <div className="coming-soon">
            <span className="coming-soon-icon">🚧</span>

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

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        {/* BRAND */}

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

        {/* NAVIGATION */}

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

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className={`nav-item ${
              activePage === 'Settings'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActivePage('Settings')
            }
          >
            <span className="nav-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>
          </button>

          {/* USER */}

          <div className="user-card">

            <div className="avatar">
              J
            </div>

            <div className="user-details">

              <strong>
                Jeeval
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          {/* BREADCRUMB */}

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

          {/* TOPBAR ACTIONS */}

          <div className="topbar-actions">

            {/* SEARCH */}

            <button
              type="button"
              className="icon-button"
              title="Search"
            >
              ⌕
            </button>

            {/* NOTIFICATIONS */}

            <button
              type="button"
              className="icon-button notification"
              title="Notifications"
            >
              ♧

              <span className="notification-dot" />
            </button>

            {/* PROFILE */}

            <button
              type="button"
              className="profile"
              onClick={() =>
                setActivePage('Settings')
              }
            >

              <div className="avatar small">
                J
              </div>

              <div className="profile-details">

                <strong>
                  Jeeval
                </strong>

                <span>
                  Admin
                </span>

              </div>

            </button>

          </div>

        </header>

        {/* ================= PAGE CONTENT ================= */}

        <section className="content">

          {renderPage()}

        </section>

      </main>

    </div>
  )
}

export default App