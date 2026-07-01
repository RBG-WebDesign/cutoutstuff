"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HowItWorks() {
  const router = useRouter();

  return (
    <div style={{ padding: "46px 24px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8f99" }}>
        How it works · Desktop
      </div>

      {/* ============ HOW IT WORKS · DESKTOP ============ */}
      <div className="desktop-only" style={{ width: "1280px", background: "#FBF8F3", borderRadius: "20px", overflow: "hidden", boxShadow: "0 40px 90px rgba(21, 36, 60, .16)", border: "1px solid #E3E7EE" }}>
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
            <Link href="/how-it-works" style={{ color: "#1D77F5", fontWeight: 700 }}>How it works</Link>
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
        <div style={{ padding: "64px 36px 20px", textAlign: "center" }}>
          <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".16em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "18px" }}>Simple by design</div>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "54px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>How CutoutStuff works.</h1>
          <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#5B636E", margin: "18px auto 0", maxWidth: "56ch" }}>
            From your photo to a premium foam-board cutout — in four simple steps. You approve a proof before anything prints.
          </p>
        </div>

        {/* 4 steps */}
        <div style={{ padding: "44px 36px 20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", position: "relative" }}>
          <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "18px", padding: "26px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "18px" }}><span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 15px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>1</span><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4M12 4l-4 4M12 4l4 4"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg></div>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C", marginBottom: "8px" }}>Upload your photo</div>
            <div style={{ font: "500 14.5px/1.6 'Plus Jakarta Sans'", color: "#5B636E" }}>Pick a clear photo you own or have permission to use.</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "18px", padding: "26px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "18px" }}><span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 15px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>2</span><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V8M9 20V4M14 20v-9M19 20v-6"/></svg></div>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C", marginBottom: "8px" }}>Choose your size</div>
            <div style={{ font: "500 14.5px/1.6 'Plus Jakarta Sans'", color: "#5B636E" }}>Select the height that fits your event, gift, or display.</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "18px", padding: "26px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "18px" }}><span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 15px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg></div>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C", marginBottom: "8px" }}>Approve your preview</div>
            <div style={{ font: "500 14.5px/1.6 'Plus Jakarta Sans'", color: "#5B636E" }}>We send a proof before anything prints. You&rsquo;re in control.</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "18px", padding: "26px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "18px" }}><span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 15px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>4</span><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8"/></svg></div>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C", marginBottom: "8px" }}>We print and ship</div>
            <div style={{ font: "500 14.5px/1.6 'Plus Jakarta Sans'", color: "#5B636E" }}>Printed on premium foam-board, packed flat, and shipped to your door.</div>
          </div>
        </div>

        {/* proof highlight band */}
        <div style={{ margin: "32px 36px 0", background: "#EAF3FF", borderRadius: "24px", padding: "44px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }}>
          <div>
            <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "14px" }}>The CutoutStuff promise</div>
            <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "34px", lineHeight: "1.05", letterSpacing: "-.025em", margin: 0, color: "#15243C" }}>You approve a proof<br />before anything prints.</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#3c4658", margin: "16px 0 0", maxWidth: "42ch" }}>
              We&rsquo;ll never send your cutout to print until you&rsquo;ve seen the proof and approved it. We don&rsquo;t change faces, bodies, logos, or important details — we only prepare the image so it cuts cleanly.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", background: "#fff", padding: "10px 10px 0", borderRadius: "10px 10px 4px 4px", filter: "drop-shadow(0 24px 20px rgba(21,36,60,.22))" }}>
              <div style={{ width: "200px", height: "300px", background: "#eee", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>Proof preview</div>
              <div style={{ position: "absolute", inset: "4px 4px 0", border: "1.5px dashed #1D77F5", borderRadius: "7px", pointerEvents: "none" }}></div>
            </div>
          </div>
        </div>

        {/* trust */}
        <div style={{ padding: "50px 36px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
          <div style={{ textAlign: "center" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><div style={{ font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C", marginTop: "9px" }}>Private uploads</div></div>
          <div style={{ textAlign: "center" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 12.5l2 2 4-4.5"/></svg><div style={{ font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C", marginTop: "9px" }}>Proof before print</div></div>
          <div style={{ textAlign: "center" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l8-4 8 4v10l-8 4-8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/></svg><div style={{ font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C", marginTop: "9px" }}>Premium foam-board</div></div>
          <div style={{ textAlign: "center" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 21V8l6-4 6 4v13M9 21v-6h6v6"/></svg><div style={{ font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C", marginTop: "9px" }}>Stand included</div></div>
          <div style={{ textAlign: "center" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V3M4 4h13l-2 4 2 4H4"/></svg><div style={{ font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C", marginTop: "9px" }}>Made in the USA</div></div>
        </div>

        {/* CTA band */}
        <div style={{ margin: "0 36px 44px", background: "#15243C", borderRadius: "24px", padding: "48px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "34px", letterSpacing: "-.025em", margin: 0, color: "#fff" }}>Ready to make yours?</h2>
          <p style={{ fontSize: "16px", color: "#aeb8c8", margin: "12px 0 24px" }}>Upload a photo and we&rsquo;ll send a free preview.</p>
          <button onClick={() => router.push("/create")} style={{ font: "700 16px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "13px", padding: "16px 30px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 12px 26px rgba(29,119,245,.34)" }}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4M12 4l-4 4M12 4l4 4"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>Upload your photo</button>
        </div>
      </div>

      {/* ============ HOW IT WORKS · MOBILE ============ */}
      <div className="mobile-only" style={{ width: "390px", background: "#FBF8F3", borderRadius: "30px", overflow: "hidden", boxShadow: "0 30px 70px rgba(21,36,60,.18)", border: "1px solid #E3E7EE" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #E9EDF3", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "17px", color: "#15243C" }}>Cutout<span style={{ color: "#1D77F5" }}>Stuff</span></span></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15243C" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </div>
        <div style={{ padding: "30px 20px 8px", textAlign: "center" }}>
          <div style={{ font: "600 11px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "14px" }}>Simple by design</div>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "32px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>How CutoutStuff works.</h1>
          <p style={{ fontSize: "14.5px", lineHeight: "1.55", color: "#5B636E", margin: "12px 0 0" }}>From your photo to a premium foam-board cutout — in four simple steps.</p>
        </div>
        <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px", display: "flex", gap: "14px", alignItems: "flex-start" }}><span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 14px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>1</span><div><div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "16px", color: "#15243C" }}>Upload your photo</div><div style={{ font: "500 13.5px/1.5 'Plus Jakarta Sans'", color: "#5B636E", marginTop: "3px" }}>Pick a clear photo you own or have permission to use.</div></div></div>
          <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px", display: "flex", gap: "14px", alignItems: "flex-start" }}><span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 14px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>2</span><div><div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "16px", color: "#15243C" }}>Choose your size</div><div style={{ font: "500 13.5px/1.5 'Plus Jakarta Sans'", color: "#5B636E", marginTop: "3px" }}>Select the height that fits your event, gift, or display.</div></div></div>
          <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px", display: "flex", gap: "14px", alignItems: "flex-start" }}><span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 14px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>3</span><div><div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "16px", color: "#15243C" }}>Approve your preview</div><div style={{ font: "500 13.5px/1.5 'Plus Jakarta Sans'", color: "#5B636E", marginTop: "3px" }}>We send a proof before anything prints. You&rsquo;re in control.</div></div></div>
          <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px", display: "flex", gap: "14px", alignItems: "flex-start" }}><span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#1D77F5", color: "#fff", font: "700 14px 'Plus Jakarta Sans'", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>4</span><div><div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "16px", color: "#15243C" }}>We print and ship</div><div style={{ font: "500 13.5px/1.5 'Plus Jakarta Sans'", color: "#5B636E", marginTop: "3px" }}>Premium foam-board, packed flat, shipped to your door.</div></div></div>
        </div>
        <div style={{ margin: "0 20px 24px", background: "#EAF3FF", borderRadius: "18px", padding: "24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "22px", lineHeight: "1.1", letterSpacing: "-.02em", margin: 0, color: "#15243C" }}>You approve a proof before anything prints.</h2>
          <p style={{ fontSize: "13.5px", lineHeight: "1.55", color: "#3c4658", margin: "10px 0 0" }}>We don&rsquo;t change faces, bodies, or important details — only prepare the image so it cuts cleanly.</p>
        </div>
        <div style={{ padding: "0 20px 30px" }}>
          <button onClick={() => router.push("/create")} style={{ width: "100%", font: "700 15.5px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "13px", padding: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "9px", boxShadow: "0 10px 22px rgba(29,119,245,.24)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4M12 4l-4 4M12 4l4 4"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>Upload your photo</button>
        </div>
      </div>
    </div>
  );
}
