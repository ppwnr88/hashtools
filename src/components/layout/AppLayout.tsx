import { NavLink, Outlet } from "react-router-dom";
import { GitBranch, Terminal } from "lucide-react";
import { AdSlot } from "../ads/AdSlot";
import { navItems } from "./navigation";

export function AppLayout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="logo">&gt;_</span>
          <span>
            <strong>Wannarat</strong>
            <small>Hash Tools</small>
          </span>
        </NavLink>
        <nav className="side-nav" aria-label="Tool navigation">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-wrap">
        <header className="topbar">
          <div>
            <p className="eyebrow"><Terminal size={14} /> client-side developer utility</p>
            <p className="privacy-line">All calculations run locally in your browser. Your input is never uploaded.</p>
          </div>
          <a href="https://vercel.com" className="ghost-link" target="_blank" rel="noreferrer">
            <GitBranch size={16} /> Static-ready
          </a>
        </header>
        <AdSlot placement="top" />
        <main className="content-grid">
          <section className="content">
            <Outlet />
          </section>
          <aside className="right-rail">
            <AdSlot placement="rail" />
            <div className="notice-card">
              <strong>Privacy notice</strong>
              <p>Your text, files, passwords, and keys stay in your browser. This website does not upload or store them.</p>
            </div>
          </aside>
        </main>
        <AdSlot placement="bottom" />
      </div>

      <nav className="mobile-tabs" aria-label="Mobile navigation">
        {navItems.slice(0, 5).map((item) => (
          <NavLink key={item.label} to={item.to} className={({ isActive }) => (isActive ? "mobile-tab active" : "mobile-tab")}>
            <item.icon size={18} />
            <span>{item.label.replace("Common ", "")}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
