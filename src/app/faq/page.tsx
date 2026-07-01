"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: "What kind of photo should I upload?",
      a: "The best photos are high-resolution, taken in good lighting, and show the subject standing or sitting clearly. Avoid blurry photos, low-resolution social media screenshots, or photos where parts of the subject are cut off.",
    },
    {
      q: "Does the cutout come with a stand?",
      a: "Yes! Every single cutout includes a heavy-duty cardboard easel stand that folds out from the back, allowing it to stand tall on any flat surface. It ships flat and takes 10 seconds to set up.",
    },
    {
      q: "Can I see what it looks like before you print?",
      a: "Absolutely. We prepare a proof (showing the cutout outline and a white border highlight) and email it to you. We will never print your order until you review and click approve.",
    },
    {
      q: "How long does shipping take?",
      a: "Most orders are prepared, approved, and printed in 2–4 business days. Ground shipping takes an additional 2–5 days depending on your location in the U.S. We also offer rush production and shipping options during checkout.",
    },
    {
      q: "Can you do custom sizes?",
      a: "Yes! We offer 3ft, 5ft, and 6ft directly in our checkout, but if you need an event standee that is 4ft, 7ft, or even 8ft+ tall, contact us via the Support page and we'll send a custom quote.",
    },
  ];

  return (
    <div style={{ padding: "46px 24px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8f99" }}>
        FAQ · Desktop
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
            <Link href="/faq" style={{ color: "#1D77F5", fontWeight: 700 }}>FAQ</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => router.push("/create")} style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "11px", padding: "11px 18px", cursor: "pointer" }}>
              Upload your photo
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={{ padding: "64px 36px 20px", textAlign: "center" }}>
          <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".16em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "18px" }}>Common questions</div>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "54px", lineHeight: "1.0", letterSpacing: "-.03em", margin: 0, color: "#15243C" }}>Frequently Asked Questions</h1>
        </div>

        {/* FAQ Accordions */}
        <div style={{ maxWidth: "800px", margin: "0 auto 80px", padding: "0 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} style={{ border: "1px solid #E3E7EE", borderRadius: "14px", overflow: "hidden", background: "#fff" }}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    style={{ width: "100%", textAlign: "left", background: isOpen ? "#EAF3FF" : "#fff", border: "none", padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", font: "700 16px 'Plus Jakarta Sans'", color: "#15243C" }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: "20px", color: "#1D77F5" }}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "20px 24px", borderTop: "1px solid #E3E7EE", font: "500 14.5px/1.6 'Plus Jakarta Sans'", color: "#5B636E" }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
