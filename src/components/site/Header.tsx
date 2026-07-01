"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes, topNav } from "@/lib/nav";

// Sticky, blurred header — README §Public marketing site.
// 70px tall, rgba(245,246,247,0.82) blur, hairline bottom border.
// Desktop nav hides < 760px; hamburger reveals a stacked mobile menu.
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const linkStyle = (href: string): React.CSSProperties => ({
    cursor: "pointer",
    textDecoration: "none",
    fontSize: 14,
    color: pathname === href ? "var(--accent)" : "var(--ink)",
    paddingBottom: 3,
    borderBottom:
      pathname === href ? "1px solid var(--accent)" : "1px solid transparent",
    whiteSpace: "nowrap",
    transition: "color .18s ease, border-color .18s ease",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "rgba(245,246,247,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--hairline-08)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link
          href={routes.home}
          aria-label="CutOutStuff home"
          style={{
            fontWeight: 600,
            letterSpacing: "-0.025em",
            fontSize: 20,
            color: "var(--ink)",
            whiteSpace: "nowrap",
          }}
        >
          CutOutStuff<span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        <nav
          className="cos-desktop-nav"
          aria-label="Primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(14px,2.4vw,30px)",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {topNav.map((item) => (
            <Link key={item.href} href={item.href} style={linkStyle(item.href)}>
              {item.label}
            </Link>
          ))}
          <Link
            href={routes.contact}
            style={{
              cursor: "pointer",
              textDecoration: "none",
              background: "var(--ink)",
              color: "#fff",
              padding: "11px 20px",
              borderRadius: "var(--radius-control)",
              fontSize: 14,
              fontWeight: 500,
              whiteSpace: "nowrap",
              transition: "background .18s ease, transform .18s ease, box-shadow .18s ease",
            }}
          >
            Start a Project
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="cos-burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            width: 42,
            height: 42,
            background: "transparent",
            border: "1px solid var(--hairline-14)",
            borderRadius: "var(--radius-control)",
            cursor: "pointer",
            flexDirection: "column",
            gap: 4,
            padding: 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ display: "block", width: 18, height: 1.5, background: "var(--ink)" }}
            />
          ))}
        </button>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile"
          style={{
            borderTop: "1px solid var(--hairline-08)",
            background: "var(--canvas)",
            padding: "12px var(--gutter) 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {topNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 16,
                color: "var(--ink)",
                padding: "12px 4px",
                borderBottom: "1px solid rgba(23,25,28,0.06)",
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={routes.contact}
            onClick={() => setMenuOpen(false)}
            style={{
              background: "var(--ink)",
              color: "#fff",
              padding: 14,
              borderRadius: "var(--radius-control)",
              fontSize: 15,
              fontWeight: 500,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Start a Project
          </Link>
        </nav>
      )}
    </header>
  );
}
