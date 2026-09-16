import { Link } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";

function StaffDashboard() {

  const issues = [
    {
      id: 1,
      title: "WiFi not working",
      category: "Network",
      location: "Lab 3",
      priority: "High",
      status: "Pending"
    },
    {
      id: 2,
      title: "Broken Fan",
      category: "Electrical",
      location: "Block A",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 3,
      title: "Projector problem",
      category: "Classroom",
      location: "Room 205",
      priority: "Low",
      status: "Resolved"
    }
  ];

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

              <strong>8</strong>

            </div>


            <div className="stat-card">

              <span>Pending</span>

              <strong>3</strong>

            </div>


            <div className="stat-card">

              <span>In Progress</span>

              <strong>2</strong>

            </div>


            <div className="stat-card">

              <span>Resolved</span>

              <strong>3</strong>

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


            {issues.map((issue) => (

              <div
                className="table-row"
                key={issue.id}
              >

                <strong>
                  {issue.title}
                </strong>

                <span>
                  {issue.category}
                </span>

                <span>
                  {issue.location}
                </span>

                <span
                  className={`priority-${issue.priority.toLowerCase()}`}
                >
                  {issue.priority}
                </span>

                <span
                  className={`status ${issue.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {issue.status}
                </span>

                <Link
                  to={`/staff/issues/${issue.id}`}
                  className="action-link"
                >
                  View
                </Link>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}

export default StaffDashboard;