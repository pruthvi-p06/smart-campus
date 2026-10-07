import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getMyIssues } from "../../services/api";

function MyIssues() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyIssues();

        // Backend may return issues directly or inside a data property
        const issueData = response.issues || response.data || response;

        setIssues(Array.isArray(issueData) ? issueData : []);
      } catch (err) {
        setError(err.message || "Failed to load your issues.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Search + status filtering
  const filteredIssues = issues.filter((issue) => {
    const title = issue.title || "";
    const category = issue.category || "";
    const location = issue.location || "";
    const status = issue.status || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format backend date for display
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

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


      {/* Loading */}

      {loading && (
        <div className="no-issues">
          <h2>Loading issues...</h2>
        </div>
      )}


      {/* Error */}

      {!loading && error && (
        <div className="error-message">
          ⚠ {error}
        </div>
      )}


      {!loading && !error && (
        <>

          {/* Issue Count */}

          <div className="issue-count">
            Showing {filteredIssues.length} of {issues.length} issues
          </div>


          {/* Issues */}

          <div className="my-issues-list">

            {filteredIssues.length > 0 ? (

              filteredIssues.map((issue) => {

                const issueId = issue._id || issue.id;
                const status = issue.status || "Pending";
                const priority = issue.priority || "Medium";

                return (
                  <div
                    className="my-issue-card"
                    key={issueId}
                  >

                    <div className="issue-card-main">

                      <div className="issue-card-title">

                        <h2>{issue.title}</h2>

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
                          📁 {issue.category}
                        </span>

                        <span>
                          📍 {issue.location}
                        </span>

                        <span>
                          📅 {formatDate(issue.createdAt || issue.date)}
                        </span>

                      </div>


                      <div className="priority">

                        Priority:

                        <strong
                          className={`priority-${priority.toLowerCase()}`}
                        >
                          {priority}
                        </strong>

                      </div>

                    </div>


                    <Link
                      to={`/student/issues/${issueId}`}
                      className="view-details"
                    >
                      View Details →
                    </Link>

                  </div>
                );
              })

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

        </>
      )}

    </DashboardLayout>
  );
}

export default MyIssues;