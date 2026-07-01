"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Support() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const formattedId = orderId.toUpperCase().trim();
      const res = await fetch(`/api/orders?id=${formattedId}&email=${encodeURIComponent(email.trim())}`);
      
      if (!res.ok) {
        throw new Error(res.status === 404 ? "Order not found or email mismatch." : "Something went wrong. Please try again.");
      }

      const data = await res.json();
      setSearchResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to look up order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "46px 24px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8f99" }}>
        Support &amp; Lookup · Desktop
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
          <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".16em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "18px" }}>Get assistance</div>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "54px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>Support &amp; Contact</h1>
        </div>

        {/* Grid for Support & Lookup */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", padding: "0 36px 80px", maxWidth: "1100px", margin: "0 auto" }}>
          {/* Order Lookup */}
          <div style={{ background: "#FBF8F3", borderRadius: "18px", padding: "30px", border: "1px solid #E3E7EE" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "22px", color: "#15243C", marginBottom: "16px" }}>Order Status Lookup</h2>
            <form onSubmit={handleLookup} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                placeholder="Order ID (e.g. CS-1001)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #DCE3EC", outline: "none", font: "inherit" }}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #DCE3EC", outline: "none", font: "inherit" }}
              />
              <button type="submit" disabled={loading} style={{ font: "700 14.5px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "10px", padding: "14px", cursor: "pointer" }}>
                {loading ? "Looking up..." : "Check Status"}
              </button>
            </form>

            {error && (
              <div style={{ marginTop: "16px", padding: "12px", borderRadius: "8px", background: "#FEEBEB", color: "#E5484D", font: "600 14px 'Plus Jakarta Sans'" }}>
                {error}
              </div>
            )}

            {searchResult && (
              <div style={{ marginTop: "20px", padding: "18px", borderRadius: "12px", background: "#fff", border: "1px solid #CFE2FB" }}>
                <h3 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "16.5px", color: "#15243C", margin: "0 0 12px" }}>Order {searchResult.id}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", font: "500 14px 'Plus Jakarta Sans'", color: "#3c4658" }}>
                  <div><strong>Status:</strong> <span style={{ textTransform: "capitalize", fontWeight: 700, color: "#1D77F5" }}>{searchResult.orderStatus}</span></div>
                  <div><strong>Payment:</strong> <span style={{ textTransform: "capitalize" }}>{searchResult.paymentStatus}</span></div>
                  <div><strong>Size &amp; Qty:</strong> {searchResult.size} (Qty: {searchResult.quantity})</div>
                  {searchResult.trackingNumber && (
                    <div><strong>Tracking:</strong> <a href="#" style={{ color: "#1D77F5", textDecoration: "underline" }}>{searchResult.trackingNumber}</a></div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div style={{ background: "#fff", borderRadius: "18px", padding: "30px", border: "1px solid #E3E7EE" }}>
            <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "22px", color: "#15243C", marginBottom: "16px" }}>Contact Support</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! We'll reply within 24 hours."); }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="Name" required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #DCE3EC", outline: "none", font: "inherit" }} />
              <input type="email" placeholder="Email Address" required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #DCE3EC", outline: "none", font: "inherit" }} />
              <textarea placeholder="Message..." rows={4} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #DCE3EC", outline: "none", font: "inherit", resize: "none" }}></textarea>
              <button type="submit" style={{ font: "700 14.5px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "10px", padding: "14px", cursor: "pointer" }}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
