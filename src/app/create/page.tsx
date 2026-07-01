"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateOrderFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flow State
  const [step, setStep] = useState<"upload" | "analyzing" | "quality" | "preview" | "size" | "options" | "checkout">("upload");
  const [qualityResult, setQualityResult] = useState<"good" | "reject">("good");
  const [previewReady, setPreviewReady] = useState(false);
  const [selectedSize, setSelectedSize] = useState<"3ft" | "5ft" | "6ft">("5ft");
  const [options, setOptions] = useState({
    proof: false,
    touchup: false,
    message: false,
    rush: false,
  });

  // Uploaded Image State
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [fileName, setFileName] = useState("photo.jpg");
  const [fileSizeStr, setFileSizeStr] = useState("0 MB");
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("alex.morgan@email.com");
  const [fullName, setFullName] = useState("Alex Morgan");
  const [address, setAddress] = useState("1847 Maple Avenue");
  const [city, setCity] = useState("Austin");
  const [region, setRegion] = useState("TX");
  const [zip, setZip] = useState("78704");
  const [rightsApproved, setRightsApproved] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const SIZES: Record<string, { label: string; price: number; blurb: string; tag?: string }> = {
    "3ft": { label: "3 Feet Tall", price: 49, blurb: "Desks, tables & small spaces" },
    "5ft": { label: "5 Feet Tall", price: 99, blurb: "Most popular for any occasion", tag: "Popular" },
    "6ft": { label: "6 Feet Tall", price: 149, blurb: "Big impact for big moments" },
  };

  const OPTS = {
    proof: { label: "Digital proof", desc: "A proof emailed before production", price: 12 },
    touchup: { label: "Touch-up service", desc: "Hand-cleaned edges & color", price: 20 },
    message: { label: "Custom message on back", desc: "Up to 120 characters", price: 10 },
    rush: { label: "Rush production", desc: "Front of the line, ships sooner", price: 25 },
  };

  const SHIPPING_COST = 14.95;

  // Calculation
  const sizeObj = SIZES[selectedSize];
  const basePrice = sizeObj.price;
  const optKeys = Object.keys(OPTS).filter((k) => options[k as keyof typeof options]);
  const optTotal = optKeys.reduce((a, k) => a + OPTS[k as keyof typeof OPTS].price, 0);
  const subtotal = basePrice + optTotal;
  const total = subtotal + SHIPPING_COST;

  // Stepper steps configuration
  const idxMap = { upload: 0, analyzing: 0, quality: 0, preview: 1, size: 2, options: 3, checkout: 4 };
  const ci = idxMap[step];
  const stepLabels = ["Upload", "Preview", "Size", "Options", "Checkout"];

  const handleRestart = () => {
    setStep("upload");
    setQualityResult("good");
    setPreviewReady(false);
    setSelectedSize("5ft");
    setOptions({ proof: false, touchup: false, message: false, rush: false });
    setRightsApproved(false);
    setOriginalImageUrl("");
  };

  // Real Upload logic
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processUpload(files[0]);
  };

  const processUpload = async (file: File) => {
    setUploading(true);
    setFileName(file.name);
    setFileSizeStr((file.size / (1024 * 1024)).toFixed(1) + " MB");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setOriginalImageUrl(data.url);

      // Start check simulation
      setStep("analyzing");
      setQualityResult("good");
      setTimeout(() => {
        setStep("quality");
      }, 1600);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const startRejectDemo = () => {
    setOriginalImageUrl("/assets/hero-cutouts.png"); // Placeholder
    setFileName("low-quality-sample.png");
    setFileSizeStr("0.2 MB");
    setStep("analyzing");
    setQualityResult("reject");
    setTimeout(() => {
      setStep("quality");
    }, 1600);
  };

  const handleGoPreview = () => {
    setStep("preview");
    setPreviewReady(false);
    setTimeout(() => {
      setPreviewReady(true);
    }, 2200);
  };

  const handleApprove = () => {
    setStep("size");
  };

  const handleGoOptions = () => {
    setStep("options");
  };

  const handleGoCheckout = () => {
    setStep("checkout");
  };

  const toggleOption = (k: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const handlePay = async () => {
    if (!rightsApproved || !email || submittingOrder) return;
    setSubmittingOrder(true);

    try {
      const orderData = {
        customerName: fullName,
        customerEmail: email,
        shippingAddress: {
          street: address,
          city,
          state: region,
          zip,
          country: "USA",
        },
        size: selectedSize,
        quantity: 1,
        options: {
          touchUp: options.touchup,
          customMessage: options.message,
          rushOrder: options.rush,
          proofRequest: options.proof,
        },
        originalImageUrl,
        subtotal,
        total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Order creation failed");
      }

      const data = await res.json();
      
      // Redirect to Stripe checkout page (or mock payment page)
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Failed to submit order. Please check connection.");
      setSubmittingOrder(false);
    }
  };

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "34px 24px 90px" }}>
      {/* TOOLBAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px", flexWrap: "wrap", marginBottom: "26px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
          <img src="/assets/cs-mark.png" alt="" style={{ height: "38px", width: "auto", display: "block" }} />
          <div>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "18px", letterSpacing: "-.02em", color: "#15243C", lineHeight: 1 }}>
              Cutout<span style={{ color: "#1D77F5" }}>Stuff</span>
            </div>
            <div style={{ font: "600 10.5px/1 'Plus Jakarta Sans'", letterSpacing: ".14em", textTransform: "uppercase", color: "#9aa0ab", marginTop: "5px" }}>
              Order intake flow · MVP
            </div>
          </div>
        </div>

        {/* STEPPER */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          {stepLabels.map((label, i) => {
            const st = ci > i ? "done" : ci === i ? "active" : "todo";
            const isLast = i === stepLabels.length - 1;
            
            let dotBg = "#fff";
            let dotColor = "#9aa0ab";
            let dotBorder = "1.5px solid #DCE3EC";
            let dotShadow = "none";
            let dotText = String(i + 1);
            let labelWeight = "500";
            let labelColor = "#9aa0ab";

            if (st === "done") {
              dotBg = "#1FA971";
              dotColor = "#fff";
              dotBorder = "none";
              dotText = "✓";
              labelWeight = "600";
              labelColor = "#15243C";
            } else if (st === "active") {
              dotBg = "#1D77F5";
              dotColor = "#fff";
              dotBorder = "none";
              dotShadow = "0 0 0 4px #D6E6FC";
              labelWeight = "700";
              labelColor = "#15243C";
            }

            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <div style={{ width: "30px", height: "2px", margin: "0 9px", borderRadius: "2px", background: ci >= i ? "#1FA971" : "#E3E7EE" }} />
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      font: "700 11px 'Plus Jakarta Sans'",
                      background: dotBg,
                      color: dotColor,
                      border: dotBorder,
                      boxShadow: dotShadow,
                    }}
                  >
                    {dotText}
                  </span>
                  <span style={{ font: `${labelWeight} 12.5px 'Plus Jakarta Sans'`, color: labelColor }}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RESTART */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleRestart}
            style={{ font: "600 13px 'Plus Jakarta Sans'", color: "#5B636E", background: "#fff", border: "1px solid #E3E7EE", borderRadius: "11px", padding: "8px 14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "7px" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Restart
          </button>
        </div>
      </div>

      {/* STAGE */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "880px", maxWidth: "94vw", background: "#fff", border: "1px solid #E3E7EE", borderRadius: "20px", overflow: "hidden", boxShadow: "0 40px 90px rgba(21,36,60,.16)" }}>
          <div style={{ background: "#FBF8F3", padding: "40px 40px 52px" }}>
            
            {/* 1. UPLOAD */}
            {step === "upload" && (
              <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "10px" }}>
                  Step 1 · Upload your photo
                </div>
                <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "30px", letterSpacing: "-.02em", margin: "0 0 8px", color: "#15243C" }}>
                  Start with one great photo.
                </h1>
                <p style={{ fontSize: "15px", lineHeight: "1.55", color: "#5B636E", marginBottom: "22px" }}>
                  Upload a clear, high-resolution image. We&rsquo;ll check it, prepare a cutout preview, and you approve before we ever print.
                </p>

                <div
                  onClick={handleTriggerUpload}
                  style={{ border: "2.5px dashed #C9D7EC", borderRadius: "18px", background: "#F6FAFF", padding: "40px 26px", textAlign: "center", cursor: "pointer", transition: "border-color .2s, background .2s" }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 16V4M12 4l-5 5M12 4l5 5" />
                      <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "20px", color: "#15243C" }}>
                    {uploading ? "Uploading..." : "Click to select your photo"}
                  </div>
                  <div style={{ fontSize: "13.5px", color: "#8a93a6", marginTop: "5px" }}>JPG, PNG, or WebP · up to 30 MB</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "14px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1FA971" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <span style={{ fontSize: "12.5px", color: "#6a7185" }}>Secure &amp; private — your photos are never shared.</span>
                </div>

                <div style={{ background: "#EAF3FF", border: "1px solid #CFE2FB", borderRadius: "14px", padding: "16px 18px", marginTop: "18px" }}>
                  <div style={{ font: "600 11px/1 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "7px" }}>
                    Our photo promise
                  </div>
                  <p style={{ fontSize: "13.5px", lineHeight: "1.6", color: "#2c3e5c", margin: 0 }}>
                    We don&rsquo;t change faces, bodies, or important details. We isolate the subject, add a clean white border, and prepare the file so it cuts cleanly.
                  </p>
                </div>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button onClick={startRejectDemo} style={{ font: "600 12.5px 'Plus Jakarta Sans'", color: "#9aa0ab", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    Demo: try a low-quality photo →
                  </button>
                </div>
              </div>
            )}

            {/* 2. ANALYZING */}
            {step === "analyzing" && (
              <div style={{ maxWidth: "440px", margin: "0 auto", padding: "46px 0", textAlign: "center" }}>
                <div style={{ position: "relative", width: "200px", margin: "0 auto 26px", background: "linear-gradient(177deg,#F3ECE0,#E7DCCB)", borderRadius: "16px", padding: "24px", display: "flex", justifyContent: "center", alignItems: "flex-end", height: "200px" }}>
                  {originalImageUrl && (
                    <img src={originalImageUrl} alt="Uploaded" style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "6px" }} />
                  )}
                  <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: "3px", background: "linear-gradient(90deg,transparent,#1D77F5,transparent)" }} />
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", border: "4px solid #EAF0F7", borderTopColor: "#1D77F5", margin: "0 auto 16px", animation: "spin .8s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "19px", color: "#15243C" }}>Checking your photo…</div>
                <div style={{ fontSize: "13.5px", color: "#5B636E", marginTop: "5px" }}>Resolution · sharpness · subject · lighting</div>
              </div>
            )}

            {/* 3. QUALITY CHECK RESULTS */}
            {step === "quality" && qualityResult === "good" && (
              <div style={{ maxWidth: "540px", margin: "0 auto" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "10px" }}>
                  Step 1 · Quality check
                </div>
                <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "28px", letterSpacing: "-.02em", margin: "0 0 18px", color: "#15243C" }}>
                  This photo works for a cutout.
                </h1>
                <div style={{ display: "flex", gap: "18px", alignItems: "center", background: "#F2FAF6", border: "1px solid #BFE8D4", borderRadius: "16px", padding: "18px" }}>
                  <div style={{ flexShrink: 0, background: "#fff", padding: "5px", borderRadius: "6px 6px 3px 3px" }}>
                    <img src={originalImageUrl} alt="Uploaded Preview" style={{ width: "78px", height: "104px", objectFit: "cover", borderRadius: "4px" }} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                      <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#1FA971", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>✓</span>
                      <span style={{ font: "700 15px 'Plus Jakarta Sans'", color: "#127a50" }}>Ready to prepare</span>
                    </div>
                    <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#5B636E" }}>{fileName} · {fileSizeStr}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", marginTop: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px 'Plus Jakarta Sans'", color: "#3c4658", background: "#fff", border: "1px solid #E3E7EE", borderRadius: "11px", padding: "11px 13px" }}>✓ Sharp &amp; in focus</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px 'Plus Jakarta Sans'", color: "#3c4658", background: "#fff", border: "1px solid #E3E7EE", borderRadius: "11px", padding: "11px 13px" }}>✓ Subject fully in frame</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px 'Plus Jakarta Sans'", color: "#3c4658", background: "#fff", border: "1px solid #E3E7EE", borderRadius: "11px", padding: "11px 13px" }}>✓ High resolution</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px 'Plus Jakarta Sans'", color: "#3c4658", background: "#fff", border: "1px solid #E3E7EE", borderRadius: "11px", padding: "11px 13px" }}>✓ Good lighting</div>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "22px" }}>
                  <button onClick={handleGoPreview} style={{ flex: 1, font: "700 15px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "13px", padding: "15px", cursor: "pointer", boxShadow: "0 8px 18px rgba(29,119,245,.24)" }}>
                    Continue to preview →
                  </button>
                  <button onClick={handleRestart} style={{ flex: "none", font: "700 15px 'Plus Jakarta Sans'", color: "#15243C", background: "#fff", border: "1.5px solid #DCE3EC", borderRadius: "13px", padding: "15px 20px", cursor: "pointer" }}>
                    Replace
                  </button>
                </div>
              </div>
            )}

            {step === "quality" && qualityResult === "reject" && (
              <div style={{ maxWidth: "520px", margin: "0 auto" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "10px" }}>
                  Step 1 · Quality check
                </div>
                <div style={{ background: "#FDECEC", border: "1px solid #F6C4C6", borderRadius: "16px", padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: "40px", height: "40px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#E5484D", fontWeight: "bold" }}>✗</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "21px", letterSpacing: "-.01em", color: "#b5292e", marginBottom: "6px" }}>
                      This photo is too small or blurry.
                    </div>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#7a4145", margin: 0 }}>
                      For a quality cutout we need a sharper, higher-resolution image. Please upload a better photo and we&rsquo;ll check it again.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginTop: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", font: "500 13px 'Plus Jakarta Sans'", color: "#5B636E" }}>✗ Resolution too low — 720×900 px</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", font: "500 13px 'Plus Jakarta Sans'", color: "#5B636E" }}>✗ Subject looks soft / out of focus</div>
                </div>
                <button onClick={handleRestart} style={{ width: "100%", font: "700 15px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "13px", padding: "15px", cursor: "pointer", marginTop: "22px", boxShadow: "0 8px 18px rgba(29,119,245,.24)" }}>
                  Upload a different photo
                </button>
              </div>
            )}

            {/* 4. PREVIEW */}
            {step === "preview" && !previewReady && (
              <div style={{ maxWidth: "460px", margin: "0 auto", padding: "34px 0", textAlign: "center" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "18px" }}>
                  Step 2 · Preparing your cutout
                </div>
                <div style={{ position: "relative", width: "200px", margin: "0 auto 24px", background: "linear-gradient(177deg,#F3ECE0,#E7DCCB)", borderRadius: "16px", padding: "22px", display: "flex", justifyContent: "center", alignItems: "flex-end", height: "220px", overflow: "hidden" }}>
                  <img src={originalImageUrl} alt="Original Upload" style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "6px" }} />
                </div>
                <div style={{ height: "8px", background: "#EAF0F7", borderRadius: "6px", overflow: "hidden", maxWidth: "260px", margin: "0 auto 18px" }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg, #1D77F5, #5DA0FF)", borderRadius: "6px", width: "70%" }}></div>
                </div>
                <div style={{ display: "inline-flex", flexDirection: "column", gap: "9px", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", font: "600 13.5px 'Plus Jakarta Sans'", color: "#127a50" }}>✓ Subject isolated</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", font: "600 13.5px 'Plus Jakarta Sans'", color: "#127a50" }}>✓ Background removed</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", font: "600 13.5px 'Plus Jakarta Sans'", color: "#5B636E" }}>Adding white border &amp; shadow...</div>
                </div>
              </div>
            )}

            {step === "preview" && previewReady && (
              <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "10px" }}>
                  Step 2 · Your cutout preview
                </div>
                <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "28px", letterSpacing: "-.02em", margin: "0 0 16px", color: "#15243C" }}>
                  Here&rsquo;s your cutout preview.
                </h1>
                <div style={{ background: "linear-gradient(177deg,#F3ECE0,#E7DCCB)", borderRadius: "18px", padding: "30px", display: "flex", justifyContent: "center", alignItems: "flex-end", height: "330px" }}>
                  <div style={{ position: "relative", background: "#fff", padding: "9px 9px 0", borderRadius: "9px 9px 4px 4px", filter: "drop-shadow(0 24px 20px rgba(21,36,60,.26))" }}>
                    <img src={originalImageUrl} alt="Prepared Cutout" style={{ width: "172px", height: "286px", objectFit: "contain", borderRadius: "4px" }} />
                    <div style={{ position: "absolute", inset: "4px 4px 0", border: "1.5px dashed #1D77F5", borderRadius: "7px", pointerEvents: "none" }} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "9px", background: "#E7F7EF", borderRadius: "12px", padding: "12px 15px", marginTop: "16px" }}>
                  ✓ <span style={{ font: "600 13px 'Plus Jakarta Sans'", color: "#127a50" }}>Subject isolated · clean white border · floor shadow added</span>
                </div>
                <p style={{ fontSize: "13.5px", lineHeight: "1.6", color: "#5B636E", marginTop: "14px" }}>
                  We keep the original details, clean up the shape, and add a border so it cuts cleanly. No facial or body changes.
                </p>
                <div style={{ display: "flex", gap: "12px", marginTop: "22px" }}>
                  <button onClick={handleApprove} style={{ flex: 1, font: "700 15.5px 'Plus Jakarta Sans'", color: "#fff", background: "#1FA971", border: "none", borderRadius: "13px", padding: "16px", cursor: "pointer", boxShadow: "0 8px 18px rgba(31,169,113,.26)" }}>
                    Approve preview
                  </button>
                  <button onClick={handleRestart} style={{ flex: "none", font: "700 15px 'Plus Jakarta Sans'", color: "#15243C", background: "#fff", border: "1.5px solid #DCE3EC", borderRadius: "13px", padding: "16px 20px", cursor: "pointer" }}>
                    Try a different photo
                  </button>
                </div>
              </div>
            )}

            {/* 5. SIZE */}
            {step === "size" && (
              <div style={{ maxWidth: "620px", margin: "0 auto" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "10px" }}>
                  Step 3 · Choose your size
                </div>
                <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "28px", letterSpacing: "-.02em", margin: "0 0 18px", color: "#15243C" }}>
                  How tall should it stand?
                </h1>

                {/* scale comparison */}
                <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "20px 24px 14px", marginBottom: "18px", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "30px", height: "180px", position: "relative" }}>
                  <div style={{ position: "absolute", left: "18px", right: "18px", bottom: "38px", borderTop: "1.5px dashed #DCE3EC" }}></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", zIndex: 1, opacity: selectedSize === "3ft" ? 1 : 0.5 }}>
                    <span style={{ fontSize: "24px" }}>🧍</span>
                    <span style={{ font: "600 11px 'Plus Jakarta Sans'", color: selectedSize === "3ft" ? "#1D77F5" : "#8a93a6" }}>3 ft</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", zIndex: 1, opacity: selectedSize === "5ft" ? 1 : 0.5 }}>
                    <span style={{ fontSize: "38px" }}>🧍</span>
                    <span style={{ font: "600 11px 'Plus Jakarta Sans'", color: selectedSize === "5ft" ? "#1D77F5" : "#8a93a6" }}>5 ft</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", zIndex: 1, opacity: selectedSize === "6ft" ? 1 : 0.5 }}>
                    <span style={{ fontSize: "48px" }}>🧍</span>
                    <span style={{ font: "700 11px 'Plus Jakarta Sans'", color: selectedSize === "6ft" ? "#1D77F5" : "#8a93a6" }}>6 ft</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {Object.entries(SIZES).map(([k, o]) => {
                    const sel = selectedSize === k;
                    return (
                      <div
                        key={k}
                        onClick={() => setSelectedSize(k as any)}
                        style={{
                          position: "relative",
                          borderRadius: "14px",
                          padding: "18px",
                          cursor: "pointer",
                          transition: ".15s",
                          border: sel ? "2px solid #1D77F5" : "1.5px solid #E3E7EE",
                          background: sel ? "#F4F9FF" : "#fff",
                          boxShadow: sel ? "0 8px 20px rgba(29,119,245,.12)" : "none",
                        }}
                      >
                        {sel && (
                          <span style={{ position: "absolute", top: "14px", right: "14px", width: "22px", height: "22px", borderRadius: "50%", background: "#1D77F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12l5 5L20 6" />
                            </svg>
                          </span>
                        )}
                        {o.tag && (
                          <span style={{ position: "absolute", top: "-10px", left: "18px", background: "#1D77F5", color: "#fff", font: "700 9.5px 'Plus Jakarta Sans'", letterSpacing: ".08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "20px" }}>
                            {o.tag}
                          </span>
                        )}
                        <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "18px", color: "#15243C" }}>{o.label}</div>
                        <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "4px" }}>{o.blurb}</div>
                        <div style={{ marginTop: "14px", font: "500 11.5px 'Plus Jakarta Sans'", color: "#8a93a6" }}>From</div>
                        <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "26px", letterSpacing: "-.02em", color: sel ? "#1D77F5" : "#15243C" }}>
                          ${o.price}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ background: "#15243C", borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", color: "#fff" }}>
                    <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 700, fontSize: "18px" }}>Custom Size</div>
                    <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#aeb8c8", marginTop: "4px" }}>Need something unique?</div>
                    <Link href="/support" style={{ marginTop: "auto", font: "700 13px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "10px", padding: "10px 14px", cursor: "pointer", alignSelf: "flex-start", display: "inline-block" }}>
                      Get a quote →
                    </Link>
                  </div>
                </div>
                <div style={{ font: "500 12px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "12px" }}>Prices shown + shipping, calculated at checkout.</div>
                <button onClick={handleGoOptions} style={{ width: "100%", font: "700 15.5px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "13px", padding: "16px", cursor: "pointer", marginTop: "18px", boxShadow: "0 8px 18px rgba(29,119,245,.24)" }}>
                  Continue
                </button>
              </div>
            )}

            {/* 6. OPTIONS */}
            {step === "options" && (
              <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "10px" }}>
                  Step 4 · Options
                </div>
                <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "28px", letterSpacing: "-.02em", margin: "0 0 6px", color: "#15243C" }}>
                  Add the extras you want.
                </h1>
                <p style={{ fontSize: "14.5px", color: "#5B636E", marginBottom: "20px" }}>
                  Every cutout includes a clean white border and a stand. These are optional.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {Object.entries(OPTS).map(([k, op]) => {
                    const on = options[k as keyof typeof options];
                    return (
                      <div
                        key={k}
                        onClick={() => toggleOption(k as keyof typeof options)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "13px",
                          padding: "14px 16px",
                          borderRadius: "13px",
                          cursor: "pointer",
                          transition: ".15s",
                          border: on ? "1.5px solid #1D77F5" : "1.5px solid #E3E7EE",
                          background: on ? "#F4F9FF" : "#fff",
                        }}
                      >
                        <span
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "6px",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: on ? "#1D77F5" : "#fff",
                            border: on ? "none" : "1.5px solid #CBD3DE",
                          }}
                        >
                          {on && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12l5 5L20 6" />
                            </svg>
                          )}
                        </span>
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ font: "700 14.5px 'Plus Jakarta Sans'", color: "#15243C" }}>{op.label}</div>
                          <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "2px" }}>{op.desc}</div>
                        </div>
                        <span style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C", flexShrink: 0 }}>
                          +${op.price}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: "18px", marginTop: "14px", padding: "0 2px" }}>
                  <span style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#127a50" }}>✓ Clean white border included</span>
                  <span style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#127a50" }}>✓ Stand included</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #E3E7EE", borderRadius: "14px", padding: "16px 20px", marginTop: "20px" }}>
                  <div>
                    <div style={{ font: "500 12px 'Plus Jakarta Sans'", color: "#8a93a6" }}>Subtotal · {sizeObj.label}</div>
                    <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "24px", color: "#15243C" }}>
                      ${subtotal.toFixed(2)}
                    </div>
                  </div>
                  <button onClick={handleGoCheckout} style={{ font: "700 15.5px 'Plus Jakarta Sans'", color: "#fff", background: "#1D77F5", border: "none", borderRadius: "13px", padding: "15px 28px", cursor: "pointer", boxShadow: "0 8px 18px rgba(29,119,245,.24)" }}>
                    Add to cart →
                  </button>
                </div>
              </div>
            )}

            {/* 7. CHECKOUT */}
            {step === "checkout" && (
              <div style={{ maxWidth: "840px", margin: "0 auto" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "14px" }}>
                  Step 5 · Secure checkout
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>
                  
                  {/* Summary Panel */}
                  <div style={{ flex: "1", minWidth: "260px", background: "#15243C", borderRadius: "18px", padding: "24px", color: "#fff" }}>
                    <div style={{ font: "600 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#7e90ad", marginBottom: "16px" }}>
                      Order summary
                    </div>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-end", marginBottom: "18px" }}>
                      {originalImageUrl && (
                        <div style={{ flexShrink: 0, background: "#fff", padding: "5px", borderRadius: "6px 6px 3px 3px" }}>
                          <img src={originalImageUrl} alt="Product" style={{ width: "60px", height: "88px", objectFit: "contain", borderRadius: "3px" }} />
                        </div>
                      )}
                      <div>
                        <div style={{ font: "700 15px 'Plus Jakarta Sans'" }}>Foam-board cutout</div>
                        <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#aeb8c8", marginTop: "3px" }}>{sizeObj.label} · Qty 1</div>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "9px", borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: "16px", font: "500 13.5px 'Plus Jakarta Sans'" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#aeb8c8" }}>{sizeObj.label}</span>
                        <span>${basePrice.toFixed(2)}</span>
                      </div>
                      {optKeys.map((k) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#aeb8c8" }}>{OPTS[k as keyof typeof OPTS].label}</span>
                          <span>+${OPTS[k as keyof typeof OPTS].price.toFixed(2)}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#aeb8c8" }}>Shipping</span>
                        <span>${SHIPPING_COST.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid rgba(255,255,255,.12)", marginTop: "14px", paddingTop: "14px" }}>
                      <span style={{ font: "700 15px 'Plus Jakarta Sans'" }}>Total</span>
                      <span style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "24px" }}>
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Form Panel */}
                  <div style={{ flex: "1.3", minWidth: "300px", background: "#fff", border: "1px solid #E3E7EE", borderRadius: "18px", padding: "24px" }}>
                    <div style={{ font: "600 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#8a93a6", marginBottom: "10px" }}>Contact</div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      style={{ width: "100%", fontSize: "14.5px", color: "#15243C", background: "#F8FAFC", border: "1.5px solid #E3E7EE", borderRadius: "11px", padding: "13px 15px", marginBottom: "18px" }}
                    />

                    <div style={{ font: "600 11px 'Plus Jakarta Sans'", letterSpacing: ".13em", textTransform: "uppercase", color: "#8a93a6", marginBottom: "10px" }}>Shipping address</div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      style={{ width: "100%", fontSize: "14.5px", color: "#15243C", background: "#F8FAFC", border: "1.5px solid #E3E7EE", borderRadius: "11px", padding: "13px 15px", marginBottom: "9px" }}
                    />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address"
                      style={{ width: "100%", fontSize: "14.5px", color: "#15243C", background: "#F8FAFC", border: "1.5px solid #E3E7EE", borderRadius: "11px", padding: "13px 15px", marginBottom: "9px" }}
                    />
                    <div style={{ display: "flex", gap: "9px", marginBottom: "18px" }}>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        style={{ flex: 2, minWidth: 0, fontSize: "14.5px", color: "#15243C", background: "#F8FAFC", border: "1.5px solid #E3E7EE", borderRadius: "11px", padding: "13px 15px" }}
                      />
                      <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        placeholder="State"
                        style={{ flex: 1, minWidth: 0, fontSize: "14.5px", color: "#15243C", background: "#F8FAFC", border: "1.5px solid #E3E7EE", borderRadius: "11px", padding: "13px 15px" }}
                      />
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="ZIP"
                        style={{ flex: 1, minWidth: 0, fontSize: "14.5px", color: "#15243C", background: "#F8FAFC", border: "1.5px solid #E3E7EE", borderRadius: "11px", padding: "13px 15px" }}
                      />
                    </div>

                    <label style={{ display: "flex", gap: "11px", alignItems: "flex-start", marginTop: "18px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={rightsApproved}
                        onChange={(e) => setRightsApproved(e.target.checked)}
                        style={{ width: "20px", height: "20px", flexShrink: 0, marginTop: "1px", accentColor: "#1D77F5", cursor: "pointer" }}
                      />
                      <span style={{ font: "500 13px/1.5 'Plus Jakarta Sans'", color: "#3c4658" }}>
                        I confirm that I own this image or have permission to use it.
                      </span>
                    </label>

                    <button
                      onClick={handlePay}
                      disabled={!rightsApproved || !email || submittingOrder}
                      style={{
                        width: "100%",
                        font: "700 16px 'Plus Jakarta Sans'",
                        border: "none",
                        borderRadius: "13px",
                        padding: "16px",
                        marginTop: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: (!rightsApproved || !email || submittingOrder) ? "#C2C9D4" : "#1D77F5",
                        color: "#fff",
                        cursor: (!rightsApproved || !email || submittingOrder) ? "not-allowed" : "pointer",
                        boxShadow: (!rightsApproved || !email || submittingOrder) ? "none" : "0 10px 22px rgba(29,119,245,.26)"
                      }}
                    >
                      {submittingOrder ? "Redirecting..." : (!rightsApproved || !email) ? "Confirm rights to pay" : `Pay $${total.toFixed(2)}`}
                    </button>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "12px", font: "500 11.5px 'Plus Jakarta Sans'", color: "#9aa0ab" }}>
                      🔒 Payments are secure &amp; encrypted
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
