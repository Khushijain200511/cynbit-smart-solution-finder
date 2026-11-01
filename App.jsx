import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const services = [
  { id: "ai-automation", icon: "✦", title: "AI & Automation", desc: "Automate repetitive work and make workflows smarter." },
  { id: "web-development", icon: "⌘", title: "Web Development", desc: "Create responsive websites and custom applications." },
  { id: "cloud-devops", icon: "☁", title: "Cloud & DevOps", desc: "Build scalable infrastructure and deployment workflows." },
  { id: "data-analytics", icon: "▥", title: "Data Analytics", desc: "Turn business data into meaningful insights." },
  { id: "cybersecurity", icon: "◇", title: "Cybersecurity", desc: "Identify risks and strengthen digital protection." },
  { id: "digital-marketing", icon: "↗", title: "Digital Marketing", desc: "Improve online visibility and reach your audience." },
  { id: "not-sure", icon: "?", title: "I'm not sure", desc: "Help me understand which solution I need." },
];

const initialForm = {
  requirement: "",
  project_size: "small",
  budget: "not-decided",
  timeline: "flexible",
  full_name: "",
  email: "",
  company: "",
  project_description: "",
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  async function findSolution(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirement: form.requirement,
          project_size: form.project_size,
          budget: form.budget,
          timeline: form.timeline,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not get recommendation.");
      setRecommendation(data.recommendation);
      setStep(3);
    } catch (err) {
      setError(`${err.message}. Please check that the backend is running.`);
    } finally {
      setLoading(false);
    }
  }

  async function submitInquiry(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          recommended_service: recommendation.service,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not submit inquiry.");
      setSuccess(`Your inquiry has been saved. Reference: ${data.inquiry_id}`);
      setStep(4);
    } catch (err) {
      setError(`${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setForm(initialForm);
    setRecommendation(null);
    setError("");
    setSuccess("");
    setStep(1);
  }

  return (
    <div className="app-shell">
      <header className="nav">
        <a className="brand" href="#home" aria-label="Cynbit home">
          <span className="brand-mark">C</span>
          <span>CYN<span className="brand-accent">BIT</span><small>TECHNOLOGY SOLUTIONS</small></span>
        </a>
        <nav><a href="#services">Services</a><a href="#finder">Solution Finder</a><a href="#about">About</a></nav>
        <a className="nav-cta" href="#finder">Get started <span>↗</span></a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse" /> SMARTER TECHNOLOGY STARTS HERE</div>
            <h1>Find the right solution for <em>what's next.</em></h1>
            <p>Every business has a different challenge. Tell us what you're working towards and discover a technology direction that fits.</p>
            <a className="button primary" href="#finder">Find my solution <span>→</span></a>
            <div className="hero-note"><span>✓</span> A few simple questions · A clearer next step</div>
          </div>
          <div className="hero-art" aria-label="Connected technology solutions illustration">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="art-core"><span>c</span><small>IDEAS INTO IMPACT</small></div>
            <div className="float-card card-ai"><b>✦</b><span>AI & Automation</span></div>
            <div className="float-card card-cloud"><b>☁</b><span>Cloud solutions</span></div>
            <div className="float-card card-web"><b>⌘</b><span>Web development</span></div>
          </div>
        </section>

        <section className="services section" id="services">
          <div className="section-intro"><div className="eyebrow">WHAT WE CAN HELP WITH</div><h2>Technology, made purposeful.</h2><p>Explore common areas where the right digital solution can move your business forward.</p></div>
          <div className="service-grid">
            {services.slice(0, 6).map((service) => (
              <article className="service-card" key={service.id}>
                <div className="service-icon">{service.icon}</div><h3>{service.title}</h3><p>{service.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="finder section" id="finder">
          <div className="section-intro"><div className="eyebrow">YOUR NEXT STEP STARTS HERE</div><h2>Let's find your fit.</h2><p>Answer a few questions to get a relevant service recommendation.</p></div>
          <div className="finder-panel">
            <div className="progress">
              {["Your need", "Project details", "Your match"].map((label, i) => (
                <div className={step >= i + 1 ? "progress-item active" : "progress-item"} key={label}><span>{`0${i + 1}`}</span>{label}</div>
              ))}
            </div>
            {error && <div className="alert error" role="alert">{error}</div>}
            {step === 1 && <form onSubmit={(e) => { e.preventDefault(); setError(""); setStep(2); }}>
              <div className="form-heading"><span>STEP 01</span><h3>What would you like help with?</h3><p>Choose the area that best describes your current goal.</p></div>
              <div className="choice-grid">
                {services.map((service) => <button type="button" key={service.id} className={`choice ${form.requirement === service.id ? "chosen" : ""}`} onClick={() => update("requirement", service.id)}><span className="choice-icon">{service.icon}</span><span className="choice-text"><b>{service.title}</b><small>{service.desc}</small></span><span className="radio">{form.requirement === service.id ? "✓" : ""}</span></button>)}
              </div>
              <div className="actions end"><button className="button primary" disabled={!form.requirement}>Continue <span>→</span></button></div>
            </form>}

            {step === 2 && <form onSubmit={findSolution}>
              <div className="form-heading"><span>STEP 02</span><h3>A little more about your project.</h3><p>This helps us put your requirement in context.</p></div>
              <div className="fields">
                <label>Business size<select value={form.project_size} onChange={(e) => update("project_size", e.target.value)}><option value="small">Small business / Startup</option><option value="medium">Medium business</option><option value="large">Large enterprise</option></select></label>
                <label>Estimated budget<select value={form.budget} onChange={(e) => update("budget", e.target.value)}><option value="not-decided">Not decided yet</option><option value="under-1000">Under ₹1 lakh</option><option value="1000-5000">₹1–5 lakh</option><option value="5000-10000">₹5–10 lakh</option><option value="above-10000">Above ₹10 lakh</option></select></label>
                <label className="wide">Expected timeline<select value={form.timeline} onChange={(e) => update("timeline", e.target.value)}><option value="flexible">Flexible / Need guidance</option><option value="less-than-1-month">Less than 1 month</option><option value="1-3-months">1–3 months</option><option value="3-6-months">3–6 months</option></select></label>
              </div>
              <div className="actions"><button type="button" className="button secondary" onClick={() => setStep(1)}>← Back</button><button className="button primary" disabled={loading}>{loading ? "Finding your match..." : "Find my solution →"}</button></div>
            </form>}

            {step === 3 && recommendation && <div>
              <div className="recommendation-tag">✦ YOUR SUGGESTED DIRECTION</div>
              <div className="match-card"><div className="match-icon">✦</div><div><h3>{recommendation.service}</h3><p>{recommendation.description}</p></div></div>
              <h4 className="benefit-title">How this could help</h4>
              <ul className="benefits">{recommendation.benefits.map((benefit) => <li key={benefit}><span>✓</span>{benefit}</li>)}</ul>
              <div className="next-step"><b>A useful next step</b><p>{recommendation.next_step}</p></div>
              <form onSubmit={submitInquiry}>
                <div className="form-heading"><span>ALMOST THERE</span><h3>Tell us how to reach you.</h3><p>Share your details and a short description of your project.</p></div>
                <div className="fields">
                  <label>Full name *<input required minLength="2" maxLength="100" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Your name" /></label>
                  <label>Email address *<input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></label>
                  <label className="wide">Company (optional)<input maxLength="150" value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Company or organisation" /></label>
                  <label className="wide">Project description *<textarea required minLength="10" maxLength="2000" rows="4" value={form.project_description} onChange={(e) => update("project_description", e.target.value)} placeholder="What are you trying to achieve?" /></label>
                </div>
                <div className="actions"><button type="button" className="button secondary" onClick={() => setStep(2)}>← Back</button><button className="button primary" disabled={loading}>{loading ? "Submitting..." : "Send project inquiry →"}</button></div>
              </form>
            </div>}

            {step === 4 && <div className="success-state"><div className="success-check">✓</div><div className="eyebrow">INQUIRY RECEIVED</div><h3>Thanks for sharing your idea.</h3><p>{success}</p><button className="button primary" onClick={reset}>Start again ↗</button></div>}
          </div>
          <p className="prototype-note">Prototype demonstration · Recommendations are rule-based and are not a formal quote or commitment.</p>
        </section>

        <section className="closing" id="about"><div><div className="eyebrow">TURN YOUR IDEA INTO A PLAN</div><h2>Good technology begins with understanding.</h2><p>Start with your challenge. We'll help you explore a direction.</p></div><a className="button light" href="#finder">Explore your solution →</a></section>
      </main>
      <footer><a className="brand footer-brand" href="#home"><span className="brand-mark">C</span><span>CYN<span className="brand-accent">BIT</span><small>SMART SOLUTION FINDER · PROTOTYPE</small></span></a><span>Independent internship prototype · 2026</span></footer>
    </div>
  );
}
