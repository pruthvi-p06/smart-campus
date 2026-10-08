import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";
import { getStaffIssue, updateIssueStatus } from "../../services/api";

function StaffIssueDetails() {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState("");
  const [staffUpdate, setStaffUpdate] = useState("");
  const [resolutionDetails, setResolutionDetails] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getStaffIssue(id);

        const issueData =
          response.issue ||
          response.data ||
          response;

        setIssue(issueData);
        setStatus(issueData.status || "Pending");

        setStaffUpdate(
          issueData.staffUpdate ||
          issueData.updateNotes ||
          ""
        );

        setResolutionDetails(
          issueData.resolutionNote ||
          issueData.resolution ||
          ""
        );
      } catch (err) {
        setError(
          err.message || "Failed to load issue details."
        );
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError("");
      setSuccessMessage("");

      const response = await updateIssueStatus(id, {
        status,
        staffUpdate,
        resolutionNote: resolutionDetails,
      });

      const updatedIssue =
        response.issue ||
        response.data ||
        response;

      setIssue((prevIssue) => ({
        ...prevIssue,
        ...(updatedIssue || {}),
        status
      }));

      setSuccessMessage("Issue updated successfully!");
    } catch (err) {
      setError(
        err.message || "Failed to update the issue."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">

        <StaffSidebar />

        <main className="main-content">

          <div className="page-content staff-detail-page">

            <div className="no-issues">
              <h2>Loading issue details...</h2>
            </div>

          </div>

        </main>

      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="dashboard-layout">

        <StaffSidebar />

        <main className="main-content">

          <div className="page-content staff-detail-page">

            <Link
              to="/staff/issues"
              className="back-link"
            >
              ← Back to Assigned Issues
            </Link>

            <div className="error-message">
              ⚠ {error || "Issue not found."}
            </div>

          </div>

        </main>

      </div>
    );
  }

  const issueId = issue._id || issue.id;
  const priority = issue.priority || "Medium";
  const assignedTo =
    issue.assignedTo?.name ||
    issue.assignedTo ||
    "Not assigned";

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

        <div className="page-content staff-detail-page">

          {/* Back */}

          <Link
            to="/staff/issues"
            className="back-link"
          >
            ← Back to Assigned Issues
          </Link>


          {/* Header */}

          <div className="issue-detail-header">

            <div>

              <div className="detail-title-row">

                <h1>
                  {issue.title || "Untitled Issue"}
                </h1>

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


          {/* Main grid */}

          <div className="staff-detail-grid">


            {/* LEFT SIDE */}

            <div>


              {/* Issue Information */}

              <section className="detail-card">

                <h2>Issue Information</h2>

                <div className="issue-information-grid">

                  <div>
                    <span>Category</span>
                    <strong>
                      {issue.category || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>
                      {issue.location || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Department</span>
                    <strong>
                      {issue.department || "—"}
                    </strong>
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
                      {formatDate(
                        issue.createdAt ||
                        issue.reportedDate
                      )}
                    </strong>

                  </div>

                  <div>
                    <span>Assigned To</span>

                    <strong>
                      {assignedTo}
                    </strong>

                  </div>

                </div>


                <div className="description-section">

                  <h3>Description</h3>

                  <p>
                    {issue.description ||
                      "No description provided."}
                  </p>

                </div>

              </section>


              {/* Update Issue */}

              <section className="detail-card">

                <h2>Update Issue</h2>

                <form onSubmit={handleUpdate}>

                  {/* Status */}

                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setSuccessMessage("");
                        setError("");
                      }}
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                    </select>

                  </div>


                  {/* Staff Update */}

                  <div className="form-group">

                    <label>
                      Staff Update
                    </label>

                    <textarea
                      value={staffUpdate}
                      onChange={(e) => {
                        setStaffUpdate(e.target.value);
                        setSuccessMessage("");
                        setError("");
                      }}
                      placeholder="Describe the work or progress made..."
                      rows="4"
                    />

                  </div>


                  {/* Resolution */}

                  <div className="form-group">

                    <label>
                      Resolution Details
                    </label>

                    <textarea
                      value={resolutionDetails}
                      onChange={(e) => {
                        setResolutionDetails(e.target.value);
                        setSuccessMessage("");
                        setError("");
                      }}
                      placeholder="Enter how the issue was resolved..."
                      rows="4"
                    />

                  </div>


                  {error && (

                    <div className="error-message">
                      ⚠ {error}
                    </div>

                  )}


                  {successMessage && (

                    <div className="success-message">

                      ✓ {successMessage}

                    </div>

                  )}


                  <button
                    type="submit"
                    className="update-issue-button"
                    disabled={updating}
                  >
                    {updating
                      ? "Updating..."
                      : "Update Issue"}
                  </button>

                </form>

              </section>

            </div>


            {/* RIGHT SIDE */}

            <div>


              {/* Progress */}

              <section className="detail-card progress-card">

                <h2>Issue Progress</h2>


                <div className="progress-timeline">


                  <div className="timeline-item completed">

                    <div className="timeline-icon">
                      ✓
                    </div>

                    <div>

                      <strong>
                        Issue Reported
                      </strong>

                      <span>
                        {formatDate(
                          issue.createdAt ||
                          issue.reportedDate
                        )}
                      </span>

                    </div>

                  </div>


                  <div
                    className={`timeline-item ${
                      issue.assignedTo
                        ? "completed"
                        : ""
                    }`}
                  >

                    <div className="timeline-icon">
                      {issue.assignedTo ? "✓" : "2"}
                    </div>

                    <div>

                      <strong>
                        Issue Assigned
                      </strong>

                      <span>
                        {issue.assignedTo
                          ? "Assigned to staff"
                          : "Pending assignment"}
                      </span>

                    </div>

                  </div>


                  <div
                    className={`timeline-item ${
                      status === "In Progress" ||
                      status === "Resolved"
                        ? "active"
                        : ""
                    }`}
                  >

                    <div className="timeline-icon">
                      {status === "In Progress" ||
                      status === "Resolved"
                        ? "•"
                        : "3"}
                    </div>

                    <div>

                      <strong>
                        In Progress
                      </strong>

                      <span>
                        {status === "Pending"
                          ? "Pending"
                          : "Staff is working on the issue."}
                      </span>

                    </div>

                  </div>


                  <div
                    className={`timeline-item ${
                      status === "Resolved"
                        ? "completed"
                        : ""
                    }`}
                  >

                    <div className="timeline-icon">
                      {status === "Resolved"
                        ? "✓"
                        : "4"}
                    </div>

                    <div>

                      <strong>
                        Resolved
                      </strong>

                      <span>
                        {status === "Resolved"
                          ? formatDate(issue.resolvedAt)
                          : "Pending"}
                      </span>

                    </div>

                  </div>

                </div>

              </section>


              {/* Priority */}

              <section className="detail-card priority-card">

                <h2>Issue Priority</h2>

                <div
                  className={`large-priority priority-${priority.toLowerCase()}`}
                >
                  {priority}
                </div>

                <p>
                  This issue requires attention based on its assigned priority.
                </p>

              </section>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default StaffIssueDetails;