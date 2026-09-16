import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

function MyIssues() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Temporary data
  // Later this will come from the backend/database.
  const issues = [
    {
      id: 1,
      title: "WiFi not working",
      category: "Network",
      location: "Lab 3",
      status: "Pending",
      date: "16 Sept 2026",
      priority: "High"
    },
    {
      id: 2,
      title: "Broken Fan",
      category: "Electrical",
      location: "Block A",
      status: "In Progress",
      date: "15 Sept 2026",
      priority: "Medium"
    },
    {
      id: 3,
      title: "Projector problem",
      category: "Classroom",
      location: "Room 205",
      status: "Resolved",
      date: "12 Sept 2026",
      priority: "Low"
    },
    {
      id: 4,
      title: "Dirty classroom",
      category: "Cleanliness",
      location: "Room 101",
      status: "Pending",
      date: "10 Sept 2026",
      priority: "Medium"
    }
  ];

  // Search + status filtering
  const filteredIssues = issues.filter((issue) => {

    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.category.toLowerCase().includes(search.toLowerCase()) ||
      issue.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      issue.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>

      {/* Page Header */}

      <div className="page-header">

        <div>
          <h1>My Issues</h1>

          <p>
            Track the issues you have reported on campus.
          </p>
        </div>

        <Link
          to="/student/report-issue"
          className="primary-button"
        >
          + Report New Issue
        </Link>

      </div>


      {/* Filters */}

      <div className="issue-filters">

        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        <div className="status-filter">

          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >

            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>

          </select>

        </div>

      </div>


      {/* Issue Count */}

      <div className="issue-count">

        Showing {filteredIssues.length} of {issues.length} issues

      </div>


      {/* Issues */}

      <div className="my-issues-list">

        {filteredIssues.length > 0 ? (

          filteredIssues.map((issue) => (

            <div
              className="my-issue-card"
              key={issue.id}
            >

              <div className="issue-card-main">

                <div className="issue-card-title">

                  <h2>{issue.title}</h2>

                  <span
                    className={`status ${issue.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {issue.status}
                  </span>

                </div>


                <div className="issue-meta">

                  <span>
                    📁 {issue.category}
                  </span>

                  <span>
                    📍 {issue.location}
                  </span>

                  <span>
                    📅 {issue.date}
                  </span>

                </div>


                <div className="priority">

                  Priority:

                  <strong className={`priority-${issue.priority.toLowerCase()}`}>
                    {issue.priority}
                  </strong>

                </div>

              </div>


              <Link
                to={`/student/issues/${issue.id}`}
                className="view-details"
              >
                View Details →
              </Link>

            </div>

          ))

        ) : (

          <div className="no-issues">

            <div className="no-issues-icon">
              🔍
            </div>

            <h2>No issues found</h2>

            <p>
              Try changing your search or status filter.
            </p>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default MyIssues;