import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getProfile, updateProfile } from "../../services/api";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    role: "Student"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProfile();

        const data =
          response.profile ||
          response.user ||
          response.data ||
          response;

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          department: data.department || "",
          year: data.year || "",
          role: data.role || "Student"
        });
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));

    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        department: profile.department,
        year: profile.year
      });

      const data =
        response.profile ||
        response.user ||
        response.data ||
        response;

      setProfile((prev) => ({
        ...prev,
        name: data.name ?? prev.name,
        email: data.email ?? prev.email,
        phone: data.phone ?? prev.phone,
        department: data.department ?? prev.department,
        year: data.year ?? prev.year,
        role: data.role || prev.role
      }));

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="no-issues">
          <h2>Loading profile...</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="page-header">
        <div>
          <h1>My Profile</h1>

          <p>
            View and manage your account information.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠ {error}
        </div>
      )}

      <div className="profile-container">

        {/* Profile Summary */}

        <div className="profile-summary">

          <div className="profile-avatar">
            {(profile.name || "S").charAt(0).toUpperCase()}
          </div>

          <h2>{profile.name || "Student"}</h2>

          <p>{profile.email || "—"}</p>

          <span className="profile-role">
            {profile.role}
          </span>

        </div>

        {/* Profile Form */}

        <div className="profile-card">

          <h2>Personal Information</h2>

          <form onSubmit={handleSubmit}>

            <div className="profile-form-grid">

              {/* Name */}

              <div className="form-group">

                <label htmlFor="profile-name">
                  Full Name
                </label>

                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
                />

              </div>

              {/* Email */}

              <div className="form-group">

                <label htmlFor="profile-email">
                  Email
                </label>

                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                />

              </div>

              {/* Phone */}

              <div className="form-group">

                <label htmlFor="profile-phone">
                  Phone Number
                </label>

                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={profile.phone}
                  onChange={handleChange}
                />

              </div>

              {/* Department */}

              <div className="form-group">

                <label htmlFor="profile-department">
                  Department
                </label>

                <select
                  id="profile-department"
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Department
                  </option>

                  <option value="CSE-AIML">
                    CSE-AIML
                  </option>

                  <option value="CSE">
                    CSE
                  </option>

                  <option value="ISE">
                    ISE
                  </option>

                  <option value="ECE">
                    ECE
                  </option>

                  <option value="EEE">
                    EEE
                  </option>

                </select>

              </div>

              {/* Year */}

              <div className="form-group">

                <label htmlFor="profile-year">
                  Year
                </label>

                <select
                  id="profile-year"
                  name="year"
                  value={profile.year}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Year
                  </option>

                  <option value="1st Year">
                    1st Year
                  </option>

                  <option value="2nd Year">
                    2nd Year
                  </option>

                  <option value="3rd Year">
                    3rd Year
                  </option>

                  <option value="4th Year">
                    4th Year
                  </option>

                </select>

              </div>

              {/* Role */}

              <div className="form-group">

                <label htmlFor="profile-role">
                  Role
                </label>

                <input
                  id="profile-role"
                  type="text"
                  value={profile.role}
                  disabled
                />

              </div>

            </div>

            {error && (
              <div className="error-message">
                ⚠ {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                ✓ {success}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Profile;