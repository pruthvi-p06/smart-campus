const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ==================== AUTH ====================

export const registerUser = (userData) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const loginUser = (credentials) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const getCurrentUser = () =>
  request("/auth/me");

// ==================== ISSUES ====================

export const createIssue = (issueData) =>
  request("/issues", {
    method: "POST",
    body:
      issueData instanceof FormData
        ? issueData
        : JSON.stringify(issueData),
  });

export const getMyIssues = () =>
  request("/issues/my");

export const getIssue = (id) =>
  request(`/issues/${id}`);

export const updateIssueStatus = (id, statusData) =>
  request(`/issues/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(statusData),
  });

// ==================== STAFF ====================

export const getStaffIssues = () =>
  request("/staff/issues");

export const getStaffIssue = (id) =>
  request(`/staff/issues/${id}`);

// ==================== ADMIN - ISSUES ====================

export const getAdminIssues = () =>
  request("/admin/issues");

export const getAdminIssue = (id) =>
  request(`/admin/issues/${id}`);

export const updateAdminIssue = (id, issueData) =>
  request(`/admin/issues/${id}`, {
    method: "PUT",
    body: JSON.stringify(issueData),
  });

// ==================== ADMIN - USERS ====================

export const getAdminUsers = () =>
  request("/admin/users");

export const createAdminUser = (userData) =>
  request("/admin/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const updateAdminUser = (id, userData) =>
  request(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });

export const updateAdminUserStatus = (id, statusData) =>
  request(`/admin/users/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(statusData),
  });

// ==================== RESOURCES ====================

export const getResources = () =>
  request("/resources");

export const createResource = (resourceData) =>
  request("/resources", {
    method: "POST",
    body: JSON.stringify(resourceData),
  });

export const updateResource = (id, resourceData) =>
  request(`/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(resourceData),
  });

export const deleteResource = (id) =>
  request(`/resources/${id}`, {
    method: "DELETE",
  });

// ==================== PROFILE ====================

export const getProfile = () =>
  request("/profile");

export const updateProfile = (profileData) =>
  request("/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });

// ==================== ANALYTICS ====================

export const getAnalytics = () =>
  request("/admin/analytics");

export const generateInsights = (data = {}) =>
  request("/admin/insights", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ==================== AI ====================

export const analyzeIssue = (issueData) =>
  request("/ai/analyze-issue", {
    method: "POST",
    body: JSON.stringify(issueData),
  });

export const getAIInsights = (data = {}) =>
  request("/ai/insights", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ==================== NOTIFICATIONS ====================

export const getNotifications = () =>
  request("/notifications");

export const markNotificationRead = (id) =>
  request(`/notifications/${id}/read`, {
    method: "PUT",
  });

export const markAllNotificationsRead = () =>
  request("/notifications/read-all", {
    method: "PUT",
  });