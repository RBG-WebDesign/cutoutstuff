import { ClosingCta, PageHero, SeamedCard, SeamedGrid, body } from "@/components/marketing/MarketingBlocks";
import { ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";
import { routes } from "@/lib/nav";

const benefits = [
  "Creator-approved product pages",
  "Private links for launch control",
  "Limited drops or evergreen products",
  "Plain packaging for customers",
  "Proof workflow before production",
  "A physical collectible fans can keep",
];

export const metadata = {
  title: "Creator Program",
  description: "Launch creator-approved CutOutStuff collectibles with private campaign links.",
};

export default function CreatorsPage() {
  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      <PageHero eyebrow="Creator program" title="Let fans put you in their room.">
        Premium creator-approved cutouts for collectors, private drops, campaign pages, and
        memorable physical releases.
      </PageHero>
      <section style={{ padding: "0 0 var(--section-y)" }}>
        <Container>
          <SeamedGrid>
            {benefits.map((benefit) => (
              <SeamedCard key={benefit}>
                <Eyebrow style={{ marginBottom: 14 }}>Benefit</Eyebrow>
                <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{benefit}</h2>
              </SeamedCard>
            ))}
          </SeamedGrid>
        </Container>
      </section>
      <section style={{ padding: "0 0 var(--section-y)" }}>
        <Container style={{ textAlign: "center" }}>
          <p style={{ ...body, maxWidth: "58ch", margin: "0 auto 26px" }}>
            Start with a concept, a launch window, and the image rights. We will review fit,
            production needs, and campaign setup.
          </p>
          <ButtonLink href={routes.apply}>Apply to Launch</ButtonLink>
        </Container>
      </section>
      <ClosingCta title="Ready to launch a creator-approved cutout?" text="Apply with your concept and expected demand." />
    </div>
  );
}
