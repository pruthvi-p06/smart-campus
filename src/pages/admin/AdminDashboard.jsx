import { Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

function AdminDashboard() {

  const stats = [
    {
      title: "Total Issues",
      value: "24"
    },
    {
      title: "Pending",
      value: "7"
    },
    {
      title: "In Progress",
      value: "6"
    },
    {
      title: "Resolved",
      value: "11"
    }
  ];


  const recentIssues = [
    {
      id: 1,
      issue: "WiFi not working",
      category: "Network",
      location: "Lab 3",
      priority: "High",
      status: "Pending"
    },
    {
      id: 2,
      issue: "Broken Fan",
      category: "Electrical",
      location: "Block A",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 3,
      issue: "Projector problem",
      category: "Classroom",
      location: "Room 205",
      priority: "Low",
      status: "Resolved"
    },
    {
      id: 4,
      issue: "Water leakage",
      category: "Plumbing",
      location: "Block B",
      priority: "High",
      status: "Pending"
    }
  ];


  return (

    <div className="dashboard-layout">

      <AdminSidebar />

      <main className="main-content">

        {/* Top Navbar */}

        <header className="top-navbar">

          <h2>SmartCampus</h2>

          <div className="navbar-right">

            <span>🔔</span>

            <Link to="/admin/profile">
              Profile
            </Link>

          </div>

        </header>


        {/* Dashboard */}

        <div className="page-content">

          <div className="admin-dashboard-header">

            <div>

              <h1>
                Admin Dashboard
              </h1>

              <p>
                Monitor and manage campus issues, users and resources.
              </p>

            </div>

          </div>


          {/* Statistics */}

          <div className="stats-grid">

            {stats.map((stat) => (

              <div
                className="stat-card"
                key={stat.title}
              >

                <span>
                  {stat.title}
                </span>

                <strong>
                  {stat.value}
                </strong>

              </div>

            ))}

          </div>


          {/* Quick Actions */}

          <section className="admin-section">

            <div className="section-heading">

              <h2>
                Quick Actions
              </h2>

            </div>


            <div className="quick-actions">

              <Link
                to="/admin/issues"
                className="quick-action-card"
              >

                <span className="quick-action-icon">
                  📋
                </span>

                <div>

                  <h3>
                    Manage Issues
                  </h3>

                  <p>
                    View, assign and update campus issues.
                  </p>

                </div>

              </Link>


              <Link
                to="/admin/users"
                className="quick-action-card"
              >

                <span className="quick-action-icon">
                  👥
                </span>

                <div>

                  <h3>
                    Manage Users
                  </h3>

                  <p>
                    Manage students and staff accounts.
                  </p>

                </div>

              </Link>


              <Link
                to="/admin/resources"
                className="quick-action-card"
              >

                <span className="quick-action-icon">
                  🏫
                </span>

                <div>

                  <h3>
                    Manage Resources
                  </h3>

                  <p>
                    Add and manage campus facilities.
                  </p>

                </div>

              </Link>


              <Link
                to="/admin/analytics"
                className="quick-action-card"
              >

                <span className="quick-action-icon">
                  📊
                </span>

                <div>

                  <h3>
                    View Analytics
                  </h3>

                  <p>
                    Analyze campus issue trends and insights.
                  </p>

                </div>

              </Link>

            </div>

          </section>


          {/* Recent Issues */}

          <section className="admin-section">

            <div className="section-heading">

              <h2>
                Recent Issues
              </h2>

              <Link to="/admin/issues">
                View All
              </Link>

            </div>


            <div className="table-card">

              <table>

                <thead>

                  <tr>

                    <th>
                      Issue
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Priority
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentIssues.map((issue) => (

                    <tr key={issue.id}>

                      <td>
                        <strong>
                          {issue.issue}
                        </strong>
                      </td>

                      <td>
                        {issue.category}
                      </td>

                      <td>
                        {issue.location}
                      </td>

                      <td>

                        <span
                          className={`priority-${issue.priority.toLowerCase()}`}
                        >
                          {issue.priority}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`status ${issue.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {issue.status}
                        </span>

                      </td>

                      <td>

                        <Link
                          to={`/admin/issues/${issue.id}`}
                          className="view-link"
                        >
                          View
                        </Link>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;