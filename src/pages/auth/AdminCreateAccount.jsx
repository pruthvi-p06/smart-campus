import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, UserPlus } from "lucide-react";
import { registerUser } from "../../services/api";

export default function AdminCreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must contain at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("The passwords do not match.");
    try {
      setLoading(true);
      await registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password, role: "admin" });
      navigate("/admin/login", { replace: true, state: { registered: true } });
    } catch (err) {
      setError(err.message || "Unable to create the administrator account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-orb admin-auth-orb-one" /><div className="admin-auth-orb admin-auth-orb-two" />
      <Link className="admin-auth-back" to="/admin/login"><ArrowLeft size={17}/> Back to admin sign in</Link>
      <section className="admin-auth-shell">
        <div className="admin-auth-story">
          <div className="admin-auth-brand"><span><ShieldCheck size={23}/></span> SmartCampus <b>ADMIN</b></div>
          <div className="admin-auth-story-copy"><span className="admin-auth-eyebrow"><i/> ADMINISTRATOR REGISTRATION</span><h1>Create your campus <em>command centre.</em></h1><p>Register your administrator account through the website, just like student and staff accounts.</p></div>
          <div className="admin-auth-benefits"><div><UserPlus size={19}/><span><b>Website registration</b><small>Enter your details and create your own account.</small></span></div><div><ShieldCheck size={19}/><span><b>Administrator workspace</b><small>Sign in to manage issues, users and campus resources.</small></span></div></div>
          <div className="admin-auth-footnote">Use a strong password and keep your login credentials private.</div>
        </div>
        <div className="admin-auth-form-panel">
          <div className="admin-auth-form-heading"><span className="admin-auth-icon"><UserPlus size={23}/></span><span className="admin-auth-kicker">NEW ADMINISTRATOR</span><h2>Create administrator account</h2><p>Fill in your details to register.</p></div>
          <form onSubmit={handleSubmit}>
            <label className="admin-auth-label" htmlFor="admin-register-name">Full name</label><input id="admin-register-name" className="admin-auth-input" value={form.name} onChange={update("name")} placeholder="Enter your full name" required disabled={loading}/>
            <label className="admin-auth-label" htmlFor="admin-register-email">Administrator email</label><input id="admin-register-email" className="admin-auth-input" type="email" autoComplete="email" value={form.email} onChange={update("email")} placeholder="Enter your email" required disabled={loading}/>
            <label className="admin-auth-label" htmlFor="admin-register-password">Create password</label><div className="admin-auth-password-wrap"><input id="admin-register-password" className="admin-auth-input" type={showPassword ? "text" : "password"} minLength={6} autoComplete="new-password" value={form.password} onChange={update("password")} placeholder="At least 6 characters" required disabled={loading}/><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((v) => !v)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
            <label className="admin-auth-label" htmlFor="admin-register-confirm">Confirm password</label><input id="admin-register-confirm" className="admin-auth-input" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Re-enter your password" required disabled={loading}/>
            {error && <div className="admin-auth-error" role="alert">{error}</div>}
            <button className="admin-auth-submit" type="submit" disabled={loading}>{loading ? "Creating account…" : "Create admin account"}<span>→</span></button>
          </form>
          <div className="admin-auth-divider"><span/> WEBSITE ACCOUNT REGISTRATION <span/></div><p className="admin-auth-switch">Already have an admin account? <Link to="/admin/login">Sign in</Link></p>
        </div>
      </section>
      <p className="admin-auth-copyright">© {new Date().getFullYear()} SmartCampus · Campus Issue & Resource Management</p>
    </main>
  );
}
