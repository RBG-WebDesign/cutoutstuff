import Link from "next/link";
import { footerNav } from "@/lib/nav";

// 4-column link grid on --surface — README §Public marketing site.
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--faint-ink)",
  marginBottom: 16,
};

const linkStyle: React.CSSProperties = {
  fontSize: 14,
  color: "var(--muted-ink)",
  textDecoration: "none",
};

const monoMeta: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  color: "var(--faint-ink)",
  textDecoration: "none",
};

function Column({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <div style={labelStyle}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} style={linkStyle}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--hairline)" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: "clamp(48px,6vw,72px) var(--gutter) clamp(28px,4vw,40px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: "clamp(28px,4vw,48px)",
        }}
      >
        <div style={{ gridColumn: "1/-1", maxWidth: 320 }}>
          <div style={{ fontWeight: 600, letterSpacing: "-0.025em", fontSize: 20, marginBottom: 12 }}>
            CutOutStuff<span style={{ color: "var(--accent)" }}>.</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--soft-ink)", margin: 0 }}>
            Presence, printed. Premium life-size cutouts of anyone worth celebrating, shipped anywhere.
          </p>
        </div>
        <Column title="Explore" links={footerNav.explore} />
        <Column title="Support" links={footerNav.support} />
        <Column title="Company" links={footerNav.company} />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: "20px var(--gutter)",
          borderTop: "1px solid var(--hairline-08)",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--faint-ink)" }}>
          © 2026 CutOutStuff
        </span>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Link href="/dashboard" style={monoMeta}>
            Creator sign in
          </Link>
          <Link href="/dashboard" style={monoMeta}>
            Staff
          </Link>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--faint-ink)" }}>
            Ships worldwide
          </span>
        </div>
      </div>
    </footer>
  );
}
