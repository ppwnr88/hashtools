import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Terminal } from "lucide-react";
import { navItems } from "./navigation";

export function AppLayout() {
  const location = useLocation();

  function isToolActive(to: string) {
    const target = new URL(to, window.location.origin);
    return target.pathname === location.pathname;
  }

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
            <Link key={item.label} to={item.to} className={isToolActive(item.to) ? "nav-link active" : "nav-link"}>
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="main-wrap">
        <header className="topbar">
          <div>
            <p className="eyebrow"><Terminal size={14} /> client-side developer utility</p>
            <p className="privacy-line">All calculations run locally in your browser. Your input is never uploaded.</p>
          </div>
        </header>
        <main className="content-grid">
          <section className="content">
            <Outlet />
          </section>
          <aside className="right-rail">
            <div className="notice-card">
              <strong>Privacy notice</strong>
              <p>Your text, files, passwords, and keys stay in your browser. This website does not upload or store them.</p>
            </div>
          </aside>
        </main>
      </div>

      <nav className="mobile-tabs" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link key={item.label} to={item.to} className={isToolActive(item.to) ? "mobile-tab active" : "mobile-tab"}>
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
