import { NavLink, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function StaffSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

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

        <NotificationBell />

        <NavLink to="/staff/profile">
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

      </div>

    </aside>
  );
}

export default StaffSidebar;