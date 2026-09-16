import { NavLink } from "react-router-dom";

function AdminSidebar() {

  return (

    <aside className="sidebar">

      <h2 className="sidebar-logo">
        SmartCampus
      </h2>


      <nav className="sidebar-nav">

        <NavLink to="/admin/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/admin/issues">
          All Issues
        </NavLink>

        <NavLink to="/admin/users">
          Users
        </NavLink>

        <NavLink to="/admin/resources">
          Resources
        </NavLink>

        <NavLink to="/admin/analytics">
          Analytics
        </NavLink>

      </nav>


      <nav className="sidebar-bottom">

        <NavLink to="/admin/profile">
          Profile
        </NavLink>

        <NavLink to="/login">
          Logout
        </NavLink>

      </nav>

    </aside>
  );
}

export default AdminSidebar;