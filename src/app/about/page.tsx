"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  return (
    <div style={{ padding: "46px 24px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8f99" }}>
        About Us · Desktop
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
          <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".16em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "18px" }}>Our story</div>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "54px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>About CutoutStuff.</h1>
          <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#5B636E", margin: "18px auto 0", maxWidth: "56ch" }}>
            We help you celebrate life's biggest milestones. From wedding photo booths to corporate events, we print premium life-size custom standees that capture attention and create lasting memories.
          </p>
        </div>

        {/* Content Section */}
        <div style={{ maxWidth: "800px", margin: "0 auto 80px", padding: "0 24px", font: "500 16px/1.7 'Plus Jakarta Sans'", color: "#3c4658" }}>
          <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "28px", color: "#15243C", marginBottom: "16px" }}>Crafted with Care in the USA</h2>
          <p style={{ marginBottom: "20px" }}>
            At CutoutStuff, we believe every event is special. That's why we print our custom standees on ultra-durable, premium foam-board that won't curl or bend. Every cutout includes a sturdy, easy-to-use cardboard easel stand.
          </p>
          <p style={{ marginBottom: "20px" }}>
            We review every photo manually before production. If we see issues with resolution or lighting, we'll reach out to help you find a better option. We'll send you a digital proof to approve before we print.
          </p>
          <p style={{ marginBottom: "20px" }}>
            We're a dedicated team based in the USA, and we pride ourselves on fast turnaround, secure checkout, and outstanding customer service. Thank you for letting us be a part of your celebrations!
          </p>
        </div>
      </div>
    </div>
  );
}
