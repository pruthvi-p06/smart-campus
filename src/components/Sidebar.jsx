import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <h2>SmartCampus</h2>

      <nav>

        <NavLink to="/student/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/student/report-issue">
          Report Issue
        </NavLink>

        <NavLink to="/student/issues">
          My Issues
        </NavLink>

        <NavLink to="/student/resources">
          Resources
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <NavLink to="/student/profile">
          Profile
        </NavLink>

        <NavLink to="/login">
          Logout
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;