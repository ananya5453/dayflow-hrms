import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import EmployeeLayout from "./layouts/EmployeeLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route element={<EmployeeLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/payroll" element={<Payroll />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

<<<<<<< HEAD
      </Routes>
    </BrowserRouter>
  );
=======
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
>>>>>>> origin/main
}

export default App;
