import { useState } from "react";
import { Link } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";

function AssignedIssues() {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const issues = [
    {
      id: 1,
      title: "WiFi not working",
      category: "Network",
      location: "Lab 3",
      priority: "High",
      status: "Pending",
      date: "16 Sept 2026",
      description:
        "The WiFi connection is not working properly in Lab 3."
    },
    {
      id: 2,
      title: "Broken Fan",
      category: "Electrical",
      location: "Block A",
      priority: "Medium",
      status: "In Progress",
      date: "15 Sept 2026",
      description:
        "The ceiling fan is not functioning properly."
    },
    {
      id: 3,
      title: "Projector problem",
      category: "Classroom",
      location: "Room 205",
      priority: "Low",
      status: "Resolved",
      date: "14 Sept 2026",
      description:
        "The classroom projector is not displaying properly."
    },
    {
      id: 4,
      title: "Light not working",
      category: "Electrical",
      location: "Room 104",
      priority: "Medium",
      status: "Pending",
      date: "14 Sept 2026",
      description:
        "Two tube lights are not working in the classroom."
    },
    {
      id: 5,
      title: "Network connection issue",
      category: "Network",
      location: "Library",
      priority: "High",
      status: "In Progress",
      date: "13 Sept 2026",
      description:
        "Students are unable to access the campus network."
    },
    {
      id: 6,
      title: "Water leakage",
      category: "Maintenance",
      location: "Block B",
      priority: "High",
      status: "Pending",
      date: "13 Sept 2026",
      description:
        "Water leakage has been reported near the washroom area."
    },
    {
      id: 7,
      title: "Broken classroom chair",
      category: "Furniture",
      location: "Room 301",
      priority: "Low",
      status: "Resolved",
      date: "12 Sept 2026",
      description:
        "A classroom chair is damaged and needs replacement."
    },
    {
      id: 8,
      title: "AC not working",
      category: "Maintenance",
      location: "Seminar Hall",
      priority: "High",
      status: "Pending",
      date: "11 Sept 2026",
      description:
        "The air conditioning system is not functioning."
    }
  ];


  const filteredIssues = issues.filter((issue) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      issue.title.toLowerCase().includes(searchText) ||
      issue.category.toLowerCase().includes(searchText) ||
      issue.location.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      issue.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      issue.priority === priorityFilter;

    const matchesCategory =
      categoryFilter === "All" ||
      issue.category === categoryFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );
  });


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


        {/* Main Content */}

        <div className="page-content">

          {/* Page Header */}

          <div className="page-header">

            <div>

              <h1>Assigned Issues</h1>

              <p>
                View and manage campus issues assigned to you.
              </p>

            </div>

          </div>


          {/* Filters */}

          <div className="issue-filters">

            {/* Search */}

            <div className="issue-search">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search issues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>


            {/* Status */}

            <div className="filter-group">

              <label>Status</label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Resolved">
                  Resolved
                </option>

              </select>

            </div>


            {/* Priority */}

            <div className="filter-group">

              <label>Priority</label>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
              >

                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>

              </select>

            </div>


            {/* Category */}

            <div className="filter-group">

              <label>Category</label>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
              >

                <option value="All">All</option>
                <option value="Network">Network</option>
                <option value="Electrical">Electrical</option>
                <option value="Classroom">Classroom</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Furniture">Furniture</option>

              </select>

            </div>

          </div>


          {/* Result Count */}

          <div className="issue-count">

            Showing {filteredIssues.length} of {issues.length} assigned issues

          </div>


          {/* Issues */}

          <div className="assigned-issues-list">

            {filteredIssues.length > 0 ? (

              filteredIssues.map((issue) => (

                <div
                  className="assigned-issue-card"
                  key={issue.id}
                >

                  <div className="assigned-issue-main">

                    <div className="assigned-issue-title">

                      <h2>
                        {issue.title}
                      </h2>

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


                    <p className="assigned-description">
                      {issue.description}
                    </p>


                    <div className="issue-priority">

                      Priority:

                      <strong
                        className={`priority-${issue.priority.toLowerCase()}`}
                      >
                        {issue.priority}
                      </strong>

                    </div>

                  </div>


                  <div className="assigned-issue-action">

                    <Link
                      to={`/staff/issues/${issue.id}`}
                      className="view-details-button"
                    >
                      View Details →
                    </Link>

                  </div>

                </div>

              ))

            ) : (

              <div className="no-issues">

                <div className="no-issues-icon">
                  🔍
                </div>

                <h2>
                  No issues found
                </h2>

                <p>
                  Try changing your search or filters.
                </p>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AssignedIssues;