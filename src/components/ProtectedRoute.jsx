import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation
} from "react-router-dom";
import { getCurrentUser } from "../services/api";

function ProtectedRoute({ allowedRole, children }) {

  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {

    const verifyUser = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setChecking(false);
        return;
      }

      try {

        const response = await getCurrentUser();

        const currentUser =
          response?.user ||
          response?.data ||
          response;

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );

      } catch (error) {

        console.error("Authentication failed:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

      } finally {

        setChecking(false);

      }
    };

    verifyUser();

  }, []);

  if (checking) {
    return (
      <div className="page-loading">
        Checking authentication...
      </div>
    );
  }

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );

  }

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {

    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (user.role === "staff") {
      return (
        <Navigate
          to="/staff/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/student/dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;