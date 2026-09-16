import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

function ReportIssue() {

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    department: "",
    description: "",
    image: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleImageChange = (e) => {

    setFormData({
      ...formData,
      image: e.target.files[0]
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter an issue title.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.location) {
      setError("Please select a location.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    if (formData.description.trim().length < 10) {
      setError("Description must contain at least 10 characters.");
      return;
    }

    setSuccess("Issue submitted successfully!");

    setFormData({
      title: "",
      category: "",
      location: "",
      department: "",
      description: "",
      image: null
    });

  };

  return (

    <DashboardLayout>

      <div className="page-header">

        <div>
          <h1>Report an Issue</h1>

          <p>
            Help us improve the campus by reporting a problem.
          </p>
        </div>

      </div>


      <div className="issue-form-container">

        <form
          className="issue-form"
          onSubmit={handleSubmit}
        >

          {/* Issue Title */}

          <div className="form-group">

            <label htmlFor="title">
              Issue Title *
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Example: WiFi not working"
              value={formData.title}
              onChange={handleChange}
            />

          </div>


          {/* Category */}

          <div className="form-group">

            <label htmlFor="category">
              Category *
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >

              <option value="">
                Select category
              </option>

              <option value="Classroom">
                Classroom
              </option>

              <option value="Laboratory">
                Laboratory
              </option>

              <option value="Network">
                Network
              </option>

              <option value="Electrical">
                Electrical
              </option>

              <option value="Cleanliness">
                Cleanliness
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* Location */}

          <div className="form-group">

            <label htmlFor="location">
              Location *
            </label>

            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            >

              <option value="">
                Select location
              </option>

              <option value="Block A">
                Block A
              </option>

              <option value="Block B">
                Block B
              </option>

              <option value="Lab 1">
                Lab 1
              </option>

              <option value="Lab 2">
                Lab 2
              </option>

              <option value="Lab 3">
                Lab 3
              </option>

              <option value="Room 205">
                Room 205
              </option>

              <option value="Library">
                Library
              </option>

            </select>

          </div>


          {/* Department */}

          <div className="form-group">

            <label htmlFor="department">
              Department
            </label>

            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >

              <option value="">
                Select department
              </option>

              <option value="CSE">
                CSE
              </option>

              <option value="AIML">
                CSE-AIML
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

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* Description */}

          <div className="form-group">

            <label htmlFor="description">
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={handleChange}
            />

          </div>


          {/* Image */}

          <div className="form-group">

            <label htmlFor="image">
              Attach Image
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <small>
              Optional. You can upload an image of the issue.
            </small>

          </div>


          {/* Error */}

          {error && (
            <div className="error-message">
              ⚠ {error}
            </div>
          )}


          {/* Success */}

          {success && (
            <div className="success-message">
              ✓ {success}
            </div>
          )}


          {/* Submit */}

          <button
            type="submit"
            className="primary-button submit-button"
          >
            Submit Issue
          </button>

        </form>


        {/* AI Preview */}

        <div className="ai-preview">

          <h2>🤖 AI Issue Analysis</h2>

          <p>
            Our AI assistant will analyse your issue and
            suggest its category and priority.
          </p>

          <div className="ai-placeholder">

            <span>✨</span>

            <p>
              AI analysis will appear here after
              submitting your issue.
            </p>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );
}

export default ReportIssue;