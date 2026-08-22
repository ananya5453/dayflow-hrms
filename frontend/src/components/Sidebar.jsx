import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
    { name: "Attendance", path: "/attendance" },
    { name: "Leave", path: "/leave" },
    { name: "Payroll", path: "/payroll" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Dayflow</h2>
        <span>Employee Portal</span>
      </div>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;