import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";

function StaffIssueDetails() {

  const { id } = useParams();

  // Temporary frontend data
  const issue = {
    id: id,
    title: "WiFi not working",
    category: "Network",
    location: "Lab 3",
    department: "CSE-AIML",
    priority: "High",
    status: "In Progress",
    reported: "16 Sept 2026",
    assignedTo: "Campus Network Staff",
    description:
      "The WiFi connection is not working properly in Lab 3. Students are unable to access the internet during laboratory sessions."
  };

  const [status, setStatus] = useState(issue.status);
  const [staffUpdate, setStaffUpdate] = useState("");
  const [resolutionDetails, setResolutionDetails] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const handleUpdate = (e) => {

    e.preventDefault();

    setSuccessMessage("Issue updated successfully!");

  };


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

                <h1>{issue.title}</h1>

                <span
                  className={`status ${status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {status}
                </span>

              </div>

              <p>
                Issue #{issue.id}
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
                    <strong>{issue.category}</strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>{issue.location}</strong>
                  </div>

                  <div>
                    <span>Department</span>
                    <strong>{issue.department}</strong>
                  </div>

                  <div>
                    <span>Priority</span>

                    <strong
                      className={`priority-${issue.priority.toLowerCase()}`}
                    >
                      {issue.priority}
                    </strong>

                  </div>

                  <div>
                    <span>Reported</span>
                    <strong>{issue.reported}</strong>
                  </div>

                  <div>
                    <span>Assigned To</span>
                    <strong>{issue.assignedTo}</strong>
                  </div>

                </div>


                <div className="description-section">

                  <h3>Description</h3>

                  <p>
                    {issue.description}
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
                      }}
                      placeholder="Enter how the issue was resolved..."
                      rows="4"
                    />

                  </div>


                  {successMessage && (

                    <div className="success-message">

                      ✓ {successMessage}

                    </div>

                  )}


                  <button
                    type="submit"
                    className="update-issue-button"
                  >
                    Update Issue
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
                        {issue.reported}
                      </span>

                    </div>

                  </div>


                  <div className="timeline-item completed">

                    <div className="timeline-icon">
                      ✓
                    </div>

                    <div>

                      <strong>
                        Issue Assigned
                      </strong>

                      <span>
                        {issue.reported}
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
                          ? "Issue has been resolved."
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
                  className={`large-priority priority-${issue.priority.toLowerCase()}`}
                >
                  {issue.priority}
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