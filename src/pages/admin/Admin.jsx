import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";


/* =========================================================
   ADMIN SIDEBAR
========================================================= */

function AdminSidebar() {

  return (
    <aside className="sidebar">

      <h2 className="sidebar-logo">
        SmartCampus
      </h2>

      <nav className="sidebar-nav">

        <NavLink to="/admin/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/admin/issues">
          All Issues
        </NavLink>

        <NavLink to="/admin/users">
          Users
        </NavLink>

        <NavLink to="/admin/resources">
          Resources
        </NavLink>

        <NavLink to="/admin/analytics">
          Analytics
        </NavLink>

      </nav>

      <nav className="sidebar-bottom">

        <NavLink to="/admin/profile">
          Profile
        </NavLink>

        <NavLink to="/login">
          Logout
        </NavLink>

      </nav>

    </aside>
  );
}


/* =========================================================
   ADMIN LAYOUT
========================================================= */

function AdminLayout({ children }) {

  return (
    <div className="dashboard-layout">

      <AdminSidebar />

      <main className="main-content">

        <header className="top-navbar">

          <h2>SmartCampus</h2>

          <div className="navbar-right">

            <span>🔔</span>

            <Link to="/admin/profile">
              Profile
            </Link>

          </div>

        </header>

        {children}

      </main>

    </div>
  );
}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard() {

  const stats = [
    {
      title: "Total Issues",
      value: 24
    },
    {
      title: "Pending",
      value: 7
    },
    {
      title: "In Progress",
      value: 6
    },
    {
      title: "Resolved",
      value: 11
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
    <AdminLayout>

      <div className="page-content">

        <div className="admin-dashboard-header">

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Monitor and manage campus issues, users and resources.
          </p>

        </div>


        {/* STATISTICS */}

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


        {/* QUICK ACTIONS */}

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


        {/* RECENT ISSUES */}

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
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
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

    </AdminLayout>
  );
}


/* =========================================================
   ALL ISSUES
========================================================= */

function AdminIssues() {

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [category, setCategory] = useState("All");


  const issues = [
    {
      id: 1,
      title: "WiFi not working",
      category: "Network",
      location: "Lab 3",
      priority: "High",
      status: "Pending",
      department: "CSE-AIML"
    },
    {
      id: 2,
      title: "Broken Fan",
      category: "Electrical",
      location: "Block A",
      priority: "Medium",
      status: "In Progress",
      department: "ECE"
    },
    {
      id: 3,
      title: "Projector problem",
      category: "Classroom",
      location: "Room 205",
      priority: "Low",
      status: "Resolved",
      department: "CSE-AIML"
    },
    {
      id: 4,
      title: "Water leakage",
      category: "Plumbing",
      location: "Block B",
      priority: "High",
      status: "Pending",
      department: "Civil"
    },
    {
      id: 5,
      title: "AC not working",
      category: "Electrical",
      location: "Room 302",
      priority: "High",
      status: "In Progress",
      department: "ISE"
    },
    {
      id: 6,
      title: "Lights not working",
      category: "Electrical",
      location: "Lab 2",
      priority: "Medium",
      status: "Resolved",
      department: "CSE-AIML"
    },
    {
      id: 7,
      title: "Broken classroom chair",
      category: "Furniture",
      location: "Room 105",
      priority: "Low",
      status: "Pending",
      department: "CSE"
    },
    {
      id: 8,
      title: "Network connection issue",
      category: "Network",
      location: "Library",
      priority: "High",
      status: "In Progress",
      department: "CSE-AIML"
    }
  ];


  const filteredIssues = issues.filter((issue) => {

    const text = search.toLowerCase();

    const matchesSearch =
      issue.title.toLowerCase().includes(text) ||
      issue.category.toLowerCase().includes(text) ||
      issue.location.toLowerCase().includes(text);

    const matchesStatus =
      status === "All" ||
      issue.status === status;

    const matchesPriority =
      priority === "All" ||
      issue.priority === priority;

    const matchesCategory =
      category === "All" ||
      issue.category === category;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );

  });


  return (
    <AdminLayout>

      <div className="page-content">

        <div className="page-header">

          <div>

            <h1>
              All Issues
            </h1>

            <p>
              View and manage all reported campus issues.
            </p>

          </div>

        </div>


        {/* FILTERS */}

        <div className="admin-filter-box">

          <input
            type="text"
            placeholder="🔍 Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />


          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >

            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>

          </select>


          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >

            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>

          </select>


          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <option>All</option>
            <option>Network</option>
            <option>Electrical</option>
            <option>Classroom</option>
            <option>Plumbing</option>
            <option>Furniture</option>

          </select>

        </div>


        <p className="resource-count">
          Showing {filteredIssues.length} of {issues.length} issues
        </p>


        {/* ISSUE TABLE */}

        <div className="table-card">

          <table>

            <thead>

              <tr>
                <th>Issue</th>
                <th>Category</th>
                <th>Location</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredIssues.map((issue) => (

                <tr key={issue.id}>

                  <td>
                    <strong>
                      {issue.title}
                    </strong>
                  </td>

                  <td>
                    {issue.category}
                  </td>

                  <td>
                    {issue.location}
                  </td>

                  <td>
                    {issue.department}
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
                      View Details
                    </Link>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  );
}


/* =========================================================
   ISSUE DETAILS
========================================================= */

function AdminIssueDetails() {

  const { id } = useParams();

  const [status, setStatus] = useState("Pending");
  const [staff, setStaff] = useState("Campus Network Staff");
  const [message, setMessage] = useState("");


  const handleUpdate = (e) => {

    e.preventDefault();

    setMessage("Issue details updated successfully!");

  };


  return (
    <AdminLayout>

      <div className="page-content">

        <Link
          to="/admin/issues"
          className="back-link"
        >
          ← Back to All Issues
        </Link>


        <div className="issue-detail-header">

          <h1>
            WiFi not working
          </h1>

          <p>
            Issue #{id}
          </p>

        </div>


        <div className="admin-detail-grid">

          {/* INFORMATION */}

          <section className="detail-card">

            <h2>
              Issue Information
            </h2>


            <div className="issue-information-grid">

              <div>
                <span>Category</span>
                <strong>Network</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>Lab 3</strong>
              </div>

              <div>
                <span>Department</span>
                <strong>CSE-AIML</strong>
              </div>

              <div>
                <span>Priority</span>
                <strong className="priority-high">
                  High
                </strong>
              </div>

              <div>
                <span>Reported</span>
                <strong>
                  16 Sept 2026
                </strong>
              </div>

              <div>
                <span>Reported By</span>
                <strong>
                  Student
                </strong>
              </div>

            </div>


            <div className="description-section">

              <h3>
                Description
              </h3>

              <p>
                The WiFi connection is not working properly in Lab 3.
                Students are unable to access the internet during
                laboratory sessions.
              </p>

            </div>

          </section>


          {/* ADMIN ACTION */}

          <section className="detail-card">

            <h2>
              Manage Issue
            </h2>

            <form onSubmit={handleUpdate}>


              <div className="form-group">

                <label>
                  Issue Status
                </label>

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setMessage("");
                  }}
                >

                  <option>
                    Pending
                  </option>

                  <option>
                    In Progress
                  </option>

                  <option>
                    Resolved
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Assign Staff
                </label>

                <select
                  value={staff}
                  onChange={(e) => {
                    setStaff(e.target.value);
                    setMessage("");
                  }}
                >

                  <option>
                    Campus Network Staff
                  </option>

                  <option>
                    Electrical Maintenance Staff
                  </option>

                  <option>
                    Laboratory Staff
                  </option>

                  <option>
                    General Maintenance Staff
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Admin Note
                </label>

                <textarea
                  rows="5"
                  placeholder="Add a note about this issue..."
                />

              </div>


              {message && (

                <div className="success-message">
                  ✓ {message}
                </div>

              )}


              <button
                type="submit"
                className="save-profile-button"
              >
                Update Issue
              </button>

            </form>

          </section>

        </div>

      </div>

    </AdminLayout>
  );
}


/* =========================================================
   USER MANAGEMENT
========================================================= */

function AdminUsers() {

  const [search, setSearch] = useState("");


  const users = [
    {
      id: 1,
      name: "Student One",
      email: "student1@example.com",
      role: "Student",
      department: "CSE-AIML",
      status: "Active"
    },
    {
      id: 2,
      name: "Student Two",
      email: "student2@example.com",
      role: "Student",
      department: "ISE",
      status: "Active"
    },
    {
      id: 3,
      name: "Network Staff",
      email: "network@example.com",
      role: "Staff",
      department: "Network",
      status: "Active"
    },
    {
      id: 4,
      name: "Electrical Staff",
      email: "electrical@example.com",
      role: "Staff",
      department: "Electrical",
      status: "Active"
    },
    {
      id: 5,
      name: "Maintenance Staff",
      email: "maintenance@example.com",
      role: "Staff",
      department: "Maintenance",
      status: "Inactive"
    }
  ];


  const filteredUsers = users.filter((user) => {

    const text = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text) ||
      user.role.toLowerCase().includes(text) ||
      user.department.toLowerCase().includes(text)
    );

  });


  return (
    <AdminLayout>

      <div className="page-content">

        <div className="page-header">

          <h1>
            User Management
          </h1>

          <p>
            Manage students and staff accounts.
          </p>

        </div>


        <div className="admin-user-toolbar">

          <input
            type="text"
            placeholder="🔍 Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="primary-button">
            + Add User
          </button>

        </div>


        <p className="resource-count">
          Showing {filteredUsers.length} of {users.length} users
        </p>


        <div className="table-card">

          <table>

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user.id}>

                  <td>
                    <strong>
                      {user.name}
                    </strong>
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    {user.role}
                  </td>

                  <td>
                    {user.department}
                  </td>

                  <td>

                    <span
                      className={
                        user.status === "Active"
                          ? "status resolved"
                          : "status pending"
                      }
                    >
                      {user.status}
                    </span>

                  </td>

                  <td>

                    <button className="text-button">
                      Edit
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  );
}


/* =========================================================
   RESOURCE MANAGEMENT
========================================================= */

function AdminResources() {

  const [resources, setResources] = useState([

    {
      id: 1,
      name: "Central Library",
      category: "Academic",
      location: "Main Block",
      status: "Open"
    },

    {
      id: 2,
      name: "Computer Lab 3",
      category: "Laboratory",
      location: "Block A",
      status: "Available"
    },

    {
      id: 3,
      name: "Seminar Hall",
      category: "Facility",
      location: "Block B",
      status: "Available"
    },

    {
      id: 4,
      name: "Innovation Lab",
      category: "Laboratory",
      location: "Block C",
      status: "Available"
    }

  ]);


  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Academic");
  const [location, setLocation] = useState("");


  const addResource = (e) => {

    e.preventDefault();

    if (!name || !location) {
      return;
    }

    const newResource = {

      id: resources.length + 1,

      name,

      category,

      location,

      status: "Available"

    };


    setResources([
      ...resources,
      newResource
    ]);

    setName("");
    setLocation("");

    setShowForm(false);
  };


  return (
    <AdminLayout>

      <div className="page-content">

        <div className="page-header admin-resource-header">

          <div>

            <h1>
              Resource Management
            </h1>

            <p>
              Add and manage campus facilities and resources.
            </p>

          </div>


          <button
            className="primary-button"
            onClick={() => setShowForm(!showForm)}
          >
            + Add Resource
          </button>

        </div>


        {/* ADD RESOURCE FORM */}

        {showForm && (

          <section className="detail-card">

            <h2>
              Add New Resource
            </h2>

            <form onSubmit={addResource}>

              <div className="profile-form-grid">

                <div className="profile-form-group">

                  <label>
                    Resource Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter resource name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />

                </div>


                <div className="profile-form-group">

                  <label>
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                  >

                    <option>
                      Academic
                    </option>

                    <option>
                      Laboratory
                    </option>

                    <option>
                      Facility
                    </option>

                    <option>
                      Sports
                    </option>

                  </select>

                </div>


                <div className="profile-form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                  />

                </div>

              </div>


              <button
                type="submit"
                className="save-profile-button"
              >
                Add Resource
              </button>

            </form>

          </section>

        )}


        {/* RESOURCE TABLE */}

        <div className="table-card">

          <table>

            <thead>

              <tr>
                <th>Resource</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {resources.map((resource) => (

                <tr key={resource.id}>

                  <td>
                    <strong>
                      {resource.name}
                    </strong>
                  </td>

                  <td>
                    {resource.category}
                  </td>

                  <td>
                    {resource.location}
                  </td>

                  <td>

                    <span className="status resolved">
                      {resource.status}
                    </span>

                  </td>

                  <td>

                    <button className="text-button">
                      Edit
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  );
}


/* =========================================================
   ANALYTICS
========================================================= */

function AdminAnalytics() {

  const statusData = [

    {
      name: "Pending",
      value: 7
    },

    {
      name: "In Progress",
      value: 6
    },

    {
      name: "Resolved",
      value: 11
    }

  ];


  const categoryData = [

    {
      category: "Network",
      issues: 7
    },

    {
      category: "Electrical",
      issues: 5
    },

    {
      category: "Classroom",
      issues: 4
    },

    {
      category: "Plumbing",
      issues: 3
    },

    {
      category: "Furniture",
      issues: 3
    }

  ];


  return (
    <AdminLayout>

      <div className="page-content">

        <div className="page-header">

          <h1>
            Analytics & Insights
          </h1>

          <p>
            Analyze campus issue trends and identify areas requiring attention.
          </p>

        </div>


        {/* KPI */}

        <div className="stats-grid">

          <div className="stat-card">

            <span>
              Total Issues
            </span>

            <strong>
              24
            </strong>

          </div>

          <div className="stat-card">

            <span>
              High Priority
            </span>

            <strong>
              8
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Resolution Rate
            </span>

            <strong>
              46%
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Active Staff
            </span>

            <strong>
              6
            </strong>

          </div>

        </div>


        {/* CHARTS */}

        <div className="analytics-grid">


          {/* PIE CHART */}

          <section className="detail-card">

            <h2>
              Issues by Status
            </h2>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >

                    {statusData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </section>


          {/* BAR CHART */}

          <section className="detail-card">

            <h2>
              Issues by Category
            </h2>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart data={categoryData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="category"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="issues"
                    name="Issues"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </section>

        </div>


        {/* INSIGHTS */}

        <section className="detail-card">

          <h2>
            Key Insights
          </h2>


          <div className="insight-list">

            <div className="insight-item">

              <span>
                🔴
              </span>

              <div>

                <strong>
                  Network issues require attention
                </strong>

                <p>
                  Network-related problems represent a significant
                  portion of reported campus issues.
                </p>

              </div>

            </div>


            <div className="insight-item">

              <span>
                🟠
              </span>

              <div>

                <strong>
                  Several issues are still pending
                </strong>

                <p>
                  Pending issues should be reviewed and assigned
                  to appropriate staff members.
                </p>

              </div>

            </div>


            <div className="insight-item">

              <span>
                🟢
              </span>

              <div>

                <strong>
                  Issues are being resolved
                </strong>

                <p>
                  Resolved issues indicate that the campus
                  maintenance workflow is being tracked.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </AdminLayout>
  );
}


/* =========================================================
   ADMIN PROFILE
========================================================= */

function AdminProfile() {

  const [name, setName] = useState("Admin Name");
  const [email, setEmail] = useState("admin@example.com");
  const [phone, setPhone] = useState("9876543210");

  const [message, setMessage] = useState("");


  const handleSubmit = (e) => {

    e.preventDefault();

    setMessage("Profile updated successfully!");

  };


  return (
    <AdminLayout>

      <div className="page-content">

        <div className="page-header">

          <h1>
            My Profile
          </h1>

          <p>
            View and manage your administrator account.
          </p>

        </div>


        <div className="staff-profile-grid">


          {/* SUMMARY */}

          <section className="profile-summary-card">

            <div className="profile-avatar">

              {name
                .charAt(0)
                .toUpperCase()}

            </div>

            <h2>
              {name}
            </h2>

            <p>
              {email}
            </p>

            <span className="profile-role">
              Administrator
            </span>

          </section>


          {/* FORM */}

          <section className="profile-form-card">

            <h2>
              Personal Information
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="profile-form-grid">


                <div className="profile-form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setMessage("");
                    }}
                  />

                </div>


                <div className="profile-form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setMessage("");
                    }}
                  />

                </div>


                <div className="profile-form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setMessage("");
                    }}
                  />

                </div>


                <div className="profile-form-group">

                  <label>
                    Role
                  </label>

                  <input
                    value="Administrator"
                    disabled
                  />

                </div>

              </div>


              {message && (

                <div className="success-message">
                  ✓ {message}
                </div>

              )}


              <button
                type="submit"
                className="save-profile-button"
              >
                Save Changes
              </button>

            </form>

          </section>

        </div>

      </div>

    </AdminLayout>
  );
}


/* =========================================================
   MAIN ADMIN ROUTER
========================================================= */

function Admin() {

  const path = window.location.pathname;


  if (path === "/admin/dashboard") {
    return <AdminDashboard />;
  }


  if (path === "/admin/issues") {
    return <AdminIssues />;
  }


  if (path.startsWith("/admin/issues/")) {
    return <AdminIssueDetails />;
  }


  if (path === "/admin/users") {
    return <AdminUsers />;
  }


  if (path === "/admin/resources") {
    return <AdminResources />;
  }


  if (path === "/admin/analytics") {
    return <AdminAnalytics />;
  }


  if (path === "/admin/profile") {
    return <AdminProfile />;
  }


  return <AdminDashboard />;
}


export default Admin;