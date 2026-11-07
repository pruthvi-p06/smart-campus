import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Bot, Building2,
  Check, CheckCircle2, ChevronDown, ClipboardList, Clock3, GraduationCap,
  MapPin, Menu, MessageCircle, ShieldCheck, Sparkles, Users, Wrench, X,
} from "lucide-react";
import { getPublicOverview } from "../services/api";

const roles = {
  student: {
    label: "Student", eyebrow: "STUDENT WORKSPACE", title: "Your campus, heard.",
    description: "Raise a concern in a few steps, add the location and evidence, then follow every update from one place.",
    actions: ["Report an issue", "Track a request", "Find campus resources"],
    stages: ["Submitted", "Under review", "Assigned", "Resolved"],
    icon: GraduationCap,
  },
  staff: {
    label: "Support team", eyebrow: "STAFF WORKSPACE", title: "The next task is clear.",
    description: "See assigned work, understand the reported problem and keep students informed as work progresses.",
    actions: ["View assigned issues", "Update progress", "Close completed work"],
    stages: ["New assignment", "Accepted", "In progress", "Completed"],
    icon: Wrench,
  },
  admin: {
    label: "Administrator", eyebrow: "ADMIN CONTROL ROOM", title: "See the whole picture.",
    description: "Review incoming requests, route work to the right team and use operational insights to spot bottlenecks.",
    actions: ["Review issue queue", "Assign support staff", "View analytics"],
    stages: ["Review queue", "Set priority", "Assign owner", "Monitor outcome"],
    icon: ShieldCheck,
  },
};

const zones = [
  { id: "learning", name: "Learning spaces", icon: GraduationCap, detail: "Classrooms, lecture halls and laboratories", route: "Facilities & equipment" },
  { id: "residence", name: "Student residences", icon: Building2, detail: "Hostels, common areas and washrooms", route: "Maintenance & housekeeping" },
  { id: "network", name: "Digital campus", icon: Activity, detail: "Wi-Fi, smart boards and campus systems", route: "IT & network support" },
  { id: "commons", name: "Shared spaces", icon: Users, detail: "Library, cafeteria and outdoor areas", route: "Campus services" },
];

const faqs = [
  { q: "How do I report a campus issue?", a: "Create a student account, open the issue reporting area, describe the problem and add its campus location. You can attach supporting evidence when the form allows it." },
  { q: "Can I follow the status of my request?", a: "Yes. Sign in and open your submitted issues to see the latest status and any updates shared by the support team." },
  { q: "Who can assign and resolve requests?", a: "Administrators review and assign requests. Staff members handle their assigned work and update its progress." },
];

function Count({ value, loading }) {
  return <>{loading ? <span className="sc-skeleton-count">&nbsp;</span> : Number.isFinite(Number(value)) ? Number(value).toLocaleString("en-IN") : "—"}</>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [overviewState, setOverviewState] = useState("loading");
  const [role, setRole] = useState("student");
  const [activeZone, setActiveZone] = useState("learning");
  const [activeFaq, setActiveFaq] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(1);

  const loadOverview = async () => {
    setOverviewState("loading");
    try {
      const response = await getPublicOverview();
      setOverview(response?.data || response);
      setOverviewState("ready");
    } catch (error) {
      console.error("Unable to load public campus overview:", error);
      setOverviewState("unavailable");
    }
  };
  useEffect(() => { loadOverview(); }, []);

  const selectedRole = roles[role];
  const SelectedRoleIcon = selectedRole.icon;
  const selectedZone = useMemo(() => zones.find((zone) => zone.id === activeZone) || zones[0], [activeZone]);
  const openChat = (prompt) => {
    window.dispatchEvent(new CustomEvent("smartcampus:open-chat", { detail: { prompt } }));
  };
  const metric = (key) => overviewState === "ready" ? overview?.[key] : null;

  return (
    <main className="scx-home" id="home">
      <header className="scx-header">
        <nav className="scx-nav">
          <a className="scx-brand" href="#home"><span className="scx-brand-mark"><Building2 size={20}/></span><span>smartcampus<span className="scx-brand-dot">.</span></span></a>
          <div className={`scx-nav-links ${menuOpen ? "is-open" : ""}`}>
            <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
            <a href="#ecosystem" onClick={() => setMenuOpen(false)}>Ecosystem</a>
            <a href="#campus-map" onClick={() => setMenuOpen(false)}>Campus zones</a>
            <button className="scx-nav-login" onClick={() => navigate("/login")}>Sign in</button><button className="scx-nav-login scx-admin-entry" onClick={() => navigate("/admin/login")}>Admin portal</button>
            <button className="scx-nav-cta" onClick={() => navigate("/register")}>Enter SmartCampus <ArrowUpRight size={16}/></button>
          </div>
          <button className="scx-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X/> : <Menu/>}</button>
        </nav>
      </header>

      <section className="scx-hero">
        <div className="scx-hero-noise"/><div className="scx-hero-glow scx-glow-one"/><div className="scx-hero-glow scx-glow-two"/>
        <div className="scx-hero-layout">
          <div className="scx-hero-copy">
            <div className="scx-eyebrow"><span className="scx-pulse"/> CAMPUS OPERATIONS, REIMAGINED <span className="scx-eyebrow-line"/></div>
            <h1>Make campus<br/>work <span>beautifully.</span></h1>
            <p className="scx-lede">A connected layer between the people who experience campus, the teams who keep it running and the decisions that make it better.</p>
            <div className="scx-hero-ctas"><button className="scx-button-primary" onClick={() => navigate("/register")}>Explore your workspace <ArrowUpRight size={18}/></button><button className="scx-button-quiet" onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}>See how it works <ArrowDownRight size={17}/></button></div>
            <div className="scx-trust-line"><span><ShieldCheck size={15}/> Role-aware workspaces</span><i/><span><Sparkles size={15}/> AI-assisted guidance</span><i/><span><Activity size={15}/> Connected workflows</span></div>
          </div>

          <div className="scx-command-wrap">
            <div className="scx-command-orbit orbit-one"/><div className="scx-command-orbit orbit-two"/>
            <div className="scx-command-window">
              <div className="scx-window-bar"><div className="scx-window-dots"><i/><i/><i/></div><span>SMARTCAMPUS / COMMAND CENTRE</span><span className="scx-window-status"><b/> SYSTEM PREVIEW</span></div>
              <div className="scx-window-content">
                <div className="scx-window-heading"><div><small>YOUR CAMPUS AT A GLANCE</small><h2>Good systems move people.</h2></div><span className="scx-window-avatar"><Building2 size={18}/></span></div>
                <div className="scx-kpi-row">
                  <div className="scx-kpi"><span className="scx-kpi-icon aqua"><ClipboardList size={16}/></span><strong><Count value={metric("totalIssues")} loading={overviewState === "loading"}/></strong><small>Issues recorded</small></div>
                  <div className="scx-kpi"><span className="scx-kpi-icon lime"><CheckCircle2 size={16}/></span><strong><Count value={metric("resolvedIssues")} loading={overviewState === "loading"}/></strong><small>Issues resolved</small></div>
                  <div className="scx-kpi"><span className="scx-kpi-icon violet"><Users size={16}/></span><strong><Count value={metric("activeStaff")} loading={overviewState === "loading"}/></strong><small>Active support staff</small></div>
                </div>
                <div className="scx-ops-panel">
                  <div className="scx-ops-top"><span>RESOLUTION OVERVIEW</span><button onClick={loadOverview} disabled={overviewState === "loading"}><Activity size={13}/> {overviewState === "loading" ? "Syncing" : "Sync data"}</button></div>
                  <div className="scx-ops-rate"><strong>{overviewState === "ready" ? `${overview?.resolutionRate ?? 0}%` : overviewState === "loading" ? "···" : "—"}</strong><span>overall resolution rate</span><div className="scx-ring" style={{ "--rate": `${overviewState === "ready" ? Math.max(0, Math.min(100, Number(overview?.resolutionRate) || 0)) : 0}%` }}><b>{overviewState === "ready" ? `${overview?.resolutionRate ?? 0}` : "—"}</b></div></div>
                  <div className="scx-ops-foot"><span><i/> {overviewState === "ready" ? "Connected to campus records" : overviewState === "loading" ? "Connecting to campus records" : "Live data unavailable"}</span><span>PUBLIC OVERVIEW API</span></div>
                </div>
                <div className="scx-window-bottom"><span className="scx-bottom-icon"><Bell size={15}/></span><span><b>One connected campus workflow</b><small>Report · Route · Resolve · Learn</small></span><ArrowUpRight size={17}/></div>
              </div>
            </div>
            <div className="scx-float-note scx-note-ai"><span><Bot size={17}/></span><div><b>Campus AI</b><small>Ask. Explore. Get unstuck.</small></div><i/></div>
            <div className="scx-float-note scx-note-track"><span><Clock3 size={17}/></span><div><b>Visible progress</b><small>From request to resolution</small></div></div>
            <div className="scx-coordinate">12°58' N &nbsp; 77°35' E <span>·</span> CAMPUS NETWORK</div>
          </div>
        </div>
        <div className="scx-hero-bottom"><span>ONE DIGITAL CAMPUS LAYER</span><div><span>PEOPLE</span><b>×</b><span>PLACES</span><b>×</b><span>PROGRESS</span></div><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section className="scx-experience" id="experience">
        <div className="scx-section-intro"><div><span className="scx-label">A WORKSPACE THAT CHANGES WITH YOU</span><h2>One campus.<br/><em>Three perspectives.</em></h2></div><p>Choose a role to explore how the same connected system supports different people and responsibilities.</p></div>
        <div className="scx-role-shell">
          <div className="scx-role-tabs" role="tablist" aria-label="Choose a workspace">{Object.entries(roles).map(([key, item]) => <button key={key} role="tab" aria-selected={role === key} className={role === key ? "active" : ""} onClick={() => { setRole(key); setActiveStage(1); }}><item.icon size={17}/>{item.label}<ArrowUpRight size={14}/></button>)}</div>
          <div className="scx-role-content">
            <div className="scx-role-copy"><span className="scx-role-eyebrow"><SelectedRoleIcon size={15}/> {selectedRole.eyebrow}</span><h3>{selectedRole.title}</h3><p>{selectedRole.description}</p><div className="scx-role-actions">{selectedRole.actions.map((action, index) => <span key={action}><b>0{index + 1}</b>{action}</span>)}</div><button className="scx-text-link" onClick={() => navigate(role === "student" ? "/register" : role === "admin" ? "/admin/create-account" : "/login")}>{role === "student" ? "Create your account" : role === "admin" ? "Create an administrator account" : "Sign in to your workspace"}<ArrowRight size={16}/></button></div>
            <div className="scx-flow-demo"><div className="scx-flow-head"><span>WORKFLOW EXPLORER</span><span>INTERACTIVE PREVIEW</span></div><div className="scx-flow-track">{selectedRole.stages.map((stage, index) => <button key={`${role}-${stage}`} className={`${index < activeStage ? "done" : ""} ${index === activeStage ? "current" : ""}`} onClick={() => setActiveStage(index)}><span>{index < activeStage ? <Check size={14}/> : `0${index + 1}`}</span><small>{stage}</small></button>)}</div><div className="scx-flow-detail"><div className="scx-flow-detail-icon"><Activity size={19}/></div><div><small>STEP 0{activeStage + 1} / 04</small><b>{selectedRole.stages[activeStage]}</b><p>{activeStage === 0 ? "A request enters the workflow with the details needed to understand it." : activeStage === 1 ? "The request is reviewed and its next action becomes visible." : activeStage === 2 ? "Responsibility is clear and progress can be followed." : "The outcome is recorded so the requester can see what changed."}</p></div></div><div className="scx-flow-controls"><button disabled={activeStage === 0} onClick={() => setActiveStage((v) => Math.max(0, v - 1))}>Previous</button><button onClick={() => setActiveStage((v) => (v + 1) % 4)}>{activeStage === 3 ? "Replay workflow" : "Next step"}<ArrowRight size={14}/></button></div></div>
          </div>
        </div>
      </section>

      <section className="scx-ecosystem" id="ecosystem">
        <div className="scx-ecosystem-head"><div><span className="scx-label">THE SMARTCAMPUS ECOSYSTEM</span><h2>Not another notice board.<br/><em>A system that moves work.</em></h2></div><p>Bring the complete support journey into view: understand a need, connect it to the right people, and make progress visible.</p></div>
        <div className="scx-ecosystem-stage">
          <div className="scx-ecosystem-center"><div className="scx-center-rings"><span/><span/><span/><div><Building2 size={30}/><b>SC</b></div></div><strong>SMARTCAMPUS</strong><small>CONNECTED OPERATIONS</small></div>
          <div className="scx-eco-node node-report"><span><ClipboardList size={19}/></span><b>Issue reporting</b><small>Capture the context</small></div>
          <div className="scx-eco-node node-route"><span><Users size={19}/></span><b>Team routing</b><small>Connect the right people</small></div>
          <div className="scx-eco-node node-track"><span><Activity size={19}/></span><b>Progress tracking</b><small>Keep every step visible</small></div>
          <div className="scx-eco-node node-insight"><span><Sparkles size={19}/></span><b>AI & insights</b><small>Turn activity into direction</small></div>
          <svg className="scx-eco-lines" viewBox="0 0 900 430" preserveAspectRatio="none" aria-hidden="true"><path d="M450 215 C310 215 260 75 145 75"/><path d="M450 215 C590 215 640 75 755 75"/><path d="M450 215 C310 215 260 355 145 355"/><path d="M450 215 C590 215 640 355 755 355"/></svg>
        </div>
      </section>

      <section className="scx-zones" id="campus-map">
        <div className="scx-section-intro"><div><span className="scx-label">CAMPUS, AS A CONNECTED PLACE</span><h2>Every corner has<br/><em>a support pathway.</em></h2></div><p>Explore campus zones to see how different spaces can connect to the right support workflow.</p></div>
        <div className="scx-zone-layout">
          <div className="scx-campus-map" aria-label="Illustrative campus zone selector"><div className="scx-map-topline"><span><MapPin size={14}/> CAMPUS ZONE EXPLORER</span><span>ILLUSTRATIVE VIEW</span></div><div className="scx-map-grid"><div className="scx-map-road road-h"/><div className="scx-map-road road-v"/><div className="scx-map-green green-a"/><div className="scx-map-green green-b"/><div className="scx-map-building building-a"><span>01</span><b>ACADEMIC<br/>BLOCK</b></div><div className="scx-map-building building-b"><span>02</span><b>STUDENT<br/>RESIDENCE</b></div><div className="scx-map-building building-c"><span>03</span><b>LIBRARY &<br/>COMMONS</b></div><div className="scx-map-building building-d"><span>04</span><b>DIGITAL<br/>SERVICES</b></div>{zones.map((zone, index) => <button key={zone.id} className={`scx-map-pin pin-${index} ${activeZone === zone.id ? "selected" : ""}`} onClick={() => setActiveZone(zone.id)} aria-label={`Explore ${zone.name}`}><span>{index + 1}</span><i/></button>)}</div><div className="scx-map-legend"><span><i className="legend-active"/> Selected zone</span><span><i/> Explore a marker</span><span>Concept map · not live GPS</span></div></div>
          <aside className="scx-zone-info"><span className="scx-label">SELECTED CAMPUS ZONE</span><div className="scx-zone-icon"><selectedZone.icon size={24}/></div><small>ZONE 0{zones.findIndex((z) => z.id === activeZone) + 1}</small><h3>{selectedZone.name}</h3><p>{selectedZone.detail}</p><div className="scx-zone-route"><span>SUPPORT PATHWAY</span><b>{selectedZone.route}</b></div><button onClick={() => navigate("/login")}>Access campus support <ArrowUpRight size={16}/></button><div className="scx-zone-selector">{zones.map((zone) => <button key={zone.id} className={activeZone === zone.id ? "active" : ""} onClick={() => setActiveZone(zone.id)}>{zone.name}<ArrowRight size={14}/></button>)}</div></aside>
        </div>
      </section>

      <section className="scx-assistant">
        <div className="scx-assistant-orb"><div className="scx-assistant-core"><Bot size={39}/><Sparkles size={17}/></div><i/><i/><i/></div>
        <div className="scx-assistant-copy"><span className="scx-label">A LITTLE HELP, RIGHT WHEN YOU NEED IT</span><h2>Ask the campus.<br/><em>Don't search for answers.</em></h2><p>Use the SmartCampus assistant to understand the platform, get reporting guidance and find the next step without digging through menus.</p><div className="scx-prompt-chips"><button onClick={() => openChat("How do I report a campus issue?")}>How do I report an issue? <ArrowUpRight size={13}/></button><button onClick={() => openChat("How can I track my complaint?")}>Track my complaint <ArrowUpRight size={13}/></button><button onClick={() => openChat("What can the campus assistant help me with?")}>What can you help with? <ArrowUpRight size={13}/></button></div></div>
        <button className="scx-assistant-launch" onClick={() => openChat()}>Open AI assistant <MessageCircle size={17}/></button>
      </section>

      <section className="scx-faq">
        <div><span className="scx-label">GOOD TO KNOW</span><h2>Questions, meet<br/><em>clear answers.</em></h2><p>Quick guidance for the most common campus support tasks.</p></div>
        <div className="scx-faq-list">{faqs.map((faq, index) => <article className={activeFaq === index ? "active" : ""} key={faq.q}><button onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}><span>{faq.q}</span><ChevronDown size={18}/></button>{activeFaq === index && <p>{faq.a}</p>}</article>)}</div>
      </section>

      <section className="scx-final-cta"><div className="scx-final-grid"/><span className="scx-label">MAKE THE NEXT CAMPUS IMPROVEMENT COUNT</span><h2>Better campus days<br/>start with <em>one connection.</em></h2><p>Bring your campus community into one shared support experience.</p><div><button onClick={() => navigate("/register")}>Get started <ArrowUpRight size={17}/></button><button onClick={() => navigate("/login")}>I already have an account <ArrowRight size={16}/></button></div></section>

      <footer className="scx-footer"><a className="scx-brand" href="#home"><span className="scx-brand-mark"><Building2 size={19}/></span><span>smartcampus<span className="scx-brand-dot">.</span></span></a><p>Connected people. Clearer processes. Better campus experiences.</p><div><a href="#experience">Experience</a><a href="#ecosystem">Ecosystem</a><button onClick={() => navigate("/login")}>Sign in</button><button onClick={() => navigate("/admin/login")}>Admin portal</button></div><small>© {new Date().getFullYear()} SmartCampus · Issue & Resource Management</small></footer>
    </main>
  );
}
