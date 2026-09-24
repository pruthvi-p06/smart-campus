import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import ReportIssue from "./pages/student/ReportIssue"; 
import MyIssues from "./pages/student/MyIssues";
import IssueDetails from "./pages/student/IssueDetails";
import Resources from "./pages/student/Resources";
import Profile from "./pages/student/Profile";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AssignedIssues from "./pages/staff/AssignedIssues";
import StaffIssueDetails from "./pages/staff/StaffIssueDetails";
import StaffResources from "./pages/staff/StaffResources";
import StaffProfile from "./pages/staff/StaffProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Admin from "./pages/admin/Admin";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
        <Route
            path="/student/report-issue"
            element={<ReportIssue />}
        />
        <Route
            path="/student/issues"
            element={<MyIssues />}
        />
        <Route
            path="/student/issues/:id"
            element={<IssueDetails />}
        />
        <Route
            path="/student/resources"
            element={<Resources />}
        />
        <Route
            path="/student/profile"
            element={<Profile />}
        />
        <Route
            path="/staff/dashboard"
            element={<StaffDashboard />}
        />
        <Route
            path="/staff/issues"
            element={<AssignedIssues />}
        />
        <Route
            path="/staff/issues/:id"
            element={<StaffIssueDetails />}
        />
        <Route
            path="/staff/resources"
            element={<StaffResources />}
        />
        <Route
            path="/staff/profile"
            element={<StaffProfile />}
        />
        <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
        />
        <Route
            path="/admin/*"
            element={<Admin />}
        />
        


      </Routes>

    </BrowserRouter>
  );
}

export default App;