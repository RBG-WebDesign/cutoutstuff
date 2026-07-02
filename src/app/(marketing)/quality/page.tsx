import { ClosingCta, PageHero, SeamedCard, SeamedGrid, body, h2 } from "@/components/marketing/MarketingBlocks";
import { Container, Eyebrow } from "@/components/ui/primitives";

const points = [
  "Rigid display material selected for clean standing presence.",
  "Color-checked printing for strong, believable image reproduction.",
  "Contour-cut edges that follow the subject instead of a rectangle.",
  "White border treatment that makes the silhouette read clearly.",
  "Stand included for indoor display on a flat surface.",
  "Protective packaging for flat shipment.",
  "Proof approval before production begins.",
];

const stats = ["Scale 24in-7ft", "Finish matte", "Stand included", "Built for indoor display"];

export const metadata = {
  title: "Quality",
  description: "Materials, finish, and production details for CutOutStuff life-size cutouts.",
};

export default function QualityPage() {
  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      <PageHero eyebrow="Quality" title="Built to be displayed, not thrown away.">
        Rigid backing, color-checked printing, precision contour cuts, and stands made for real
        rooms.
      </PageHero>
      <section style={{ padding: "0 0 var(--section-y)" }}>
        <Container style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(32px,5vw,64px)", alignItems: "start" }}>
          <div>
            <Eyebrow style={{ marginBottom: 16 }}>Materials and finish</Eyebrow>
            <h2 style={{ ...h2, marginBottom: 20 }}>Every detail supports the illusion.</h2>
            <p style={body}>A cutout only works when it feels crisp at full scale. The file prep, material, edge, and stand all matter.</p>
          </div>
          <div style={{ borderTop: "1px solid var(--hairline)" }}>
            {points.map((point) => (
              <div key={point} style={{ borderBottom: "1px solid var(--hairline)", padding: "18px 0", display: "flex", gap: 14 }}>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>+</span>
                <p style={body}>{point}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section style={{ background: "var(--ink)", color: "#fff", padding: "clamp(32px,5vw,56px) 0", marginBottom: "var(--section-y)" }}>
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 1, background: "rgba(255,255,255,.16)" }}>
            {stats.map((stat) => (
              <div key={stat} style={{ background: "var(--ink)", padding: "24px 20px", fontFamily: "var(--font-mono)", color: "var(--accent-light)", fontSize: 13 }}>
                {stat}
              </div>
            ))}
          </div>
        </Container>
      </section>
      <ClosingCta />
    </div>
  );
}
