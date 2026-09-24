import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="landing-logo">
          <span className="logo-icon">🏫</span>
          <span>SmartCampus</span>
        </div>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>

          <button
            className="nav-login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            ✨ Smart Campus Management
          </div>

          <h1>
            Smarter Campus.
            <br />
            <span>Better Management.</span>
          </h1>

          <p>
            A centralized platform to report, track and resolve
            campus issues while managing resources efficiently.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Get Started →
            </button>

            <a
              href="#features"
              className="secondary-btn"
            >
              Explore Features
            </a>

          </div>

        </div>

        {/* HERO GLASS CARD */}

        <div className="hero-card glass-card">

          <div className="hero-card-header">
            <span>Campus Overview</span>
            <span className="status-dot">● Live</span>
          </div>

          <div className="hero-stats">

            <div>
              <span className="stat-number">24</span>
              <span className="stat-label">
                Total Issues
              </span>
            </div>

            <div>
              <span className="stat-number">11</span>
              <span className="stat-label">
                Resolved
              </span>
            </div>

            <div>
              <span className="stat-number">6</span>
              <span className="stat-label">
                Active Staff
              </span>
            </div>

          </div>

          <div className="mini-progress">
            <div className="progress-label">
              <span>Resolution Progress</span>
              <span>46%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span className="section-tag">
            FEATURES
          </span>

          <h2>
            Everything needed for a
            <span> smarter campus</span>
          </h2>

          <p>
            SmartCampus connects students, staff and administrators
            through one centralized platform.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card glass-card">
            <div className="feature-icon">📢</div>
            <h3>Report Issues</h3>
            <p>
              Students can easily report classroom,
              network, electrical and other campus issues.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon">📍</div>
            <h3>Track Progress</h3>
            <p>
              Track reported issues from submission
              through assignment and resolution.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistance</h3>
            <p>
              AI-assisted classification and priority
              suggestions help improve issue management.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>
              Administrators can analyse campus issues
              using dashboards, charts and KPIs.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon">👥</div>
            <h3>Role Management</h3>
            <p>
              Separate interfaces for students, staff
              and administrators.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon">🏫</div>
            <h3>Resource Management</h3>
            <p>
              Manage and view campus facilities and
              available resources.
            </p>
          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span className="section-tag">
            HOW IT WORKS
          </span>

          <h2>
            Simple. Transparent.
            <span> Efficient.</span>
          </h2>

        </div>

        <div className="steps-container">

          <div className="step-card glass-card">
            <div className="step-number">01</div>
            <h3>Report</h3>
            <p>
              Students report a campus issue with
              category, location and description.
            </p>
          </div>

          <div className="step-card glass-card">
            <div className="step-number">02</div>
            <h3>Assign</h3>
            <p>
              Administrators assign the issue to
              the appropriate campus staff.
            </p>
          </div>

          <div className="step-card glass-card">
            <div className="step-number">03</div>
            <h3>Resolve</h3>
            <p>
              Staff work on the issue and update
              its progress until resolution.
            </p>
          </div>

          <div className="step-card glass-card">
            <div className="step-number">04</div>
            <h3>Analyse</h3>
            <p>
              Administrators use analytics and AI
              insights to identify recurring problems.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="cta-section" id="about">

        <div className="cta-card glass-card">

          <h2>
            Make your campus
            <span> smarter.</span>
          </h2>

          <p>
            Bring issue management, resources and
            analytics together in one platform.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/login")}
          >
            Get Started →
          </button>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="landing-footer">

        <div>
          🏫 <strong>SmartCampus</strong>
        </div>

        <p>
          Smart Campus Issue & Resource Management System
        </p>

        <span>
          © 2026 SmartCampus
        </span>

      </footer>

    </div>
  );
}

export default LandingPage;