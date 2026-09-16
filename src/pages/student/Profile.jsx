import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Student Name",
    email: "student@example.com",
    phone: "",
    department: "CSE-AIML",
    year: "2nd Year",
    role: "Student"
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: value
    });

    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccess("Profile updated successfully!");
  };

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


      <div className="profile-container">

        {/* Profile Summary */}

        <div className="profile-summary">

          <div className="profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <h2>{profile.name}</h2>

          <p>{profile.email}</p>

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


            {success && (
              <div className="success-message">
                ✓ {success}
              </div>
            )}


            <button
              type="submit"
              className="primary-button"
            >
              Save Changes
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Profile;