import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        SmartCampus
      </div>

      <div className="navbar-right">
        <NotificationBell variant="navbar" />
        <button
          type="button"
          className="navbar-profile-btn"
          onClick={() => navigate("/student/profile")}
          title="View Student Profile"
        >
          <User size={16} />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;