import { useState } from "react";
import { Link } from "react-router-dom";
import StaffSidebar from "../../components/StaffSidebar";

function StaffProfile() {

  const [name, setName] = useState("Staff Name");
  const [email, setEmail] = useState("staff@example.com");
  const [phone, setPhone] = useState("9876543210");
  const [department, setDepartment] = useState("Network");

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccessMessage("Profile updated successfully!");
  };


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


          <div className="staff-profile-grid">

            {/* LEFT PROFILE CARD */}

            <section className="profile-summary-card">

              <div className="profile-avatar">
                {name.charAt(0).toUpperCase()}
              </div>

              <h2>{name}</h2>

              <p>{email}</p>

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
                >
                  Save Changes
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