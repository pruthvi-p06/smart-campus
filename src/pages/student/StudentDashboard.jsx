import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getMyIssues } from "../../services/api";

function StudentDashboard() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyIssues();

        const issueList =
          response.issues ||
          response.data ||
          response ||
          [];

        setIssues(Array.isArray(issueList) ? issueList : []);
      } catch (err) {
        setError(err.message || "Failed to load issues.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const getStatusClass = (status) => {
    const normalizedStatus = (status || "").toLowerCase();

    if (normalizedStatus === "resolved") {
      return "resolved";
    }

    if (
      normalizedStatus === "in progress" ||
      normalizedStatus === "in_progress"
    ) {
      return "progress";
    }

    return "pending";
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    if (status === "in_progress") {
      return "In Progress";
    }

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const totalIssues = issues.length;

  const pendingIssues = issues.filter(
    (issue) =>
      (issue.status || "").toLowerCase() === "pending"
  ).length;

  const inProgressIssues = issues.filter((issue) => {
    const status = (issue.status || "").toLowerCase();
    return (
      status === "in progress" ||
      status === "in_progress"
    );
  }).length;

  const resolvedIssues = issues.filter(
    (issue) =>
      (issue.status || "").toLowerCase() === "resolved"
  ).length;

  const recentIssues = [...issues]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.date || 0) -
        new Date(a.createdAt || a.date || 0)
    )
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Welcome back! 👋</h1>
          <p>Track and manage your campus issues.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/student/report-issue")}
        >
          + Report New Issue
        </button>
      </div>

      {/* KPI Cards */}

      <div className="kpi-grid">
        <div className="kpi-card">
          <p>Total Issues</p>
          <h2>{totalIssues}</h2>
        </div>

        <div className="kpi-card">
          <p>Pending</p>
          <h2>{pendingIssues}</h2>
        </div>

        <div className="kpi-card">
          <p>In Progress</p>
          <h2>{inProgressIssues}</h2>
        </div>

        <div className="kpi-card">
          <p>Resolved</p>
          <h2>{resolvedIssues}</h2>
        </div>
      </div>

      {/* Recent Issues */}

      <div className="section-header">
        <h2>Recent Issues</h2>

        <button
          className="text-button"
          onClick={() => navigate("/student/issues")}
        >
          View All
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠ {error}
        </div>
      )}

      {loading ? (
        <div className="no-issues">
          <h2>Loading issues...</h2>
        </div>
      ) : recentIssues.length === 0 ? (
        <div className="no-issues">
          <h2>No issues reported yet</h2>
          <p>Your recently reported issues will appear here.</p>
        </div>
      ) : (
        <div className="issues-table">
          <div className="table-header">
            <span>Issue</span>
            <span>Category</span>
            <span>Location</span>
            <span>Status</span>
          </div>

          {recentIssues.map((issue) => (
            <div
              className="table-row"
              key={issue._id || issue.id}
            >
              <span>{issue.title || "Untitled Issue"}</span>

              <span>
                {issue.category || "—"}
              </span>

              <span>
                {issue.location || "—"}
              </span>

              <span
                className={`status ${getStatusClass(
                  issue.status
                )}`}
              >
                {formatStatus(issue.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default StudentDashboard;