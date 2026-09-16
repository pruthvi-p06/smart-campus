import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

function IssueDetails() {

  const { id } = useParams();

  const issue = {
    id: id,
    title: "WiFi not working",
    category: "Network",
    location: "Lab 3",
    department: "CSE-AIML",
    priority: "High",
    status: "In Progress",
    reportedDate: "16 Sept 2026",
    description:
      "The WiFi connection is not working properly in Lab 3. Students are unable to access the internet during laboratory sessions.",
    assignedTo: "Campus Network Staff",
    resolution:
      "Network team is currently checking the router and connectivity."
  };

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
              className={`status ${issue.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {issue.status}
            </span>

          </div>

          <p>
            Issue #{issue.id}
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
              <strong className="priority-high">
                {issue.priority}
              </strong>
            </div>

            <div>
              <span>Reported</span>
              <strong>{issue.reportedDate}</strong>
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
                <p>16 Sept 2026</p>
              </div>

            </div>


            <div className="timeline-item completed">

              <div className="timeline-dot">
                ✓
              </div>

              <div>
                <strong>Issue Assigned</strong>
                <p>16 Sept 2026</p>
              </div>

            </div>


            <div className="timeline-item current">

              <div className="timeline-dot">
                •
              </div>

              <div>
                <strong>In Progress</strong>
                <p>Network team is working on the issue.</p>
              </div>

            </div>


            <div className="timeline-item">

              <div className="timeline-dot">
                4
              </div>

              <div>
                <strong>Resolved</strong>
                <p>Pending</p>
              </div>

            </div>

          </div>

        </div>


        {/* Resolution */}

        <div className="details-card resolution-card">

          <h2>Resolution / Staff Update</h2>

          <p>
            {issue.resolution}
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default IssueDetails;