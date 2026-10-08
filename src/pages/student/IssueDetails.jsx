import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getIssue } from "../../services/api";

function IssueDetails() {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getIssue(id);
        const issueData = response.issue || response.data || response;

        setIssue(issueData);
      } catch (err) {
        setError(err.message || "Failed to load issue details.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="no-issues">
          <h2>Loading issue details...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !issue) {
    return (
      <DashboardLayout>
        <Link
          to="/student/issues"
          className="back-link"
        >
          ← Back to My Issues
        </Link>

        <div className="error-message">
          ⚠ {error || "Issue not found."}
        </div>
      </DashboardLayout>
    );
  }

  const issueId = issue._id || issue.id;
  const status = issue.status || "Pending";
  const priority = issue.priority || "Medium";

  return (
    <DashboardLayout>

      {/* Back */}

      <Link
        to="/student/issues"
        className="back-link"
      >
        ← Back to My Issues
      </Link>


      {/* Header */}

      <div className="details-header">

        <div>

          <div className="details-title">

            <h1>{issue.title}</h1>

            <span
              className={`status ${status
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {status}
            </span>

          </div>

          <p>
            Issue #{issueId}
          </p>

        </div>

      </div>


      <div className="details-grid">

        {/* Main Details */}

        <div className="details-card">

          <h2>Issue Information</h2>

          <div className="details-info-grid">

            <div>
              <span>Category</span>
              <strong>{issue.category || "—"}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{issue.location || "—"}</strong>
            </div>

            <div>
              <span>Department</span>
              <strong>{issue.department || "—"}</strong>
            </div>

            <div>
              <span>Priority</span>
              <strong
                className={`priority-${priority.toLowerCase()}`}
              >
                {priority}
              </strong>
            </div>

            <div>
              <span>Reported</span>
              <strong>
                {formatDate(issue.createdAt || issue.reportedDate)}
              </strong>
            </div>

            <div>
              <span>Assigned To</span>
              <strong>
                {issue.assignedTo?.name ||
                  issue.assignedTo ||
                  "Not assigned"}
              </strong>
            </div>

          </div>


          <div className="description-section">

            <h3>Description</h3>

            <p>
              {issue.description || "No description provided."}
            </p>

          </div>

        </div>


        {/* Status Timeline */}

        <div className="details-card">

          <h2>Issue Progress</h2>

          <div className="timeline">

            <div className="timeline-item completed">

              <div className="timeline-dot">
                ✓
              </div>

              <div>
                <strong>Issue Reported</strong>
                <p>
                  {formatDate(issue.createdAt || issue.reportedDate)}
                </p>
              </div>

            </div>


            <div
              className={`timeline-item ${
                issue.assignedTo ? "completed" : ""
              }`}
            >

              <div className="timeline-dot">
                {issue.assignedTo ? "✓" : "2"}
              </div>

              <div>
                <strong>Issue Assigned</strong>
                <p>
                  {issue.assignedTo
                    ? "Assigned to staff"
                    : "Pending assignment"}
                </p>
              </div>

            </div>


            <div
              className={`timeline-item ${
                status === "In Progress" ? "current" : ""
              }`}
            >

              <div className="timeline-dot">
                {status === "In Progress" ? "•" : "3"}
              </div>

              <div>
                <strong>In Progress</strong>
                <p>
                  {status === "In Progress"
                    ? "Staff is working on the issue."
                    : status === "Resolved"
                    ? "Issue has been resolved."
                    : "Pending"}
                </p>
              </div>

            </div>


            <div
              className={`timeline-item ${
                status === "Resolved" ? "completed" : ""
              }`}
            >

              <div className="timeline-dot">
                {status === "Resolved" ? "✓" : "4"}
              </div>

              <div>
                <strong>Resolved</strong>
                <p>
                  {status === "Resolved"
                    ? formatDate(issue.resolvedAt)
                    : "Pending"}
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Resolution */}

        <div className="details-card resolution-card">

          <h2>Resolution / Staff Update</h2>

          <p>
            {issue.resolution ||
              issue.resolutionNotes ||
              "No staff update yet."}
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default IssueDetails;