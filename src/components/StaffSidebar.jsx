import { NavLink } from "react-router-dom";

function StaffSidebar() {
  return (
    <aside className="sidebar">

      <h2>SmartCampus</h2>

      <nav>

        <NavLink to="/staff/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/staff/issues">
          Assigned Issues
        </NavLink>

        <NavLink to="/staff/resources">
          Resources
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <NavLink to="/staff/profile">
          Profile
        </NavLink>

        <NavLink to="/login">
          Logout
        </NavLink>

      </div>

    </aside>
  );
}

export default StaffSidebar;