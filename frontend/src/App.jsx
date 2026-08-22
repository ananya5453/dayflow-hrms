
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
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

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>

          <div>
            <h2>DayFlow</h2>
            <span>HR Management</span>
          </div>
        </div>

        <nav className="navigation">
          <span className="nav-label">WORKSPACE</span>

          {navigation.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`nav-item ${
                activePage === item.name ? 'active' : ''
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="nav-item">
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>

          <div className="user-card">
            <div className="avatar">J</div>

            <div>
              <strong>Jeeval</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="breadcrumb">
            <span>DayFlow</span>
            <span>/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Search"
            >
              ⌕
            </button>

            <button
              className="icon-button notification"
              type="button"
              aria-label="Notifications"
            >
              ♧
              <span />
            </button>

            <div className="profile">
              <div className="avatar small">J</div>

              <div>
                <strong>Jeeval</strong>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="content">
          {activePage === 'Dashboard' && <Dashboard />}

          {activePage === 'Employees' && <Employees />}

          {activePage === 'Attendance' && <Attendance />}

          {![
            'Dashboard',
            'Employees',
            'Attendance',
          ].includes(activePage) && (
            <div className="coming-soon">
              <span className="coming-soon-icon">🚧</span>

              <h2>{activePage}</h2>

              <p>
                This module is planned and will be implemented next.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App