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
  "Name",
  "Email",
  "Project type",
  "Order type",
  "Estimated quantity",
  "Shipping destination",
  "Upload or image link",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      <PageHero eyebrow="Start a project" title="Tell us who should be in the room.">
        Send the subject, the occasion, and where it needs to go. We will review the details and
        follow up with the next step.
      </PageHero>
      <section style={{ padding: "0 0 var(--section-y)" }}>
        <Container style={{ maxWidth: 900 }}>
          {submitted ? (
            <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", padding: "clamp(32px,5vw,56px)", textAlign: "center" }}>
              <Eyebrow style={{ marginBottom: 16 }}>Request received</Eyebrow>
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.05, fontWeight: 500, margin: "0 0 14px" }}>
                We have the project details.
              </h2>
              <p style={{ ...body, maxWidth: "54ch", margin: "0 auto" }}>
                A CutOutStuff team member will review the request and follow up with production
                guidance.
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
                  <input style={inputStyle} required={field === "Name" || field === "Email"} />
                </label>
              ))}
              <label style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--muted-ink)", gridColumn: "1 / -1" }}>
                Notes
                <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical" }} />
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
                Request a Quote
              </button>
            </form>
          )}
        </Container>
      </section>
    </div>
  );
}
