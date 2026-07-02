"use client";

import { useState } from "react";
import { PageHero, body } from "@/components/marketing/MarketingBlocks";
import { Container, Eyebrow } from "@/components/ui/primitives";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--hairline-14)",
  background: "var(--surface)",
  color: "var(--ink)",
  borderRadius: "var(--radius-control)",
  padding: "13px 14px",
  fontSize: 15,
};

const fields = [
  "Creator name",
  "Email",
  "Social links",
  "Audience size",
  "Expected demand",
  "Launch date",
  "Country",
];

export default function CreatorApplyPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      <PageHero eyebrow="Creator application" title="Apply to launch.">
        Tell us about your audience, concept, rights, and expected demand so we can review whether
        the campaign is a good fit.
      </PageHero>
      <section style={{ padding: "0 0 var(--section-y)" }}>
        <Container style={{ maxWidth: 900 }}>
          {submitted ? (
            <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", padding: "clamp(32px,5vw,56px)", textAlign: "center" }}>
              <Eyebrow style={{ marginBottom: 16 }}>Application received</Eyebrow>
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.05, fontWeight: 500, margin: "0 0 14px" }}>
                We will review the campaign.
              </h2>
              <p style={{ ...body, maxWidth: "54ch", margin: "0 auto" }}>
                If the concept fits, we will follow up with launch details and image requirements.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 14,
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                padding: "clamp(24px,4vw,42px)",
              }}
            >
              {fields.map((field) => (
                <label key={field} style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--muted-ink)" }}>
                  {field}
                  <input style={inputStyle} required={field === "Creator name" || field === "Email"} />
                </label>
              ))}
              <label style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--muted-ink)", gridColumn: "1 / -1" }}>
                Concept
                <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} required />
              </label>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", gridColumn: "1 / -1", color: "var(--muted-ink)", fontSize: 14, lineHeight: 1.5 }}>
                <input type="checkbox" required style={{ marginTop: 3 }} />
                I confirm I own or control the rights needed to submit the image and launch this
                product.
              </label>
              <label style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--muted-ink)", gridColumn: "1 / -1" }}>
                Notes
                <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} />
              </label>
              <button
                type="submit"
                style={{
                  justifySelf: "start",
                  border: 0,
                  borderRadius: "var(--radius-control)",
                  background: "var(--ink)",
                  color: "#fff",
                  padding: "15px 28px",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Submit Application
              </button>
            </form>
          )}
        </Container>
      </section>
    </div>
  );
}
