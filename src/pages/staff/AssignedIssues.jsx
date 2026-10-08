import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";
import { getStaffIssues } from "../../services/api";

function AssignedIssues() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

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

  const filteredIssues = issues.filter((issue) => {
    const searchText = search.toLowerCase();

    const title = issue.title || "";
    const category = issue.category || "";
    const location = issue.location || "";
    const status = issue.status || "Pending";
    const priority = issue.priority || "Medium";

    const matchesSearch =
      title.toLowerCase().includes(searchText) ||
      category.toLowerCase().includes(searchText) ||
      location.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      priority === priorityFilter;

    const matchesCategory =
      categoryFilter === "All" ||
      category === categoryFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );
  });

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
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

          {!loading && !error && (
            <div className="issue-count">

              Showing {filteredIssues.length} of{" "}
              {issues.length} assigned issues

            </div>
          )}


          {/* Loading */}

          {loading && (
            <div className="no-issues">

              <h2>Loading assigned issues...</h2>

            </div>
          )}


          {/* Error */}

          {!loading && error && (
            <div className="error-message">

              ⚠ {error}

            </div>
          )}


          {/* Issues */}

          {!loading && !error && (
            <div className="assigned-issues-list">

              {filteredIssues.length > 0 ? (

                filteredIssues.map((issue) => {

                  const issueId = issue._id || issue.id;
                  const status = issue.status || "Pending";
                  const priority = issue.priority || "Medium";

                  return (

                    <div
                      className="assigned-issue-card"
                      key={issueId}
                    >

                      <div className="assigned-issue-main">

                        <div className="assigned-issue-title">

                          <h2>
                            {issue.title || "Untitled Issue"}
                          </h2>

                          <span
                            className={`status ${status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {status}
                          </span>

                        </div>


                        <div className="issue-meta">

                          <span>
                            📁 {issue.category || "—"}
                          </span>

                          <span>
                            📍 {issue.location || "—"}
                          </span>

                          <span>
                            📅{" "}
                            {formatDate(
                              issue.createdAt ||
                              issue.reportedDate
                            )}
                          </span>

                        </div>


                        <p className="assigned-description">

                          {issue.description ||
                            "No description provided."}

                        </p>


                        <div className="issue-priority">

                          Priority:

                          <strong
                            className={`priority-${priority.toLowerCase()}`}
                          >
                            {priority}
                          </strong>

                        </div>

                      </div>


                      <div className="assigned-issue-action">

                        <Link
                          to={`/staff/issues/${issueId}`}
                          className="view-details-button"
                        >
                          View Details →
                        </Link>

                      </div>

                    </div>

                  );
                })

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
          )}

        </div>

      </main>

    </div>
  );
}

export default AssignedIssues;