import { galleryCutouts } from "@/lib/cutout-assets";
import { routes } from "@/lib/nav";
import { ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";

const categories = ["All", ...Array.from(new Set(galleryCutouts.map((item) => item.category)))];

export const metadata = {
  title: "Gallery",
  description:
    "See custom life-size cutout examples for pets, birthdays, weddings, creators, schools, events, and business displays.",
};

export default function GalleryPage() {
  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      <section style={{ padding: "clamp(64px,9vw,124px) 0 clamp(36px,5vw,64px)" }}>
        <Container style={{ textAlign: "center" }}>
          <Eyebrow style={{ marginBottom: 24 }}>Gallery</Eyebrow>
          <h1
            style={{
              fontSize: "clamp(48px,9vw,118px)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Cutouts in the room.
          </h1>
          <p
            style={{
              fontSize: "clamp(16px,1.5vw,19px)",
              lineHeight: 1.6,
              color: "var(--soft-ink)",
              maxWidth: "58ch",
              margin: "26px auto 0",
            }}
          >
            Real product-style examples for pets, people, creators, teams, events, and display
            work.
          </p>
          <div
            aria-label="Gallery categories"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
              marginTop: 34,
            }}
          >
            {categories.map((category) => (
              <span
                key={category}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: category === "All" ? "#fff" : "var(--muted-ink)",
                  background: category === "All" ? "var(--ink)" : "var(--surface)",
                  border: "1px solid var(--hairline)",
                  padding: "7px 10px",
                }}
              >
                {category}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section style={{ padding: "0 0 var(--section-y)" }}>
        <Container>
          <div
            className="cos-gallery-grid"
            style={{
              columnCount: 3,
              columnGap: 14,
            }}
          >
            {galleryCutouts.map((item, index) => (
              <article
                key={item.src}
                style={{
                  breakInside: "avoid",
                  margin: "0 0 14px",
                  border: "1px solid var(--hairline)",
                  background: "var(--surface)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: item.tall ? "4/5" : "4/3",
                    overflow: "hidden",
                    background: "var(--panel)",
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.description}
                    loading={index < 3 ? "eager" : "lazy"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: item.category === "Volume" ? "50% 38%" : "50% 50%",
                      display: "block",
                      filter: "saturate(.96) contrast(.98)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      bottom: 12,
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      color: "#7C838A",
                      background: "var(--canvas)",
                      padding: "4px 7px",
                      border: "1px solid var(--hairline-08)",
                    }}
                  >
                    // {item.label}
                  </span>
                </div>
                <div style={{ padding: "18px 18px 20px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--accent)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    {item.category}
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>
                    {item.title}
                  </h2>
                  <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--soft-ink)", margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section style={{ padding: "0 0 clamp(64px,9vw,120px)" }}>
        <Container>
          <div
            style={{
              background: "var(--ink)",
              color: "#fff",
              padding: "clamp(38px,6vw,72px) clamp(28px,5vw,68px)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 26,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(26px,3.5vw,40px)",
                  lineHeight: 1.08,
                  fontWeight: 500,
                  margin: 0,
                  maxWidth: "20ch",
                }}
              >
                Have a subject in mind?
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.62)", margin: "14px 0 0" }}>
                Send the image. We will handle the scale, cut line, and production details.
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
