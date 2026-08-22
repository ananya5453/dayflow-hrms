
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
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
              className={`nav-item ${
                activePage === item.name ? 'active' : ''
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <span className="nav-icon">⚙</span>
            Settings
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

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            DayFlow <span>/</span> {activePage}
          </div>

          <div className="topbar-actions">
            <button className="icon-button" type="button">
              ⌕
            </button>

            <button
              className="icon-button notification"
              type="button"
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

        <section className="content">
          {activePage === 'Dashboard' && <Dashboard />}

          {activePage === 'Employees' && <Employees />}

          {!['Dashboard', 'Employees'].includes(activePage) && (
            <div className="coming-soon">
              <span>🚧</span>
              <h2>{activePage}</h2>
              <p>This module will be implemented next.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App