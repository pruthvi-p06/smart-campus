import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";
import { getStaffIssues } from "../../services/api";

function StaffDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getStaffIssues();

        const issueData =
          response.issues ||
          response.data ||
          response;

        setIssues(Array.isArray(issueData) ? issueData : []);
      } catch (err) {
        setError(err.message || "Failed to load assigned issues.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const pendingCount = issues.filter(
    (issue) => issue.status === "Pending"
  ).length;

  const inProgressCount = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const resolvedCount = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  const assignedCount = issues.length;

  return (
    <div className="dashboard-layout">

      <StaffSidebar />

      <main className="main-content">

        {/* Navbar */}

        <header className="top-navbar">

          <h2>SmartCampus</h2>

          <div className="navbar-right">
            <span>🔔</span>

            <Link to="/staff/profile">
              Profile
            </Link>
          </div>

        </header>


        {/* Page */}

        <div className="page-content">

          <div className="page-header">

            <div>

              <h1>
                Welcome back! 👋
              </h1>

              <p>
                Manage and resolve your assigned campus issues.
              </p>

            </div>

          </div>


          {/* Statistics */}

          <div className="stats-grid">

            <div className="stat-card">

              <span>Assigned Issues</span>

              <strong>{assignedCount}</strong>

            </div>


            <div className="stat-card">

              <span>Pending</span>

              <strong>{pendingCount}</strong>

            </div>


            <div className="stat-card">

              <span>In Progress</span>

              <strong>{inProgressCount}</strong>

            </div>


            <div className="stat-card">

              <span>Resolved</span>

              <strong>{resolvedCount}</strong>

            </div>

          </div>


          {/* Assigned Issues */}

          <div className="section-header">

            <h2>Assigned Issues</h2>

            <Link to="/staff/issues">
              View All
            </Link>

          </div>


          <div className="staff-issues-table">

            <div className="table-header">

              <span>Issue</span>
              <span>Category</span>
              <span>Location</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Action</span>

            </div>


            {loading && (
              <div className="no-issues">
                <p>Loading assigned issues...</p>
              </div>
            )}


            {!loading && error && (
              <div className="error-message">
                ⚠ {error}
              </div>
            )}


            {!loading && !error && issues.length === 0 && (
              <div className="no-issues">
                <p>No issues assigned to you yet.</p>
              </div>
            )}


            {!loading &&
              !error &&
              issues.map((issue) => {

                const issueId = issue._id || issue.id;

                return (
                  <div
                    className="table-row"
                    key={issueId}
                  >

                    <strong>
                      {issue.title}
                    </strong>

                    <span>
                      {issue.category || "—"}
                    </span>

                    <span>
                      {issue.location || "—"}
                    </span>

                    <span
                      className={`priority-${(
                        issue.priority || "Medium"
                      ).toLowerCase()}`}
                    >
                      {issue.priority || "Medium"}
                    </span>

                    <span
                      className={`status ${(issue.status || "Pending")
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {issue.status || "Pending"}
                    </span>

                    <Link
                      to={`/staff/issues/${issueId}`}
                      className="action-link"
                    >
                      View
                    </Link>

                  </div>
                );
              })}

          </div>

        </div>

      </main>

    </div>
  );
}

export default StaffDashboard;