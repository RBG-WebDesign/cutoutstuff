import { ClosingCta, PageHero } from "@/components/marketing/MarketingBlocks";
import { Container } from "@/components/ui/primitives";

const faqs = [
  {
    q: "What kind of photo should I send?",
    a: "Send the clearest, largest image you have. Full-body images work best for life-size cutouts, but we can review almost anything and tell you what will print cleanly.",
  },
  {
    q: "Will I see a proof before it prints?",
    a: "Yes. We prepare the image, scale it, outline the cut path, and send a proof for approval before production begins.",
  },
  {
    q: "Does every cutout include a stand?",
    a: "Yes. Every full-size cutout includes a stand so it can be displayed on a flat indoor surface.",
  },
  {
    q: "How tall can you make it?",
    a: "Most cutouts are made between 24 inches and 7 feet tall. If you need a special size or a multi-piece display, send the details with your request.",
  },
  {
    q: "Can you remove the background?",
    a: "Yes. Background removal and clean cut-path prep are part of the production process.",
  },
  {
    q: "Can I order more than one?",
    a: "Yes. We handle one-off gifts, event batches, retail displays, and creator campaign runs.",
  },
  {
    q: "Can I use a celebrity, character, or team logo?",
    a: "Only if you own or control the rights to use that image. We may reject files that appear unauthorized or inappropriate.",
  },
  {
    q: "How is it shipped?",
    a: "Cutouts are packed flat in protective packaging and shipped with tracking. Larger and rush orders may require custom handling.",
  },
  {
    q: "What if it arrives damaged?",
    a: "Contact us with the order number, email, and photos of the packaging and product. We will review the issue and help with the next step.",
  },
];

export const metadata = {
  title: "FAQ",
  description: "Answers to common questions about CutOutStuff custom life-size cutouts.",
};

export default function FaqPage() {
  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      <PageHero eyebrow="Common questions" title="Frequently asked questions.">
        Details about photos, proofs, stands, shipping, rights, and what happens before anything
        goes to print.
      </PageHero>
      <section style={{ padding: "0 0 var(--section-y)" }}>
        <Container style={{ maxWidth: 880 }}>
          <div style={{ borderTop: "1px solid var(--hairline)" }}>
            {faqs.map((item) => (
              <details key={item.q} style={{ borderBottom: "1px solid var(--hairline)", padding: "22px 0" }}>
                <summary
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 24,
                    fontSize: 19,
                    fontWeight: 600,
                  }}
                >
                  {item.q}
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>+</span>
                </summary>
                <p style={{ color: "var(--soft-ink)", fontSize: 16, lineHeight: 1.65, maxWidth: "66ch", margin: "14px 0 0" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>
      <ClosingCta />
    </div>
  );
}
