import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import {
  getAnalytics,
  getAdminIssues
} from "../../services/api";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState({});
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [analyticsResponse, issuesResponse] = await Promise.all([
          getAnalytics(),
          getAdminIssues()
        ]);

        const analyticsData =
          analyticsResponse?.analytics ||
          analyticsResponse?.data ||
          analyticsResponse ||
          {};

        const issuesData =
          issuesResponse?.issues ||
          issuesResponse?.data ||
          issuesResponse ||
          [];

        setAnalytics(analyticsData);

        setRecentIssues(
          Array.isArray(issuesData)
            ? issuesData.slice(0, 4)
            : []
        );
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatValue = (...keys) => {
    for (const key of keys) {
      if (analytics?.[key] !== undefined) {
        return analytics[key];
      }
    }
    return 0;
  };

  const stats = [
    {
      title: "Total Issues",
      value: getStatValue("totalIssues", "total")
    },
    {
      title: "Pending",
      value: getStatValue("pendingIssues", "pending")
    },
    {
      title: "In Progress",
      value: getStatValue("inProgressIssues", "inProgress")
    },
    {
      title: "Resolved",
      value: getStatValue("resolvedIssues", "resolved")
    }
  ];

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div className="dashboard-layout">

      <AdminSidebar />

      <main className="main-content">

        <header className="top-navbar">

          <h2>SmartCampus</h2>

          <div className="navbar-right">

  <Link to="/admin/profile">
              Profile
            </Link>

          </div>

        </header>

        <div className="page-content">

          <div className="admin-dashboard-header">

            <div>
              <h1>Admin Dashboard</h1>

              <p>
                Monitor and manage campus issues, users and resources.
              </p>
            </div>

          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Statistics */}

          <div className="stats-grid">

            {stats.map((stat) => (

              <div
                className="stat-card"
                key={stat.title}
              >

                <span>
                  {stat.title}
                </span>

                <strong>
                  {loading ? "..." : stat.value}
                </strong>

              </div>

            ))}

          </div>

          {/* Quick Actions */}

          <section className="admin-section">

            <div className="section-heading">
              <h2>Quick Actions</h2>
            </div>

            <div className="quick-actions">

              <Link
                to="/admin/issues"
                className="quick-action-card"
              >
                <span className="quick-action-icon">
                  📋
                </span>

                <div>
                  <h3>Manage Issues</h3>

                  <p>
                    View, assign and update campus issues.
                  </p>
                </div>

              </Link>

              <Link
                to="/admin/users"
                className="quick-action-card"
              >
                <span className="quick-action-icon">
                  👥
                </span>

                <div>
                  <h3>Manage Users</h3>

                  <p>
                    Manage students and staff accounts.
                  </p>
                </div>

              </Link>

              <Link
                to="/admin/resources"
                className="quick-action-card"
              >
                <span className="quick-action-icon">
                  🏫
                </span>

                <div>
                  <h3>Manage Resources</h3>

                  <p>
                    Add and manage campus facilities.
                  </p>
                </div>

              </Link>

              <Link
                to="/admin/analytics"
                className="quick-action-card"
              >
                <span className="quick-action-icon">
                  📊
                </span>

                <div>
                  <h3>View Analytics</h3>

                  <p>
                    Analyze campus issue trends and insights.
                  </p>
                </div>

              </Link>

            </div>

          </section>

          {/* Recent Issues */}

          <section className="admin-section">

            <div className="section-heading">

              <h2>
                Recent Issues
              </h2>

              <Link to="/admin/issues">
                View All
              </Link>

            </div>

            <div className="table-card">

              <table>

                <thead>

                  <tr>
                    <th>Issue</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td colSpan="6">
                        Loading issues...
                      </td>
                    </tr>

                  ) : recentIssues.length === 0 ? (

                    <tr>
                      <td colSpan="6">
                        No issues found.
                      </td>
                    </tr>

                  ) : (

                    recentIssues.map((issue) => {

                      const issueId = issue._id || issue.id;

                      const issueTitle =
                        issue.title ||
                        issue.issue ||
                        issue.name ||
                        "Untitled Issue";

                      const status = formatStatus(issue.status);

                      const priority =
                        issue.priority || "Medium";

                      return (
                        <tr key={issueId}>

                          <td>
                            <strong>
                              {issueTitle}
                            </strong>
                          </td>

                          <td>
                            {issue.category || "—"}
                          </td>

                          <td>
                            {issue.location || "—"}
                          </td>

                          <td>
                            <span
                              className={`priority-${String(
                                priority
                              ).toLowerCase()}`}
                            >
                              {priority}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`status ${String(status)
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {status}
                            </span>
                          </td>

                          <td>
                            <Link
                              to={`/admin/issues/${issueId}`}
                              className="view-link"
                            >
                              View
                            </Link>
                          </td>

                        </tr>
                      );
                    })

                  )}

                </tbody>

              </table>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;