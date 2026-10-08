import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

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

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* STUDENT ROUTES */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/report-issue"
          element={
            <ProtectedRoute allowedRole="student">
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/issues"
          element={
            <ProtectedRoute allowedRole="student">
              <MyIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/issues/:id"
          element={
            <ProtectedRoute allowedRole="student">
              <IssueDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/resources"
          element={
            <ProtectedRoute allowedRole="student">
              <Resources />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole="student">
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* STAFF ROUTES */}

        <Route
          path="/staff"
          element={
            <Navigate
              to="/staff/dashboard"
              replace
            />
          }
        />

        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/issues"
          element={
            <ProtectedRoute allowedRole="staff">
              <AssignedIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/issues/:id"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffIssueDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/resources"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffResources />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/profile"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffProfile />
            </ProtectedRoute>
          }
        />


        {/* ADMIN ROUTES */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />


        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;