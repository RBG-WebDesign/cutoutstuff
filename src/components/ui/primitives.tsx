import Link from "next/link";

// Shared marketing primitives — flat + hairline, 2px control radius.

export function Container({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "var(--container)",
        margin: "0 auto",
        padding: "0 var(--gutter)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Space Mono uppercase label — README §Typography (eyebrow).
export function Eyebrow({
  children,
  color = "var(--accent)",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const base: React.CSSProperties = {
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
  padding: "15px 28px",
  borderRadius: "var(--radius-control)",
  fontSize: 15,
  fontWeight: 500,
  transition:
    "background .18s ease, color .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease",
};

const variants: Record<string, React.CSSProperties> = {
  primary: { background: "var(--ink)", color: "#fff" },
  outline: {
    background: "transparent",
    color: "var(--ink)",
    border: "1px solid var(--hairline-14)",
  },
  light: { background: "#fff", color: "var(--ink)", fontWeight: 600 },
};

// Button rendered as a Link (all CTAs navigate in the design).
export function ButtonLink({
  href,
  variant = "primary",
  children,
  style,
}: {
  href: string;
  variant?: "primary" | "outline" | "light";
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <Link href={href} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </Link>
  );
}
