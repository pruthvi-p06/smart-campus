import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useParams
} from "react-router-dom";
import {
  getAdminIssues,
  getAdminIssue,
  updateAdminIssue,

  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  updateAdminUserStatus,

  getResources,
  createResource,
  updateResource,
  deleteResource,

  getAnalytics,
  generateInsights,

  getProfile,
  updateProfile,
} from "../../services/api";
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

function AdminIssues() {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminIssues();

        const issueList =
          response.issues ||
          response.data ||
          response ||
          [];

        setIssues(
          Array.isArray(issueList) ? issueList : []
        );
      } catch (err) {
        setError(
          err.message || "Failed to load issues."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredIssues = issues.filter((issue) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (issue.title || "").toLowerCase().includes(searchText) ||
      (issue.category || "").toLowerCase().includes(searchText) ||
      (issue.location || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      formatStatus(issue.status) === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      (issue.priority || "").toLowerCase() ===
        priorityFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === "All" ||
      (issue.category || "").toLowerCase() ===
        categoryFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );
  });

  const categories = [
    ...new Set(
      issues
        .map((issue) => issue.category)
        .filter(Boolean)
    ),
  ];

  return (
    <AdminLayout>

      <div className="page-content">

        <div className="admin-dashboard-header">

          <h1>Manage Issues</h1>

          <p>
            View, assign and manage all reported campus issues.
          </p>

        </div>

        {/* FILTERS */}

        <div className="filters-card">

          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

        </div>

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        {loading ? (

          <div className="no-issues">
            <h2>Loading issues...</h2>
          </div>

        ) : filteredIssues.length === 0 ? (

          <div className="no-issues">
            <h2>No issues found</h2>
            <p>
              No issues match the selected filters.
            </p>
          </div>

        ) : (

          <div className="table-card">

            <table>

              <thead>

                <tr>
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reported</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredIssues.map((issue) => {

                  const issueId =
                    issue._id || issue.id;

                  return (
                    <tr key={issueId}>

                      <td>
                        <strong>
                          {issue.title || "Untitled Issue"}
                        </strong>
                      </td>

                      <td>
                        {issue.category || "—"}
                      </td>

                      <td>
                        {issue.location || "—"}
                      </td>

                      <td>
                        <span
                          className={`priority-${(
                            issue.priority || "Low"
                          ).toLowerCase()}`}
                        >
                          {issue.priority || "Low"}
                        </span>
                      </td>

                      <td>
                        <span className="status">
                          {formatStatus(issue.status)}
                        </span>
                      </td>

                      <td>
                        {issue.createdAt
                          ? new Date(
                              issue.createdAt
                            ).toLocaleDateString()
                          : issue.date || "—"}
                      </td>

                      <td>
                        <Link
                          to={`/admin/issues/${issueId}`}
                          className="view-link"
                        >
                          View
                        </Link>
                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </AdminLayout>
  );
}

/* =========================================================
   ISSUE DETAILS
========================================================= */

function AdminIssueDetails() {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [staff, setStaff] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminIssue(id);

        const issueData =
          response.issue ||
          response.data ||
          response;

        setIssue(issueData);

        setStatus(
          issueData.status
            ? issueData.status
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )
            : "Pending"
        );

        setStaff(
          issueData.assignedTo?.name ||
          issueData.assignedTo?.email ||
          issueData.assignedTo ||
          ""
        );

        setAdminNote(
          issueData.adminNote ||
          issueData.note ||
          ""
        );
      } catch (err) {
        setError(
          err.message || "Failed to load issue."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await updateAdminIssue(id, {
        status,
        assignedTo: staff,
        adminNote,
      });

      setMessage(
        "Issue details updated successfully!"
      );
    } catch (err) {
      setError(
        err.message || "Failed to update issue."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="page-content">
          <div className="no-issues">
            <h2>Loading issue...</h2>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !issue) {
    return (
      <AdminLayout>
        <div className="page-content">
          <Link
            to="/admin/issues"
            className="back-link"
          >
            ← Back to All Issues
          </Link>

          <div className="error-message">
            ⚠ {error}
          </div>
        </div>
      </AdminLayout>
    );
  }

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
            {issue?.title || "Untitled Issue"}
          </h1>

          <p>
            Issue #{issue?._id || issue?.id || id}
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
                <strong>
                  {issue?.category || "—"}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {issue?.location || "—"}
                </strong>
              </div>

              <div>
                <span>Department</span>
                <strong>
                  {issue?.department || "—"}
                </strong>
              </div>

              <div>
                <span>Priority</span>
                <strong
                  className={`priority-${(
                    issue?.priority || "Low"
                  ).toLowerCase()}`}
                >
                  {issue?.priority || "Low"}
                </strong>
              </div>

              <div>
                <span>Reported</span>
                <strong>
                  {issue?.createdAt
                    ? new Date(
                        issue.createdAt
                      ).toLocaleDateString()
                    : issue?.date || "—"}
                </strong>
              </div>

              <div>
                <span>Reported By</span>
                <strong>
                  {issue?.reportedBy?.name ||
                    issue?.reportedBy?.email ||
                    issue?.reportedBy ||
                    "Student"}
                </strong>
              </div>

            </div>

            <div className="description-section">

              <h3>
                Description
              </h3>

              <p>
                {issue?.description ||
                  "No description provided."}
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

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
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

                  <option value="">
                    Select Staff
                  </option>

                  <option value="Campus Network Staff">
                    Campus Network Staff
                  </option>

                  <option value="Electrical Maintenance Staff">
                    Electrical Maintenance Staff
                  </option>

                  <option value="Laboratory Staff">
                    Laboratory Staff
                  </option>

                  <option value="General Maintenance Staff">
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
                  value={adminNote}
                  onChange={(e) => {
                    setAdminNote(e.target.value);
                    setMessage("");
                  }}
                />

              </div>

              {error && (
                <div className="error-message">
                  ⚠ {error}
                </div>
              )}

              {message && (
                <div className="success-message">
                  ✓ {message}
                </div>
              )}

              <button
                type="submit"
                className="save-profile-button"
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : "Update Issue"}
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
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers();

      const userList =
        response.users ||
        response.data ||
        response ||
        [];

      setUsers(
        Array.isArray(userList) ? userList : []
      );
    } catch (err) {
      setError(
        err.message || "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("student");
    setDepartment("");
    setYear("");
    setPhone("");
    setEditingUser(null);
    setShowForm(false);
    setMessage("");
  };

  const handleEdit = (user) => {
    setEditingUser(user);

    setName(user.name || "");
    setEmail(user.email || "");
    setPassword("");
    setRole(
      (user.role || "student").toLowerCase()
    );
    setDepartment(user.department || "");
    setYear(user.year || "");
    setPhone(user.phone || "");

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!name || !email) {
        setError("Name and email are required.");
        return;
      }

      if (!editingUser && !password) {
        setError("Password is required for a new user.");
        return;
      }

      if (editingUser) {
        await updateAdminUser(
          editingUser._id || editingUser.id,
          {
            name,
            role,
            department,
            year,
            phone,
          }
        );

        setMessage(
          "User updated successfully!"
        );
      } else {
        await createAdminUser({
          name,
          email,
          password,
          role,
          department,
          year,
          phone,
        });

        setMessage(
          "User created successfully!"
        );
      }

      await fetchUsers();

      setTimeout(() => {
        resetForm();
      }, 500);

    } catch (err) {
      setError(
        err.message || "Failed to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      setError("");
      setMessage("");

      const currentStatus =
        (user.status || "active").toLowerCase();

      const newStatus =
        currentStatus === "active"
          ? "inactive"
          : "active";

      await updateAdminUserStatus(
        user._id || user.id,
        {
          status: newStatus,
        }
      );

      setMessage(
        `User ${
          newStatus === "active"
            ? "activated"
            : "deactivated"
        } successfully!`
      );

      await fetchUsers();

    } catch (err) {
      setError(
        err.message ||
          "Failed to update user status."
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase();

    return (
      (user.name || "")
        .toLowerCase()
        .includes(text) ||
      (user.email || "")
        .toLowerCase()
        .includes(text) ||
      (user.role || "")
        .toLowerCase()
        .includes(text) ||
      (user.department || "")
        .toLowerCase()
        .includes(text)
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button
            className="primary-button"
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingUser(null);
                setMessage("");
                setError("");
                setShowForm(true);
              }
            }}
          >
            {showForm
              ? "Cancel"
              : "+ Add User"}
          </button>

        </div>

        {showForm && (
          <section className="detail-card">

            <h2>
              {editingUser
                ? "Edit User"
                : "Add New User"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="profile-form-grid">

                <div className="profile-form-group">
                  <label>
                    Full Name
                  </label>

                  <input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div className="profile-form-group">
                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter email"
                    disabled={!!editingUser}
                  />
                </div>

                {!editingUser && (
                  <div className="profile-form-group">
                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                )}

                <div className="profile-form-group">
                  <label>
                    Role
                  </label>

                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                  >
                    <option value="student">
                      Student
                    </option>

                    <option value="staff">
                      Staff
                    </option>

                    <option value="admin">
                      Admin
                    </option>
                  </select>
                </div>

                <div className="profile-form-group">
                  <label>
                    Department
                  </label>

                  <input
                    value={department}
                    onChange={(e) =>
                      setDepartment(e.target.value)
                    }
                    placeholder="Enter department"
                  />
                </div>

                <div className="profile-form-group">
                  <label>
                    Year
                  </label>

                  <input
                    value={year}
                    onChange={(e) =>
                      setYear(e.target.value)
                    }
                    placeholder="Enter year"
                  />
                </div>

                <div className="profile-form-group">
                  <label>
                    Phone
                  </label>

                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Enter phone number"
                  />
                </div>

              </div>

              {error && (
                <div className="error-message">
                  ⚠ {error}
                </div>
              )}

              {message && (
                <div className="success-message">
                  ✓ {message}
                </div>
              )}

              <button
                type="submit"
                className="save-profile-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingUser
                  ? "Update User"
                  : "Create User"}
              </button>

            </form>

          </section>
        )}

        {!showForm && message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}

        {error && !showForm && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        <p className="resource-count">
          Showing {filteredUsers.length} of{" "}
          {users.length} users
        </p>

        {loading ? (

          <div className="no-issues">
            <h2>Loading users...</h2>
          </div>

        ) : filteredUsers.length === 0 ? (

          <div className="no-issues">
            <h2>No users found</h2>
            <p>
              No users match the current search.
            </p>
          </div>

        ) : (

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

                {filteredUsers.map((user) => {

                  const userId =
                    user._id || user.id;

                  const isActive =
                    (user.status || "active")
                      .toLowerCase() === "active";

                  return (
                    <tr key={userId}>

                      <td>
                        <strong>
                          {user.name || "—"}
                        </strong>
                      </td>

                      <td>
                        {user.email || "—"}
                      </td>

                      <td>
                        {(user.role || "—")
                          .charAt(0)
                          .toUpperCase() +
                          (user.role || "")
                            .slice(1)}
                      </td>

                      <td>
                        {user.department || "—"}
                      </td>

                      <td>
                        <span
                          className={
                            isActive
                              ? "status resolved"
                              : "status pending"
                          }
                        >
                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>

                        <button
                          className="text-button"
                          type="button"
                          onClick={() =>
                            handleEdit(user)
                          }
                        >
                          Edit
                        </button>

                        {" "}

                        <button
                          className="text-button"
                          type="button"
                          onClick={() =>
                            handleStatusToggle(user)
                          }
                        >
                          {isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

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
  const [analytics, setAnalytics] =
    useState(null);

  const [insights, setInsights] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAnalytics();

      setAnalytics(response);

      try {
        const insightResponse =
          await generateInsights();

        setInsights(
          insightResponse.insights || []
        );
      } catch {
        setInsights([]);
      }

    } catch (err) {
      setError(
        err.message ||
          "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>

        <div className="page-content">

          <div className="no-issues">
            <h2>
              Loading analytics...
            </h2>
          </div>

        </div>

      </AdminLayout>
    );
  }

  const statusData = [
    {
      name: "Pending",
      value:
        analytics?.issuesByStatus
          ?.Pending ||
        analytics?.pending ||
        0,
    },

    {
      name: "In Progress",
      value:
        analytics?.issuesByStatus?.[
          "In Progress"
        ] ||
        analytics?.inProgress ||
        0,
    },

    {
      name: "Resolved",
      value:
        analytics?.issuesByStatus
          ?.Resolved ||
        analytics?.resolved ||
        0,
    },
  ];

  const categoryData = Object.entries(
    analytics?.issuesByCategory || {}
  )
    .map(([category, issues]) => ({
      category,
      issues,
    }))
    .sort(
      (a, b) =>
        b.issues - a.issues
    );

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

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        {/* KPI */}

        <div className="stats-grid">

          <div className="stat-card">

            <span>
              Total Issues
            </span>

            <strong>
              {analytics?.totalIssues || 0}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              High Priority
            </span>

            <strong>
              {analytics?.highPriority || 0}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Resolution Rate
            </span>

            <strong>
              {analytics?.resolutionRate || 0}%
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Active Staff
            </span>

            <strong>
              {analytics?.activeStaff || 0}
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

              {categoryData.length === 0 ? (

                <div className="no-issues">
                  <p>
                    No category data available.
                  </p>
                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={categoryData}
                  >

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

              )}

            </div>

          </section>

        </div>

        {/* INSIGHTS */}

        <section className="detail-card">

          <h2>
            Key Insights
          </h2>

          {insights.length === 0 ? (

            <div className="insight-list">

              <div className="insight-item">

                <span>
                  ℹ️
                </span>

                <div>

                  <strong>
                    No insights available
                  </strong>

                  <p>
                    More issue data is required to generate operational insights.
                  </p>

                </div>

              </div>

            </div>

          ) : (

            <div className="insight-list">

              {insights.map(
                (insight, index) => (

                  <div
                    className="insight-item"
                    key={
                      `${insight.type || "insight"}-${index}`
                    }
                  >

                    <span>
                      {insight.urgency === "High"
                        ? "🔴"
                        : insight.urgency ===
                          "Medium"
                        ? "🟠"
                        : "🟢"}
                    </span>

                    <div>

                      <strong>
                        {insight.title}
                      </strong>

                      <p>
                        {insight.detail}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </AdminLayout>
  );
}
/* =========================================================
   ADMIN PROFILE
========================================================= */

function AdminProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Administrator");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProfile();

        const profile =
          response.user ||
          response.data ||
          response;

        setName(profile.name || "");
        setEmail(profile.email || "");

        setPhone(profile.phone || "");

        setRole(
          profile.role === "admin"
            ? "Administrator"
            : profile.role || "Administrator"
        );

      } catch (err) {
        setError(
          err.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await updateProfile({
          name,
          phone,
        });

      const updatedProfile =
        response.user ||
        response.data ||
        response;

      if (updatedProfile.name) {
        setName(updatedProfile.name);
      }

      if (updatedProfile.phone !== undefined) {
        setPhone(updatedProfile.phone);
      }

      setMessage(
        "Profile updated successfully!"
      );

    } catch (err) {
      setError(
        err.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>

        <div className="page-content">

          <div className="no-issues">
            <h2>
              Loading profile...
            </h2>
          </div>

        </div>

      </AdminLayout>
    );
  }

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

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        <div className="staff-profile-grid">

          {/* SUMMARY */}

          <section className="profile-summary-card">

            <div className="profile-avatar">

              {name
                ? name
                    .charAt(0)
                    .toUpperCase()
                : "A"}

            </div>

            <h2>
              {name || "Admin"}
            </h2>

            <p>
              {email || "—"}
            </p>

            <span className="profile-role">
              {role}
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
                    disabled
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
                    value={role}
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
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
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