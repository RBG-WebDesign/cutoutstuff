import { routes } from "@/lib/nav";
import { Container, Eyebrow, ButtonLink } from "@/components/ui/primitives";
import HeroHeadline from "@/components/home/HeroHeadline";
import HowShader from "@/components/home/HowShader";
import { heroCutouts } from "@/lib/cutout-assets";

const trust = [
  "Life-size printing",
  "Precision cutting",
  "Premium materials",
  "Careful packaging",
  "Ships worldwide",
];
const steps = [
  { n: "01", h: "Upload or approve artwork", p: "Send us the image or approve a concept. Any high-resolution photo works." },
  { n: "02", h: "We prepare the print file", p: "Background removal, color checks, and scale set for a clean life-size result." },
  { n: "03", h: "Printed & precision-cut", p: "Produced on premium rigid material and contour-cut to the exact silhouette." },
  { n: "04", h: "Packed & shipped", p: "Carefully packed in plain, protective packaging and shipped with tracking." },
];
const occasions = [
  { h: "Pets", p: "Make your dog the guest of honor." },
  { h: "Gifts", p: "Surprise someone with themselves." },
  { h: "Weddings & events", p: "Bring someone who can't be there." },
  { h: "Creators", p: "Let fans bring you into their space." },
  { h: "Retail displays", p: "Stop people in their tracks." },
  { h: "Brand activations", p: "Put your mascot where customers are." },
  { h: "Collectibles", p: "Fandom you can stand next to." },
  { h: "Characters", p: "Make the mascot real." },
];

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        color: "#7C838A",
        background: "var(--canvas)",
        padding: "4px 7px",
        border: "1px solid var(--hairline-08)",
      }}
    >
      // {children}
    </span>
  );
}

function HeroCutoutTile({
  cutout,
  index,
}: {
  cutout: (typeof heroCutouts)[number];
  index: number;
}) {
  return (
    <figure
      style={{
        position: "relative",
        aspectRatio: "3/4",
        border: "1px solid var(--hairline)",
        margin: 0,
        minWidth: 0,
        overflow: "hidden",
        background: "var(--panel)",
        transform: index % 2 === 1 ? "translateY(clamp(-24px,-3vw,-8px))" : undefined,
      }}
    >
      <img
        src={cutout.src}
        alt={cutout.description}
        loading={index === 0 ? "eager" : "lazy"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition:
            cutout.label === "mascot" ? "38% 50%" : cutout.tall ? "50% 42%" : "50% 50%",
          display: "block",
          filter: "saturate(.96) contrast(.98)",
        }}
      />
      <figcaption
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          zIndex: 1,
        }}
      >
        <MonoLabel>{cutout.label}</MonoLabel>
      </figcaption>
    </figure>
  );
}

export default function HomePage() {
  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      {/* Hero */}
      <section style={{ padding: "clamp(64px,9vw,128px) 0 clamp(40px,5vw,64px)" }}>
        <Container style={{ textAlign: "center" }}>
          <Eyebrow style={{ marginBottom: 26 }}>Life-size cutouts made simple</Eyebrow>
          <HeroHeadline />
          <p
            style={{
              fontSize: "clamp(16px,1.5vw,19px)",
              lineHeight: 1.6,
              color: "var(--soft-ink)",
              maxWidth: "60ch",
              margin: "26px auto 0",
            }}
          >
            We turn pets, people, creators, mascots, and characters into premium life-size
            cutouts, so anyone worth celebrating can actually be there.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 36,
            }}
          >
            <ButtonLink href={routes.contact}>Start a Project</ButtonLink>
            <ButtonLink href={routes.how} variant="outline">
              See How It Works
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Example grid */}
      <section style={{ padding: "0 0 clamp(48px,6vw,80px)" }}>
        <Container>
          <div
            className="cos-hero-cutout-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: "clamp(8px,1vw,14px)",
            }}
          >
            {heroCutouts.map((cutout, i) => (
              <HeroCutoutTile key={cutout.src} cutout={cutout} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section style={{ borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
        <Container
          style={{
            padding: "clamp(22px,3vw,32px) var(--gutter)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(16px,3vw,44px)",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {trust.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                letterSpacing: "0.04em",
                color: "#4A5056",
              }}
            >
              {t}
            </span>
          ))}
        </Container>
      </section>

      {/* How It Works (shader band) */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "var(--section-y) 0",
          background:
            "radial-gradient(120% 90% at 12% 0%,#E7ECEE 0%,rgba(231,236,238,0) 55%),radial-gradient(90% 80% at 88% 100%,#DFE8EA 0%,rgba(223,232,234,0) 60%),linear-gradient(180deg,#EEF1F2 0%,#E9EDEF 100%)",
        }}
      >
        <HowShader />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg,#F5F6F7 0%,rgba(245,246,247,0) 14%,rgba(245,246,247,0) 86%,#F5F6F7 100%)",
          }}
        />
        <Container style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: "clamp(32px,5vw,56px)",
            }}
          >
            <div>
              <Eyebrow style={{ marginBottom: 16 }}>How It Works</Eyebrow>
              <h2 style={{ ...h2Style, maxWidth: "16ch" }}>
                From a single image to a finished cutout.
              </h2>
            </div>
            <a
              href={routes.how}
              style={{
                fontSize: 14,
                color: "var(--ink)",
                borderBottom: "1px solid var(--ink)",
                paddingBottom: 3,
                whiteSpace: "nowrap",
              }}
            >
              Full process →
            </a>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 1,
              background: "var(--hairline)",
              border: "1px solid var(--hairline)",
            }}
          >
            {steps.map((s) => (
              <div key={s.n} style={{ background: "var(--surface)", padding: "clamp(24px,3vw,36px)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", marginBottom: 20 }}>
                  {s.n}
                </div>
                <h3 style={h3Style}>{s.h}</h3>
                <p style={cardP}>{s.p}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Quality band */}
      <section style={{ background: "var(--panel)", padding: "var(--section-y) 0" }}>
        <Container
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "clamp(32px,5vw,64px)",
            alignItems: "center",
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 16 }}>Quality</Eyebrow>
            <h2 style={{ ...h2Style, margin: "0 0 20px", maxWidth: "18ch" }}>
              Built to be displayed, not thrown away.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--muted-ink)", margin: "0 0 28px", maxWidth: "48ch" }}>
              Rigid backing, color-checked printing, and precision contour cuts. Every cutout is
              built to stand in a real space, and stay there.
            </p>
            <a
              href={routes.quality}
              style={{ fontSize: 14, color: "var(--ink)", borderBottom: "1px solid var(--ink)", paddingBottom: 3 }}
            >
              Materials & finish →
            </a>
          </div>
          <div
            style={{
              position: "relative",
              aspectRatio: "4/3",
              background: "repeating-linear-gradient(45deg,#E1E5E7 0 10px,#E9ECEE 10px 20px)",
              border: "1px solid var(--hairline-10)",
              display: "flex",
              alignItems: "flex-end",
              padding: 16,
            }}
          >
            <MonoLabel>detail shot, material edge / contour cut</MonoLabel>
          </div>
        </Container>
      </section>

      {/* Occasions */}
      <section style={{ padding: "var(--section-y) 0" }}>
        <Container>
          <Eyebrow style={{ marginBottom: 16 }}>Occasions</Eyebrow>
          <h2 style={{ ...h2Style, margin: "0 0 clamp(32px,5vw,52px)", maxWidth: "16ch" }}>
            Made for moments.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: 1,
              background: "var(--hairline)",
              border: "1px solid var(--hairline)",
            }}
          >
            {occasions.map((o) => (
              <div key={o.h} style={{ background: "var(--surface)", padding: "26px 22px" }}>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 6px" }}>{o.h}</h3>
                <p style={{ fontSize: 14, color: "var(--soft-ink)", margin: 0, lineHeight: 1.5 }}>{o.p}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
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
              <h2
                style={{
                  fontSize: "clamp(26px,3.5vw,40px)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  fontWeight: 500,
                  margin: 0,
                  maxWidth: "20ch",
                }}
              >
                Who deserves to be larger than life?
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", margin: "14px 0 0", maxWidth: "44ch" }}>
                Single cutout or a full campaign, tell us who should be in the room.
              </p>
            </div>
            <ButtonLink href={routes.contact} variant="light">
              Start a Project
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}

const h2Style: React.CSSProperties = {
  fontSize: "clamp(28px,4vw,46px)",
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  fontWeight: 500,
  margin: 0,
};
const h3Style: React.CSSProperties = {
  fontSize: 19,
  fontWeight: 600,
  margin: "0 0 10px",
  letterSpacing: "-0.01em",
};
const cardP: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: "var(--soft-ink)",
  margin: 0,
};
