import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";
import { getResources } from "../../services/api";

function StaffResources() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchResources = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await getResources();

        const resourceData =
          response?.resources ||
          response?.data ||
          response ||
          [];

        setResources(
          Array.isArray(resourceData)
            ? resourceData
            : []
        );

      } catch (err) {

        console.error("Failed to load resources:", err);

        setError(
          err.message ||
          "Failed to load campus resources."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchResources();

  }, []);


  const filteredResources = resources.filter((resource) => {

    const searchText = search.toLowerCase();

    const name =
      resource.name ||
      resource.title ||
      "";

    const resourceCategory =
      resource.category ||
      "";

    const location =
      resource.location ||
      "";

    const matchesSearch =
      name.toLowerCase().includes(searchText) ||
      resourceCategory.toLowerCase().includes(searchText) ||
      location.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      resourceCategory === category;

    return matchesSearch && matchesCategory;
  });


  const categories = [
    ...new Set(
      resources
        .map((resource) => resource.category)
        .filter(Boolean)
    )
  ];


  const getIcon = (category) => {

    switch (category) {
      case "Academic":
        return "📚";

      case "Laboratory":
        return "💻";

      case "Sports":
        return "🏟️";

      case "Facility":
        return "🏢";

      default:
        return "🏫";
    }
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


        {/* Page Content */}

        <div className="page-content">

          <div className="page-header">

            <div>

              <h1>
                Campus Resources
              </h1>

              <p>
                Find and view available campus facilities and resources.
              </p>

            </div>

          </div>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          {/* Search and Filter */}

          <div className="resource-filters">

            <div className="resource-search">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <div className="resource-filter-group">

              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                <option value="All">
                  All
                </option>

                {categories.map((item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                ))}

              </select>

            </div>

          </div>


          {/* Result Count */}

          <div className="resource-count">

            {loading
              ? "Loading resources..."
              : `Showing ${filteredResources.length} of ${resources.length} resources`
            }

          </div>


          {/* Resource Cards */}

          <div className="resource-grid">

            {loading ? (

              <div className="no-resources">

                <div>
                  ⏳
                </div>

                <h2>
                  Loading resources...
                </h2>

              </div>

            ) : filteredResources.length > 0 ? (

              filteredResources.map((resource) => {

                const resourceId =
                  resource._id ||
                  resource.id;

                const name =
                  resource.name ||
                  resource.title ||
                  "Unnamed Resource";

                const resourceCategory =
                  resource.category ||
                  "General";

                const location =
                  resource.location ||
                  "—";

                const status =
                  resource.status ||
                  "Available";

                const description =
                  resource.description ||
                  "Campus resource available for students and staff.";

                return (

                  <div
                    className="resource-card"
                    key={resourceId}
                  >

                    <div className="resource-card-top">

                      <div className="resource-icon">
                        {resource.icon ||
                          getIcon(resourceCategory)}
                      </div>

                      <span className="resource-status">
                        {status}
                      </span>

                    </div>


                    <h2>
                      {name}
                    </h2>


                    <p>
                      {description}
                    </p>


                    <div className="resource-card-footer">

                      <span>
                        📁 {resourceCategory}
                      </span>

                      <span>
                        📍 {location}
                      </span>

                    </div>

                  </div>

                );

              })

            ) : (

              <div className="no-resources">

                <div>
                  🔍
                </div>

                <h2>
                  No resources found
                </h2>

                <p>
                  Try changing your search or category filter.
                </p>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default StaffResources;