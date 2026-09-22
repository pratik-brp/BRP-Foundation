import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./Button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const footerLinks = [["Home", "/"], ["About Us", "/about"], ["Project Aabha", "/program"], ["Our Impact", "/gallery"], ["Contact Us", "/book-a-tour"]] as const;

export function Header({ hideNavLinks = false }: { hideNavLinks?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, []);
  return <header className="site-header">
    <div className="nav-shell">
      <Link
        to="/"
        className="brand"
        aria-label="BRP Foundation home"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <img src="/brp-logo.png" alt="BRP Foundation Logo" className="brand-logo" />
        <span className="brand-text">
          <span className="brand-title">BRP</span>
          <span className="brand-subtitle">FOUNDATION</span>
        </span>
      </Link>
      {!hideNavLinks && (
        <>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link
              to="/"
              activeProps={{ className: "active" }}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              Home
            </Link>
            <Link to="/about" activeProps={{ className: "active" }}>About Us</Link>
            <Link to="/program" activeProps={{ className: "active" }}>Project Aabha</Link>
            <Link to="/gallery" activeProps={{ className: "active" }}>Our Impact</Link>
          </nav>
          <Button to="/book-a-tour" variant="primary" className="desktop-apply">Contact Us</Button>
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
        </>
      )}
    </div>
    {!hideNavLinks && open && <nav className="mobile-nav" aria-label="Mobile navigation">
      <Link
        to="/"
        onClick={() => {
          setOpen(false);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        Home
      </Link>
      <Link to="/about" onClick={() => setOpen(false)}>About Us</Link>
      <Link to="/program" onClick={() => setOpen(false)}>Project Aabha</Link>
      <Link to="/gallery" onClick={() => setOpen(false)}>Our Impact</Link>
      <Button to="/book-a-tour" onClick={() => setOpen(false)}>Contact Us</Button>
    </nav>}
  </header>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) { return <p className={className ? `eyebrow ${className}` : "eyebrow"}><span>✠</span>{children}</p>; }

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <section className="page-hero reveal"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{description && <p>{description}</p>}</section>;
}

export function ClosingCTA() {
  return <div className="site-end"><section className="closing-cta"><div className="rise"><h2>Change grows through collaboration.</h2><p>Lasting impact is never created alone. We collaborate with schools, educators, local communities, healthcare providers, and purpose-led partners who share our belief in a stronger, more equitable Nepal.</p><p>Whether you are an institution, organisation, or individual looking to contribute, we welcome conversations that can turn shared intent into meaningful action.</p><div className="button-row"><Button to="/book-a-tour" variant="light">Connect With Us</Button></div></div></section>
    <footer className="footer rise"><div className="footer-grid"><div className="footer-brand"><img src="/brp-logo.png" alt="" /><div><strong>BRP Foundation</strong><p>Building stronger communities. Creating brighter futures.</p></div></div><nav aria-label="Footer navigation"><h3>Navigation</h3>{footerLinks.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}</nav><div><h3>Contact</h3><p>Baluwatar, Kathmandu, Nepal 44600</p><a href="mailto:info@brpgroup.com.np">info@brpgroup.com.np</a><a href="tel:+97714535691">+977 01 4535691</a><a href="tel:+97714516390">+977 01 4516390</a></div></div>
      <div className="copyright">© 2026 BRP Foundation. All rights reserved</div></footer></div>;
}

export function SiteLayout({
  children,
  hideHeader = false,
  hideNavLinks = false,
  hideFooter = false,
}: {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideNavLinks?: boolean;
  hideFooter?: boolean;
}) {
  useScrollReveal();
  return (
    <>
      {!hideHeader && <Header hideNavLinks={hideNavLinks} />}
      <main>{children}</main>
      {!hideFooter && <ClosingCTA />}
    </>
  );
}