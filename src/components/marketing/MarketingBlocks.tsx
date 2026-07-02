import { ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";
import { routes } from "@/lib/nav";

export const h1: React.CSSProperties = {
  fontSize: "clamp(44px,7vw,84px)",
  lineHeight: 0.98,
  letterSpacing: "-0.04em",
  fontWeight: 500,
  margin: 0,
};

export const h2: React.CSSProperties = {
  fontSize: "clamp(28px,4vw,46px)",
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  fontWeight: 500,
  margin: 0,
};

export const body: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.65,
  color: "var(--soft-ink)",
  margin: 0,
};

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ padding: "clamp(64px,9vw,124px) 0 clamp(40px,6vw,72px)" }}>
      <Container style={{ textAlign: "center" }}>
        <Eyebrow style={{ marginBottom: 24 }}>{eyebrow}</Eyebrow>
        <h1 style={h1}>{title}</h1>
        <p
          style={{
            fontSize: "clamp(16px,1.5vw,19px)",
            lineHeight: 1.6,
            color: "var(--soft-ink)",
            maxWidth: "60ch",
            margin: "26px auto 0",
          }}
        >
          {children}
        </p>
      </Container>
    </section>
  );
}

export function ClosingCta({
  title = "Who deserves to be larger than life?",
  text = "Single cutout or a full campaign, tell us who should be in the room.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section style={{ padding: "0 0 clamp(64px,9vw,120px)" }}>
      <Container>
        <div
          style={{
            background: "var(--ink)",
            color: "#fff",
            padding: "clamp(40px,6vw,80px) clamp(28px,5vw,72px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 28,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ ...h2, maxWidth: "20ch" }}>{title}</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.62)", margin: "14px 0 0", maxWidth: "44ch" }}>
              {text}
            </p>
          </div>
          <ButtonLink href={routes.contact} variant="light">
            Start a Project
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function SeamedGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 1,
        background: "var(--hairline)",
        border: "1px solid var(--hairline)",
      }}
    >
      {children}
    </div>
  );
}

export function SeamedCard({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "var(--surface)", padding: "clamp(24px,3vw,36px)" }}>{children}</div>;
}
