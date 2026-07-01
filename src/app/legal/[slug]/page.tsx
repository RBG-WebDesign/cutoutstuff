"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface LegalDoc {
  title: string;
  content: React.ReactNode;
}

export default function LegalPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const docs: Record<string, LegalDoc> = {
    privacy: {
      title: "Privacy Policy",
      content: (
        <>
          <p>This Privacy Policy describes how CutoutStuff collects, uses, and discloses your personal information when you visit or make a purchase from the Site.</p>
          <h3 style={{ marginTop: "20px", marginBottom: "8px" }}>Photos & Image Data</h3>
          <p>Your uploaded photos are used strictly to generate the cutout preview and print your order. We store photos securely in Google Drive and automatically delete them after 30 days of production completion.</p>
        </>
      ),
    },
    terms: {
      title: "Terms of Service",
      content: (
        <>
          <p>By using our website, you agree to comply with and be bound by the following terms and conditions of use. Please review them carefully.</p>
          <h3 style={{ marginTop: "20px", marginBottom: "8px" }}>Use of Content</h3>
          <p>You represent and warrant that you own or have the necessary licenses, rights, and permissions to upload and print any photos you submit to CutoutStuff.</p>
        </>
      ),
    },
    shipping: {
      title: "Shipping & Returns",
      content: (
        <>
          <p>We print and dispatch most orders within 2–4 business days. Ground shipping takes an additional 2–5 days depending on your U.S. location.</p>
          <h3 style={{ marginTop: "20px", marginBottom: "8px" }}>Refunds & Replacements</h3>
          <p>Because each cutout is custom made from your personal photo, we cannot accept returns. However, if your order arrives damaged or has a defect, contact support and we'll ship a replacement immediately.</p>
        </>
      ),
    },
    "photo-rights": {
      title: "Photo Rights & Content Guidelines",
      content: (
        <>
          <p>When you upload an image, you retain all rights to it. You must own the photo or have permission from the owner to print it.</p>
          <h3 style={{ marginTop: "20px", marginBottom: "8px" }}>Inappropriate Content</h3>
          <p>We reserve the right to decline any order with photos containing illegal, highly offensive, or copyrighted material without permission. If your order is canceled, you will receive a full refund.</p>
        </>
      ),
    },
  };

  const doc = docs[slug] || {
    title: "Document Not Found",
    content: <p>The requested legal document could not be found.</p>,
  };

  return (
    <div style={{ padding: "46px 24px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
      <div style={{ font: "600 12px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8f99" }}>
        Legal · {doc.title}
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

        {/* Content Section */}
        <div style={{ maxWidth: "800px", margin: "64px auto 80px", padding: "0 24px", font: "500 15.5px/1.6 'Plus Jakarta Sans'", color: "#3c4658" }}>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "38px", color: "#15243C", marginBottom: "30px", letterSpacing: "-.02em" }}>
            {doc.title}
          </h1>
          <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
            <Link href="/legal/privacy" style={{ color: slug === "privacy" ? "#1D77F5" : "inherit", fontWeight: slug === "privacy" ? 700 : 500 }}>Privacy Policy</Link>
            <span>·</span>
            <Link href="/legal/terms" style={{ color: slug === "terms" ? "#1D77F5" : "inherit", fontWeight: slug === "terms" ? 700 : 500 }}>Terms of Service</Link>
            <span>·</span>
            <Link href="/legal/shipping" style={{ color: slug === "shipping" ? "#1D77F5" : "inherit", fontWeight: slug === "shipping" ? 700 : 500 }}>Shipping &amp; Returns</Link>
            <span>·</span>
            <Link href="/legal/photo-rights" style={{ color: slug === "photo-rights" ? "#1D77F5" : "inherit", fontWeight: slug === "photo-rights" ? 700 : 500 }}>Photo Rights</Link>
          </div>
          <div style={{ borderTop: "1px solid #EBEFF4", paddingTop: "30px" }}>
            {doc.content}
          </div>
        </div>
      </div>
    </div>
  );
}
