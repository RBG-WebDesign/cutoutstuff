import { ClosingCta, PageHero, SeamedCard, SeamedGrid, body } from "@/components/marketing/MarketingBlocks";
import { Container, Eyebrow } from "@/components/ui/primitives";

const steps = [
  ["01", "Upload or approve artwork", "Send us the image or approve a concept. Any high-resolution photo works best."],
  ["02", "We prepare the print file", "Background removal, color checks, and scale are set for a clean life-size result."],
  ["03", "Printed and precision-cut", "Produced on premium rigid material and contour-cut to the exact silhouette."],
  ["04", "Packed and shipped", "Carefully packed in protective packaging and shipped with tracking."],
];

export const metadata = {
  title: "How It Works",
  description: "How CutOutStuff turns a single image into a finished premium life-size cutout.",
};

export default function HowItWorksPage() {
  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      <PageHero eyebrow="How it works" title="From image to finished cutout.">
        A simple process with proof approval, careful file prep, precision cutting, and tracked
        shipping.
      </PageHero>
      <section style={{ padding: "0 0 var(--section-y)" }}>
        <Container>
          <SeamedGrid>
            <SeamedCard>
              <Eyebrow style={{ marginBottom: 16 }}>Individual</Eyebrow>
              <h2 style={{ fontSize: 28, lineHeight: 1.1, fontWeight: 500, margin: "0 0 14px" }}>One cutout for one moment.</h2>
              <p style={body}>Perfect for pets, birthdays, weddings, graduations, memorials, and surprise gifts.</p>
            </SeamedCard>
            <SeamedCard>
              <Eyebrow style={{ marginBottom: 16 }}>Campaign</Eyebrow>
              <h2 style={{ fontSize: 28, lineHeight: 1.1, fontWeight: 500, margin: "0 0 14px" }}>A run of cutouts for an audience.</h2>
              <p style={body}>Built for creators, teams, retail activations, launches, and event programs.</p>
            </SeamedCard>
          </SeamedGrid>
        </Container>
      </section>
      <section style={{ padding: "0 0 var(--section-y)" }}>
        <Container>
          <SeamedGrid>
            {steps.map(([n, title, text]) => (
              <SeamedCard key={n}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", marginBottom: 20 }}>{n}</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 10px" }}>{title}</h3>
                <p style={body}>{text}</p>
              </SeamedCard>
            ))}
          </SeamedGrid>
        </Container>
      </section>
      <ClosingCta />
    </div>
  );
}
