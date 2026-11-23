import { useState, useEffect } from "react";
import { Sparkles, Check, RefreshCw } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { createIssue, analyzeIssue } from "../../services/api";

function ReportIssue() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    department: "",
    priority: "Medium",
    description: "",
    image: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);

  // Auto-dismiss feedback notifications
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      setSuccess("");
    }, 4500);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError("");
    }, 6000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleAiAnalyze = async () => {
    const textToAnalyze = (formData.title + " " + formData.description).trim();
    if (textToAnalyze.length < 5) {
      setError("Please enter a title or description before running AI analysis.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError("");
      const result = await analyzeIssue({ description: textToAnalyze });
      if (result) {
        setAiAnalysis(result);
        setAiApplied(false);
      }
    } catch (err) {
      console.error("AI issue analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAi = () => {
    if (!aiAnalysis) return;
    setFormData((prev) => ({
      ...prev,
      category: aiAnalysis.category || prev.category,
      priority: aiAnalysis.priority || prev.priority,
    }));
    setAiApplied(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (success) setSuccess("");
    if (error) setError("");

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    if (success) setSuccess("");
    if (error) setError("");

    setFormData({
      ...formData,
      image: e.target.files[0] || null
    });
  };

  const handleSubmit = async (e) => {
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

    try {
      setLoading(true);

      const issueData = new FormData();

      issueData.append("title", formData.title.trim());
      issueData.append("category", formData.category);
      issueData.append("location", formData.location);
      issueData.append("department", formData.department);
      issueData.append("priority", formData.priority);
      issueData.append("description", formData.description.trim());

      if (formData.image) {
        issueData.append("image", formData.image);
      }

      await createIssue(issueData);

      setSuccess("Issue submitted successfully!");
      setAiAnalysis(null);
      setAiApplied(false);

      setFormData({
        title: "",
        category: "",
        location: "",
        department: "",
        priority: "Medium",
        description: "",
        image: null
      });

      // Reset file input
      const fileInput = document.getElementById("image");
      if (fileInput) {
        fileInput.value = "";
      }

    } catch (err) {
      setError(err.message || "Failed to submit issue. Please try again.");
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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

          {/* Priority */}
          <div className="form-group">

            <label htmlFor="priority">
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
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
              disabled={loading}
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
              disabled={loading}
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
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Issue"}
          </button>

        </form>

        {/* AI Preview */}
        <div className="ai-preview">
          <div className="ai-preview-header">
            <span className="ai-badge"><Sparkles size={13} /> AI ASSISTANT</span>
            <h2>Smart Issue Analysis</h2>
          </div>

          <p>
            Our campus AI analyzes your issue text to predict the proper category, priority level, and dispatch route.
          </p>

          {isAnalyzing ? (
            <div className="ai-placeholder is-analyzing">
              <span className="ai-spin"><RefreshCw size={24} /></span>
              <p>Analyzing issue details...</p>
            </div>
          ) : aiAnalysis ? (
            <div className="ai-analysis-card">
              <div className="ai-analysis-row">
                <span className="ai-label">Suggested Category</span>
                <strong className="ai-tag">{aiAnalysis.category}</strong>
              </div>

              <div className="ai-analysis-row">
                <span className="ai-label">Recommended Priority</span>
                <strong className={`ai-priority-badge priority-${(aiAnalysis.priority || "medium").toLowerCase()}`}>
                  {aiAnalysis.priority}
                </strong>
              </div>

              {aiAnalysis.reason && (
                <div className="ai-reason-box">
                  <small>Assessment Reason:</small>
                  <p>{aiAnalysis.reason}</p>
                </div>
              )}

              <button
                type="button"
                className={`ai-apply-btn ${aiApplied ? "applied" : ""}`}
                onClick={handleApplyAi}
                disabled={aiApplied}
              >
                {aiApplied ? <><Check size={15} /> Applied to Form</> : <><Sparkles size={15} /> Apply to Form</>}
              </button>
            </div>
          ) : (
            <div className="ai-placeholder">
              <span className="ai-spark-icon"><Sparkles size={26} /></span>
              <p>
                {formData.title || formData.description
                  ? "Ready to analyze your issue description."
                  : "Type your issue title or description to analyze category and priority."}
              </p>
              {(formData.title.trim().length > 2 || formData.description.trim().length > 3) && (
                <button
                  type="button"
                  className="ai-trigger-btn"
                  onClick={handleAiAnalyze}
                >
                  <Sparkles size={14} /> Analyze with AI
                </button>
              )}
            </div>
          )}
        </div>

      </div>

    </DashboardLayout>
  );
}

export default ReportIssue;