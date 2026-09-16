import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

function Resources() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const resources = [
    {
      id: 1,
      name: "Central Library",
      category: "Academic",
      location: "Main Block",
      availability: "Open",
      description:
        "Library with textbooks, reference materials and study spaces."
    },
    {
      id: 2,
      name: "Computer Lab 3",
      category: "Laboratory",
      location: "Block A",
      availability: "Available",
      description:
        "Computer laboratory available for academic and project work."
    },
    {
      id: 3,
      name: "Seminar Hall",
      category: "Facility",
      location: "Block B",
      availability: "Available",
      description:
        "Large hall for seminars, presentations and academic events."
    },
    {
      id: 4,
      name: "Medical Centre",
      category: "Health",
      location: "Main Block",
      availability: "Open",
      description:
        "Campus medical facility for basic medical assistance."
    },
    {
      id: 5,
      name: "Sports Complex",
      category: "Sports",
      location: "Campus Ground",
      availability: "Available",
      description:
        "Facilities for indoor and outdoor sports activities."
    },
    {
      id: 6,
      name: "Project Discussion Room",
      category: "Facility",
      location: "Block A",
      availability: "Occupied",
      description:
        "Small discussion room for student project meetings."
    }
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(search.toLowerCase()) ||
      resource.category.toLowerCase().includes(search.toLowerCase()) ||
      resource.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      resource.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

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
            onChange={(e) => setCategoryFilter(e.target.value)}
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


      {/* Count */}

      <div className="issue-count">
        Showing {filteredResources.length} of {resources.length} resources
      </div>


      {/* Resource Cards */}

      <div className="resources-grid">

        {filteredResources.length > 0 ? (

          filteredResources.map((resource) => (

            <div
              className="resource-card"
              key={resource.id}
            >

              <div className="resource-card-header">

                <div className="resource-icon">
                  {resource.category === "Academic" && "📚"}
                  {resource.category === "Laboratory" && "💻"}
                  {resource.category === "Facility" && "🏢"}
                  {resource.category === "Health" && "🏥"}
                  {resource.category === "Sports" && "🏟️"}
                </div>

                <span
                  className={`availability ${resource.availability
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {resource.availability}
                </span>

              </div>


              <h2>{resource.name}</h2>

              <p className="resource-description">
                {resource.description}
              </p>


              <div className="resource-meta">

                <span>
                  📁 {resource.category}
                </span>

                <span>
                  📍 {resource.location}
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

    </DashboardLayout>
  );
}

export default Resources;