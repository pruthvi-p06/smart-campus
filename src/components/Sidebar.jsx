import { NavLink, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Sidebar() {
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

        <NotificationBell />

        <NavLink to="/student/profile">
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

export default Sidebar;