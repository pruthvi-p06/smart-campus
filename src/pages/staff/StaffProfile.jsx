import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";
import { getProfile, updateProfile } from "../../services/api";

function StaffProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProfile();

        const profile =
          response.profile ||
          response.user ||
          response.data ||
          response;

        setName(profile.name || "");
        setEmail(profile.email || "");
        setPhone(profile.phone || "");
        setDepartment(profile.department || "");
      } catch (err) {
        setError(
          err.message || "Failed to load profile."
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
      setSuccessMessage("");

      const response = await updateProfile({
        name,
        email,
        phone,
        department
      });

      const updatedProfile =
        response.profile ||
        response.user ||
        response.data ||
        response;

      setName(updatedProfile.name || name);
      setEmail(updatedProfile.email || email);
      setPhone(updatedProfile.phone || phone);
      setDepartment(
        updatedProfile.department || department
      );

      setSuccessMessage(
        "Profile updated successfully!"
      );
    } catch (err) {
      setError(
        err.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">

        <StaffSidebar />

        <main className="main-content">

          <div className="page-content">

            <div className="no-issues">
              <h2>Loading profile...</h2>
            </div>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="dashboard-layout">

      <StaffSidebar />

      <main className="main-content">

        {/* Top Navbar */}

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

              <h1>My Profile</h1>

              <p>
                View and manage your staff account information.
              </p>

            </div>

          </div>


          {error && (

            <div className="error-message">
              ⚠ {error}
            </div>

          )}


          <div className="staff-profile-grid">

            {/* LEFT PROFILE CARD */}

            <section className="profile-summary-card">

              <div className="profile-avatar">
                {(name || "S").charAt(0).toUpperCase()}
              </div>

              <h2>
                {name || "Staff"}
              </h2>

              <p>
                {email || "—"}
              </p>

              <span className="profile-role">
                Staff
              </span>

            </section>


            {/* RIGHT INFORMATION CARD */}

            <section className="profile-form-card">

              <h2>Personal Information</h2>

              <form onSubmit={handleSubmit}>

                <div className="profile-form-grid">

                  {/* Full Name */}

                  <div className="profile-form-group">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setSuccessMessage("");
                      }}
                    />

                  </div>


                  {/* Email */}

                  <div className="profile-form-group">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setSuccessMessage("");
                      }}
                    />

                  </div>


                  {/* Phone */}

                  <div className="profile-form-group">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setSuccessMessage("");
                      }}
                    />

                  </div>


                  {/* Department */}

                  <div className="profile-form-group">

                    <label>
                      Department
                    </label>

                    <select
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        setSuccessMessage("");
                      }}
                    >

                      <option value="">
                        Select Department
                      </option>

                      <option value="Network">
                        Network
                      </option>

                      <option value="Electrical">
                        Electrical
                      </option>

                      <option value="Maintenance">
                        Maintenance
                      </option>

                      <option value="Laboratory">
                        Laboratory
                      </option>

                      <option value="Facilities">
                        Facilities
                      </option>

                    </select>

                  </div>


                  {/* Role */}

                  <div className="profile-form-group">

                    <label>
                      Role
                    </label>

                    <input
                      type="text"
                      value="Staff"
                      disabled
                    />

                  </div>

                </div>


                {/* Error */}

                {error && (

                  <div className="error-message">

                    ⚠ {error}

                  </div>

                )}


                {/* Success Message */}

                {successMessage && (

                  <div className="success-message">

                    ✓ {successMessage}

                  </div>

                )}


                {/* Save Button */}

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

      </main>

    </div>
  );
}

export default StaffProfile;