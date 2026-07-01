"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const router = useRouter();

  return (
    <div style={{ padding: "46px 24px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8f99" }}>
        Sizes &amp; Pricing · Desktop
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
            <Link href="/pricing" style={{ color: "#1D77F5", fontWeight: 700 }}>Pricing</Link>
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
        <div style={{ padding: "64px 36px 20px", textAlign: "center" }}>
          <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".16em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "18px" }}>Transparent rates</div>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "54px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>Sizes &amp; pricing.</h1>
          <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#5B636E", margin: "18px auto 0", maxWidth: "56ch" }}>
            Free cardboard stand included with every order. Premium, thick, full-color printed foam-board cutouts built to stand tall.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{ padding: "44px 36px 64px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
          <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "36px 28px", textAlign: "center", background: "#FBF8F3" }}>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "22px", color: "#15243C" }}>3 Feet Tall</div>
            <p style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "12px" }}>Perfect for kids, pets, or sitting displays</p>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "52px", letterSpacing: "-.02em", color: "#1D77F5", lineHeight: 1, margin: "24px 0" }}>$49</div>
            <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#8a93a6" }}>+ shipping</div>
            <button onClick={() => router.push("/create")} style={{ width: "100%", font: "700 14px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "11px", padding: "12px", cursor: "pointer", marginTop: "24px" }}>
              Order 3ft Cutout
            </button>
          </div>
          <div style={{ border: "1.5px solid #1D77F5", borderRadius: "16px", padding: "36px 28px", textAlign: "center", background: "#fff", boxShadow: "0 12px 30px rgba(29, 119, 245, 0.08)", position: "relative" }}>
            <span style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "#1D77F5", color: "#fff", font: "800 10.5px 'Plus Jakarta Sans'", letterSpacing: ".08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "20px" }}>Most Popular</span>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "22px", color: "#15243C" }}>5 Feet Tall</div>
            <p style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "12px" }}>Life-size standee matching average heights</p>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "52px", letterSpacing: "-.02em", color: "#1D77F5", lineHeight: 1, margin: "24px 0" }}>$99</div>
            <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#8a93a6" }}>+ shipping</div>
            <button onClick={() => router.push("/create")} style={{ width: "100%", font: "700 14px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "11px", padding: "12px", cursor: "pointer", marginTop: "24px" }}>
              Order 5ft Cutout
            </button>
          </div>
          <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "36px 28px", textAlign: "center", background: "#FBF8F3" }}>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "22px", color: "#15243C" }}>6 Feet Tall</div>
            <p style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "12px" }}>Towering life-size display for adults and events</p>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "52px", letterSpacing: "-.02em", color: "#1D77F5", lineHeight: 1, margin: "24px 0" }}>$149</div>
            <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#8a93a6" }}>+ shipping</div>
            <button onClick={() => router.push("/create")} style={{ width: "100%", font: "700 14px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "11px", padding: "12px", cursor: "pointer", marginTop: "24px" }}>
              Order 6ft Cutout
            </button>
          </div>
          <div style={{ border: "1px solid #E3E7EE", borderRadius: "16px", padding: "36px 28px", textAlign: "center", background: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "22px", color: "#15243C" }}>Custom Size</div>
              <p style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "12px" }}>Looking for something bigger? We can print custom sizes up to 8+ feet tall.</p>
            </div>
            <Link href="/support" style={{ width: "100%", font: "700 14px 'Plus Jakarta Sans'", color: "#1D77F5", background: "#fff", border: "1.5px solid #CFE2FB", borderRadius: "11px", padding: "12px", cursor: "pointer", display: "block" }}>
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
