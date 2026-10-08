import { NavLink, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

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

  <NotificationBell />

  <NavLink to="/admin/profile">
    Profile
  </NavLink>

  <button
  type="button"
  onClick={handleLogout}
  className="sidebar-logout"
  style={{
    color: "#ffffff",
    background: "transparent",
    border: "none",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    padding: "12px 0",
    display: "block",
    opacity: 1
  }}
>
  Logout
</button>

</nav>

    </aside>
  );
}

export default AdminSidebar;