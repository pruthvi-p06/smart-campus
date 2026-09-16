import DashboardLayout from "../../components/DashboardLayout";

function StudentDashboard() {
  return (
    <DashboardLayout>

      <div className="page-header">
        <div>
          <h1>Welcome back! 👋</h1>
          <p>Track and manage your campus issues.</p>
        </div>

        <button className="primary-button">
          + Report New Issue
        </button>
      </div>


      {/* KPI Cards */}

      <div className="kpi-grid">

        <div className="kpi-card">
          <p>Total Issues</p>
          <h2>12</h2>
        </div>

        <div className="kpi-card">
          <p>Pending</p>
          <h2>4</h2>
        </div>

        <div className="kpi-card">
          <p>In Progress</p>
          <h2>3</h2>
        </div>

        <div className="kpi-card">
          <p>Resolved</p>
          <h2>5</h2>
        </div>

      </div>


      {/* Recent Issues */}

      <div className="section-header">
        <h2>Recent Issues</h2>
        <button className="text-button">
          View All
        </button>
      </div>

      <div className="issues-table">

        <div className="table-header">
          <span>Issue</span>
          <span>Category</span>
          <span>Location</span>
          <span>Status</span>
        </div>

        <div className="table-row">
          <span>WiFi not working</span>
          <span>Network</span>
          <span>Lab 3</span>
          <span className="status pending">Pending</span>
        </div>

        <div className="table-row">
          <span>Broken Fan</span>
          <span>Electrical</span>
          <span>Block A</span>
          <span className="status progress">In Progress</span>
        </div>

        <div className="table-row">
          <span>Projector problem</span>
          <span>Classroom</span>
          <span>Room 205</span>
          <span className="status resolved">Resolved</span>
        </div>

      </div>

    </DashboardLayout>
  );
}

export default StudentDashboard;