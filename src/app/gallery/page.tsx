"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Gallery() {
  const router = useRouter();

  // Mock list of gallery items showing how cutouts look in different locations
  const items = [
    { title: "Birthday Party Guest", desc: "5ft cutout standing by the gift table", type: "Party" },
    { title: "Family Pet Mascot", desc: "3ft golden retriever cutout at the door", type: "Pet" },
    { title: "Wedding Photo Booth Props", desc: "6ft bride and groom cutouts", type: "Wedding" },
    { title: "Graduation Celebration", desc: "5ft graduate cutout in cap and gown", type: "Event" },
    { title: "Corporate Trade Show mascot", desc: "6ft mascot standee for brand exhibition", type: "Business" },
    { title: "Memorial Remembrance Standee", desc: "5ft photo cutout at memorial service", type: "Memorial" }
  ];

  return (
    <div style={{ padding: "46px 24px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8f99" }}>
        Gallery · Desktop
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
            <Link href="/gallery" style={{ color: "#1D77F5", fontWeight: 700 }}>Gallery</Link>
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
          <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".16em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "18px" }}>Inspiration hub</div>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "54px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>Customer Gallery</h1>
          <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#5B636E", margin: "18px auto 0", maxWidth: "56ch" }}>
            See how our custom cutouts stand tall at birthdays, weddings, trade shows, school sports events, and inside offices.
          </p>
        </div>

        {/* Gallery Grid */}
        <div style={{ padding: "0 36px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ border: "1px solid #E3E7EE", borderRadius: "16px", overflow: "hidden", background: "#FBF8F3", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "240px", background: "#E5ECF6", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a97ab", font: "700 15px 'Plus Jakarta Sans'" }}>
                  {item.type} Photo Standee Mock
                </div>
                <div style={{ padding: "20px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#1D77F5", textTransform: "uppercase", letterSpacing: ".06em" }}>{item.type}</span>
                  <h3 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "17px", color: "#15243C", margin: "6px 0 4px" }}>{item.title}</h3>
                  <p style={{ fontSize: "13.5px", color: "#5B636E", margin: 0, lineHeight: 1.45 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
