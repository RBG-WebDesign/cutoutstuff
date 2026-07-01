"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Partner() {
  const router = useRouter();

  return (
    <div style={{ padding: "46px 24px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8f99" }}>
        Partner With Us · Desktop
      </div>

      <div style={{ width: "1280px", background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 40px 90px rgba(21, 36, 60, .16)", border: "1px solid #E3E7EE" }}>
        {/* Header */}
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: "rgba(255, 255, 255, .92)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E9EDF3", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
              <img src="/assets/cs-mark.png" alt="" style={{ height: "32px", width: "auto", display: "block" }} />
              <span style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "21px", letterSpacing: "-.02em", color: "#15243C" }}>
                Cutout<span style={{ color: "#1D77F5" }}>Stuff</span>
              </span>
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "28px", font: "500 14.5px 'Plus Jakarta Sans'", color: "#3c4658" }}>
            <Link href="/create">Shop</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => router.push("/create")} style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "11px", padding: "11px 18px", cursor: "pointer" }}>
              Upload your photo
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={{ padding: "64px 36px 44px", textAlign: "center" }}>
          <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".16em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "18px" }}>Partnerships &amp; Volume</div>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "54px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>Partner With CutoutStuff</h1>
          <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#5B636E", margin: "18px auto 0", maxWidth: "56ch" }}>
            Resellers, event planners, creators, and businesses — let's work together to create incredible life-size standees at scale. We offer volume discounts and priority dispatch.
          </p>
        </div>

        {/* Form & Info Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", padding: "0 36px 80px", maxWidth: "1100px", margin: "0 auto" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "24px", color: "#15243C", marginBottom: "16px" }}>Why Partner With Us?</h2>
            <ul style={{ paddingLeft: "20px", font: "500 15px/1.7 'Plus Jakarta Sans'", color: "#3c4658", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><strong>Volume Discounts:</strong> Graduated savings for orders of 5+ or more units.</li>
              <li><strong>Dedicated Handoff:</strong> Special support channel for custom cutlines and complex vector prep.</li>
              <li><strong>Direct Shipping:</strong> Blind-shipping available directly to your client or event location.</li>
              <li><strong>Premium Materials:</strong> Rigid foam-board built to withstand busy crowds and repeated setup.</li>
            </ul>
          </div>
          <div style={{ background: "#FBF8F3", borderRadius: "18px", padding: "30px", border: "1px solid #E3E7EE" }}>
            <h3 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "18px", color: "#15243C", marginBottom: "16px" }}>Get in Touch</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for your message! Our team will reach out shortly."); }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="Name" required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #DCE3EC", outline: "none", font: "inherit" }} />
              <input type="email" placeholder="Email" required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #DCE3EC", outline: "none", font: "inherit" }} />
              <input type="text" placeholder="Company / Organization" required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #DCE3EC", outline: "none", font: "inherit" }} />
              <textarea placeholder="Tell us about your project..." rows={4} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #DCE3EC", outline: "none", font: "inherit", resize: "none" }}></textarea>
              <button type="submit" style={{ font: "700 14.5px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "10px", padding: "14px", cursor: "pointer" }}>Submit Request</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
