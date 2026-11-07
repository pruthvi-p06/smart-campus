import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, LockKeyhole, Activity, Users, ClipboardCheck } from "lucide-react";
import { loginUser } from "../../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your administrator email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({ email: email.trim(), password });
      if (response?.user?.role !== "admin") {
        setError("This account does not have administrator access. Use the student or staff sign-in instead.");
        return;
      }
      if (!response?.token) throw new Error("The server did not return an authentication token.");
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-orb admin-auth-orb-one" />
      <div className="admin-auth-orb admin-auth-orb-two" />
      <Link className="admin-auth-back" to="/"><ArrowLeft size={17} /> Back to SmartCampus</Link>
      <section className="admin-auth-shell">
        <div className="admin-auth-story">
          <div className="admin-auth-brand"><span><ShieldCheck size={23} /></span> SmartCampus <b>ADMIN</b></div>
          <div className="admin-auth-story-copy">
            <span className="admin-auth-eyebrow"><i /> SECURE ADMINISTRATOR ACCESS</span>
            <h1>Lead campus operations with <em>clarity.</em></h1>
            <p>Your command centre for issue resolution, people, resources and campus-wide performance.</p>
          </div>
          <div className="admin-auth-benefits">
            <div><ClipboardCheck size={19} /><span><b>Issue oversight</b><small>Review, prioritize and assign requests</small></span></div>
            <div><Users size={19} /><span><b>People & teams</b><small>Manage student and staff accounts</small></span></div>
            <div><Activity size={19} /><span><b>Operational insights</b><small>Track trends and resolution progress</small></span></div>
          </div>
          <div className="admin-auth-footnote"><LockKeyhole size={14} /> Create an administrator account directly through the website.</div>
        </div>

        <div className="admin-auth-form-panel">
          <div className="admin-auth-form-heading">
            <span className="admin-auth-icon"><ShieldCheck size={23} /></span>
            <span className="admin-auth-kicker">ADMIN CONTROL ROOM</span>
            <h2>Welcome back</h2>
            <p>Sign in with your administrator credentials to continue.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="admin-auth-label" htmlFor="admin-email">Administrator email</label>
            <input id="admin-email" className="admin-auth-input" type="email" autoComplete="username" placeholder="admin@yourcampus.edu" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            <label className="admin-auth-label" htmlFor="admin-password">Password</label>
            <div className="admin-auth-password-wrap">
              <input id="admin-password" className="admin-auth-input" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            {error && <div className="admin-auth-error" role="alert">{error}</div>}
            <button className="admin-auth-submit" type="submit" disabled={loading}>{loading ? "Verifying access…" : "Enter admin workspace"}<span>→</span></button>
          </form>
          <div className="admin-auth-divider"><span /> SECURE ROLE-BASED ACCESS <span /></div>
          <p className="admin-auth-switch">New administrator? <Link to="/admin/create-account">Create an account</Link></p>
          <p className="admin-auth-switch" style={{ marginTop: 12 }}>Not an administrator? <Link to="/login">Go to student / staff login</Link></p>
        </div>
      </section>
      <p className="admin-auth-copyright">© {new Date().getFullYear()} SmartCampus · Campus Issue & Resource Management</p>
    </main>
  );
}
