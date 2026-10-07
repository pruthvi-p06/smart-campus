import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getResources } from "../../services/api";

function Resources() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getResources();

        const resourceList =
          response.resources ||
          response.data ||
          response ||
          [];

        setResources(
          Array.isArray(resourceList) ? resourceList : []
        );
      } catch (err) {
        setError(
          err.message || "Failed to load resources."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter((resource) => {
    const name = resource.name || "";
    const category = resource.category || "";
    const location = resource.location || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getResourceIcon = (category) => {
    if (category === "Academic") return "📚";
    if (category === "Laboratory") return "💻";
    if (category === "Facility") return "🏢";
    if (category === "Health") return "🏥";
    if (category === "Sports") return "🏟️";

    return "🏫";
  };

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="page-header">

        <div>
          <h1>Campus Resources</h1>

          <p>
            Find and view available campus facilities and resources.
          </p>
        </div>

      </div>

      {/* Filters */}

      <div className="resource-filters">

        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="status-filter">

          <label htmlFor="resource-category">
            Category
          </label>

          <select
            id="resource-category"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >

            <option value="All">All</option>
            <option value="Academic">Academic</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Facility">Facility</option>
            <option value="Health">Health</option>
            <option value="Sports">Sports</option>

          </select>

        </div>

      </div>

      {error && (
        <div className="error-message">
          ⚠ {error}
        </div>
      )}

      {/* Count */}

      {!loading && (
        <div className="issue-count">
          Showing {filteredResources.length} of{" "}
          {resources.length} resources
        </div>
      )}

      {/* Resource Cards */}

      {loading ? (

        <div className="no-issues">
          <h2>Loading resources...</h2>
        </div>

      ) : (

        <div className="resources-grid">

          {filteredResources.length > 0 ? (

            filteredResources.map((resource) => (

              <div
                className="resource-card"
                key={resource._id || resource.id}
              >

                <div className="resource-card-header">

                  <div className="resource-icon">
                    {getResourceIcon(resource.category)}
                  </div>

                  <span
                    className={`availability ${
                      (resource.availability || "")
                        .toLowerCase()
                        .replace(" ", "-")
                    }`}
                  >
                    {resource.availability || "Available"}
                  </span>

                </div>

                <h2>
                  {resource.name || "Unnamed Resource"}
                </h2>

                <p className="resource-description">
                  {resource.description ||
                    "No description available."}
                </p>

                <div className="resource-meta">

                  <span>
                    📁 {resource.category || "—"}
                  </span>

                  <span>
                    📍 {resource.location || "—"}
                  </span>

                </div>

              </div>

            ))

          ) : (

            <div className="no-issues">
              <div className="no-issues-icon">🔍</div>

              <h2>No resources found</h2>

              <p>
                Try changing your search or category filter.
              </p>
            </div>

          )}

        </div>

      )}

    </DashboardLayout>
  );
}

export default Resources;