import { useState } from "react";
import { Link } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";

function StaffResources() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const resources = [
    {
      id: 1,
      name: "Central Library",
      category: "Academic",
      location: "Main Block",
      status: "Open",
      icon: "📚",
      description:
        "Library with textbooks, reference materials and study spaces."
    },
    {
      id: 2,
      name: "Computer Lab 3",
      category: "Laboratory",
      location: "Block A",
      status: "Available",
      icon: "💻",
      description:
        "Computer laboratory available for academic and project work."
    },
    {
      id: 3,
      name: "Seminar Hall",
      category: "Facility",
      location: "Block B",
      status: "Available",
      icon: "🏢",
      description:
        "Large hall for seminars, presentations and academic events."
    },
    {
      id: 4,
      name: "Innovation Lab",
      category: "Laboratory",
      location: "Block C",
      status: "Available",
      icon: "🔬",
      description:
        "Dedicated space for innovation, research and student projects."
    },
    {
      id: 5,
      name: "Sports Ground",
      category: "Sports",
      location: "East Campus",
      status: "Open",
      icon: "🏟️",
      description:
        "Outdoor sports facility available for students and staff."
    },
    {
      id: 6,
      name: "Auditorium",
      category: "Facility",
      location: "Main Block",
      status: "Available",
      icon: "🎭",
      description:
        "Auditorium for college events, talks and cultural programs."
    }
  ];


  const filteredResources = resources.filter((resource) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      resource.name.toLowerCase().includes(searchText) ||
      resource.category.toLowerCase().includes(searchText) ||
      resource.location.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      resource.category === category;

    return matchesSearch && matchesCategory;
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


        {/* Page Content */}

        <div className="page-content">

          <div className="page-header">

            <div>

              <h1>Campus Resources</h1>

              <p>
                Find and view available campus facilities and resources.
              </p>

            </div>

          </div>


          {/* Search and Filter */}

          <div className="resource-filters">

            <div className="resource-search">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>


            <div className="resource-filter-group">

              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >

                <option value="All">
                  All
                </option>

                <option value="Academic">
                  Academic
                </option>

                <option value="Laboratory">
                  Laboratory
                </option>

                <option value="Facility">
                  Facility
                </option>

                <option value="Sports">
                  Sports
                </option>

              </select>

            </div>

          </div>


          {/* Result Count */}

          <div className="resource-count">

            Showing {filteredResources.length} of{" "}
            {resources.length} resources

          </div>


          {/* Resource Cards */}

          <div className="resource-grid">

            {filteredResources.length > 0 ? (

              filteredResources.map((resource) => (

                <div
                  className="resource-card"
                  key={resource.id}
                >

                  <div className="resource-card-top">

                    <div className="resource-icon">
                      {resource.icon}
                    </div>

                    <span className="resource-status">
                      {resource.status}
                    </span>

                  </div>


                  <h2>
                    {resource.name}
                  </h2>


                  <p>
                    {resource.description}
                  </p>


                  <div className="resource-card-footer">

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