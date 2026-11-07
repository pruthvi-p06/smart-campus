import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, AlertCircle, ArrowRight, ArrowUpRight, BarChart3, Bell,
  Building2, CheckCircle2, ClipboardList, Clock3, RefreshCw, ShieldCheck,
  Users, Wrench
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import NotificationBell from "../../components/NotificationBell";
import { getAnalytics, getAdminIssues, getAdminUsers, getResources } from "../../services/api";

const normaliseList = (response, keys = []) => {
  for (const key of keys) if (Array.isArray(response?.[key])) return response[key];
  if (Array.isArray(response?.data)) return response.data;
  return Array.isArray(response) ? response : [];
};
const titleCase = (value = "Pending") => String(value).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function AdminDashboard() {
  const [analytics, setAnalytics] = useState({});
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    const results = await Promise.allSettled([getAnalytics(), getAdminIssues(), getAdminUsers(), getResources()]);
    const [analyticsResult, issuesResult, usersResult, resourcesResult] = results;
    if (analyticsResult.status === "fulfilled") setAnalytics(analyticsResult.value?.analytics || analyticsResult.value?.data || analyticsResult.value || {});
    if (issuesResult.status === "fulfilled") setIssues(normaliseList(issuesResult.value, ["issues"]));
    if (usersResult.status === "fulfilled") setUsers(normaliseList(usersResult.value, ["users"]));
    if (resourcesResult.status === "fulfilled") setResources(normaliseList(resourcesResult.value, ["resources"]));
    const failed = results.filter((result) => result.status === "rejected");
    if (failed.length) setError(`${failed.length} dashboard data source(s) could not be loaded. Check the backend connection and your admin permissions, then refresh.`);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const countByStatus = (status) => issues.filter((issue) => String(issue.status || "pending").toLowerCase().replace(/_/g, " ") === status).length;
  const total = analytics.totalIssues ?? analytics.total ?? issues.length;
  const pending = analytics.pendingIssues ?? analytics.pending ?? countByStatus("pending");
  const inProgress = analytics.inProgressIssues ?? analytics.inProgress ?? countByStatus("in progress");
  const resolved = analytics.resolvedIssues ?? analytics.resolved ?? countByStatus("resolved");
  const highPriority = issues.filter((issue) => String(issue.priority).toLowerCase() === "high" && !["resolved", "closed"].includes(String(issue.status).toLowerCase())).length;
  const statCards = [
    { label: "Total reported issues", value: total, note: "Across the campus", icon: ClipboardList, tone: "blue", to: "/admin/issues" },
    { label: "Awaiting action", value: pending, note: "Needs review or assignment", icon: Clock3, tone: "amber", to: "/admin/issues" },
    { label: "Work in progress", value: inProgress, note: "Currently being handled", icon: Wrench, tone: "violet", to: "/admin/issues" },
    { label: "Successfully resolved", value: resolved, note: "Completed requests", icon: CheckCircle2, tone: "green", to: "/admin/analytics" },
  ];
  const recentIssues = [...issues].sort((a, b) => new Date(b.reportedAt || b.createdAt || 0) - new Date(a.reportedAt || a.createdAt || 0)).slice(0, 6);
  const resolutionRate = Number(total) > 0 ? Math.round((Number(resolved) / Number(total)) * 100) : 0;

  const quickLinks = [
    { to: "/admin/issues", icon: ClipboardList, title: "Issue management", desc: "Review reports, set priority, assign staff and update outcomes.", tag: `${pending} waiting`, tone: "blue" },
    { to: "/admin/users", icon: Users, title: "People & permissions", desc: "Create accounts, update user details and activate or deactivate access.", tag: `${users.length} users`, tone: "violet" },
    { to: "/admin/resources", icon: Building2, title: "Campus resources", desc: "Maintain facilities, spaces and resource availability information.", tag: `${resources.length} resources`, tone: "green" },
    { to: "/admin/analytics", icon: BarChart3, title: "Reports & insights", desc: "Explore issue trends, performance metrics and AI-assisted insights.", tag: "View reports", tone: "amber" },
  ];

  return (
    <div className="dashboard-layout admin-console-layout">
      <AdminSidebar />
      <main className="main-content admin-console-main">
        <header className="top-navbar admin-console-navbar">
          <div><span className="admin-console-overline">SMARTCAMPUS / ADMINISTRATION</span><h2>Admin control room</h2></div>
          <div className="admin-console-nav-actions"><NotificationBell /><Link to="/admin/profile" className="admin-console-avatar" title="Open profile">{(user.name || "Admin").slice(0, 1).toUpperCase()}</Link></div>
        </header>

        <div className="page-content admin-console-content">
          <section className="admin-console-hero">
            <div className="admin-console-hero-copy">
              <span className="admin-console-live"><i /> CAMPUS OPERATIONS OVERVIEW</span>
              <h1>Good day, {user.name?.split(" ")[0] || "Administrator"}.</h1>
              <p>Here’s what’s happening across your campus. Review the queue, keep teams moving and make informed decisions.</p>
              <div className="admin-console-hero-actions"><Link to="/admin/issues" className="admin-console-primary">Review issue queue <ArrowRight size={17} /></Link><Link to="/admin/analytics" className="admin-console-secondary">Explore analytics <ArrowUpRight size={16} /></Link></div>
            </div>
            <div className="admin-console-hero-art"><div className="admin-console-orbit orbit-a"/><div className="admin-console-orbit orbit-b"/><div className="admin-console-shield"><ShieldCheck size={48}/><span>SC</span></div><div className="admin-console-art-chip chip-top"><Activity size={15}/> LIVE OVERVIEW</div><div className="admin-console-art-chip chip-bottom"><CheckCircle2 size={15}/> ROLE SECURED</div></div>
            <div className="admin-console-hero-foot"><span><ShieldCheck size={14}/> Administrator workspace</span><span><Activity size={14}/> {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Connecting to live data"}</span></div>
          </section>

          {error && <div className="admin-console-warning"><AlertCircle size={18}/><span>{error}</span><button onClick={loadDashboard}>Retry</button></div>}

          <section className="admin-console-section">
            <div className="admin-console-section-head"><div><span className="admin-console-section-kicker">AT A GLANCE</span><h2>Campus pulse</h2><p>Live totals from the administration APIs.</p></div><button className="admin-console-refresh" onClick={loadDashboard} disabled={loading}><RefreshCw size={15} className={loading ? "admin-spinning" : ""}/> {loading ? "Refreshing" : "Refresh data"}</button></div>
            <div className="admin-console-stats">{statCards.map((card) => { const Icon = card.icon; return <Link to={card.to} className={`admin-console-stat ${card.tone}`} key={card.label}><div className="admin-console-stat-top"><span>{card.label}</span><i><Icon size={19}/></i></div><strong>{loading ? "—" : Number(card.value || 0).toLocaleString("en-IN")}</strong><small>{card.note}</small><span className="admin-console-stat-arrow"><ArrowUpRight size={16}/></span></Link>; })}</div>
          </section>

          <div className="admin-console-mid-grid">
            <section className="admin-console-panel admin-console-queue-panel"><div className="admin-console-section-head compact"><div><span className="admin-console-section-kicker">ACTION REQUIRED</span><h2>Issue queue snapshot</h2></div><Link to="/admin/issues">Open queue <ArrowRight size={15}/></Link></div><div className="admin-console-queue-row"><div className="admin-console-queue-icon amber"><Clock3 size={18}/></div><div><b>{loading ? "—" : pending}</b><span>Awaiting action</span></div><small>Pending</small></div><div className="admin-console-queue-row"><div className="admin-console-queue-icon violet"><Wrench size={18}/></div><div><b>{loading ? "—" : inProgress}</b><span>Being worked on</span></div><small>In progress</small></div><div className="admin-console-queue-row"><div className="admin-console-queue-icon red"><AlertCircle size={18}/></div><div><b>{loading ? "—" : highPriority}</b><span>High priority open issues</span></div><small>Priority</small></div><div className="admin-console-resolution"><div><span>Resolution rate</span><b>{loading ? "—" : `${resolutionRate}%`}</b></div><div className="admin-console-progress"><span style={{ width: `${loading ? 0 : resolutionRate}%` }}/></div><small>Resolved issues compared with total reported issues</small></div></section>
            <section className="admin-console-panel admin-console-shortcuts"><div className="admin-console-section-head compact"><div><span className="admin-console-section-kicker">ADMIN TOOLS</span><h2>Workspace shortcuts</h2></div></div><div className="admin-console-shortcut-grid">{quickLinks.map((item) => { const Icon = item.icon; return <Link to={item.to} className={`admin-console-shortcut ${item.tone}`} key={item.to}><span className="admin-console-shortcut-icon"><Icon size={19}/></span><b>{item.title}</b><p>{item.desc}</p><small>{item.tag} <ArrowUpRight size={13}/></small></Link>; })}</div></section>
          </div>

          <section className="admin-console-panel admin-console-recent"><div className="admin-console-section-head compact"><div><span className="admin-console-section-kicker">LATEST CAMPUS REPORTS</span><h2>Recently reported issues</h2><p>Newest requests received by the campus support system.</p></div><Link to="/admin/issues">View all issues <ArrowRight size={15}/></Link></div><div className="admin-console-table-wrap"><table className="admin-console-table"><thead><tr><th>Issue</th><th>Location</th><th>Priority</th><th>Status</th><th>Reported</th><th /></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="admin-console-empty">Loading the latest reports…</td></tr> : recentIssues.length ? recentIssues.map((issue) => <tr key={issue._id || issue.id}><td><b>{issue.title || issue.issue || "Untitled issue"}</b><small>{issue.category || "General"}</small></td><td>{issue.location || "—"}</td><td><span className={`admin-console-priority ${(issue.priority || "medium").toLowerCase()}`}>{issue.priority || "Medium"}</span></td><td><span className={`admin-console-status ${String(issue.status || "pending").toLowerCase().replace(/\s+/g, "-")}`}>{titleCase(issue.status)}</span></td><td>{issue.reportedAt || issue.createdAt ? new Date(issue.reportedAt || issue.createdAt).toLocaleDateString() : "—"}</td><td><Link to={`/admin/issues/${issue._id || issue.id}`} className="admin-console-view">View <ArrowUpRight size={14}/></Link></td></tr>) : <tr><td colSpan="6" className="admin-console-empty">No issues have been reported yet.</td></tr>}</tbody></table></div></section>

          <footer className="admin-console-footer"><span><ShieldCheck size={15}/> SmartCampus administrator workspace</span><span>{users.length} users · {resources.length} campus resources</span><Link to="/admin/profile">Manage administrator profile <ArrowRight size={14}/></Link></footer>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
