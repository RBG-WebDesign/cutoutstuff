import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

interface ConfirmationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;
  const orderId = id.toUpperCase();

  // Fetch order from SQLite database
  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    notFound();
  }

  // Parse JSON data
  const addressObj = JSON.parse(order.shippingAddress);
  const optionsObj = JSON.parse(order.options);

  const addressString = `${addressObj.street}, ${addressObj.city}, ${addressObj.state} ${addressObj.zip}, ${addressObj.country}`;
  
  const selectedOptionsKeys = Object.keys(optionsObj).filter((k) => optionsObj[k]);
  const optionsMapping: Record<string, string> = {
    touchUp: "Touch-up service",
    customMessage: "Custom message",
    rushOrder: "Rush production",
    proofRequest: "Digital proof",
  };
  const optionsStr = selectedOptionsKeys.length
    ? selectedOptionsKeys.map((k) => optionsMapping[k] || k).join(", ")
    : "Standard finish";

  const isRush = optionsObj.rushOrder;
  const prodTime = isRush ? "1–2 business days" : "3–5 business days";

  const sizeLabels: Record<string, string> = {
    "3ft": "3 ft tall",
    "5ft": "5 ft tall",
    "6ft": "6 ft tall",
  };
  const sizeLabel = sizeLabels[order.size] || order.size;

  const steps = [
    { n: "1", title: "We review", body: "A person checks your photo and prepares the cutout file.", bg: "#EAF3FF", fg: "#1d5cc4" },
    { n: "2", title: "Paid & secure", body: "Payment processed successfully — we'll contact you if anything needs attention.", bg: "#EAF3FF", fg: "#1d5cc4" },
    { n: "3", title: "We produce", body: "Your cutout is printed and cut on rigid foam-board.", bg: "#FEF6E6", fg: "#9a7212" },
    { n: "4", title: "We ship", body: "Packed carefully and shipped — tracking arrives by email.", bg: "#E7F7EF", fg: "#127a50" },
  ];

  return (
    <div style={{ minHeight: "920px", background: "#FBF8F3" }}>
      {/* header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EEF1F5" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
              <img src="/assets/cs-mark.png" alt="" style={{ height: "32px", width: "auto", display: "block" }} />
              <span style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "18px", letterSpacing: "-.02em", color: "#15243C" }}>
                Cutout<span style={{ color: "#1D77F5" }}>Stuff</span>
              </span>
            </Link>
          </div>
          <span style={{ font: "600 12.5px 'Plus Jakarta Sans'", color: "#5B636E", display: "flex", alignItems: "center", gap: "7px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1FA971" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16v12H4z" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            A receipt is on its way to your inbox
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 28px 90px" }}>
        {/* hero */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span style={{ display: "inline-flex", width: "72px", height: "72px", borderRadius: "50%", background: "#E7F7EF", alignItems: "center", justifyContent: "center" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1FA971" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 6" />
            </svg>
          </span>
          <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "36px", letterSpacing: "-.025em", margin: "18px 0 0" }}>
            Order received.
          </h1>
          <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#5B636E", margin: "12px auto 0", maxWidth: "46ch" }}>
            We&rsquo;re preparing your file for production. We review every order by hand &mdash; if anything needs attention, we&rsquo;ll email you before we print.
          </p>
        </div>

        {/* order card */}
        <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "20px", overflow: "hidden", boxShadow: "0 14px 34px rgba(21,36,60,.07)" }}>
          {/* top strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", padding: "20px 26px", background: "#F6FAFF", borderBottom: "1px solid #E9EDF3" }}>
            <div>
              <div style={{ font: "500 11.5px 'Plus Jakarta Sans'", letterSpacing: ".04em", textTransform: "uppercase", color: "#8a93a6" }}>Order number</div>
              <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "24px", letterSpacing: "-.01em", color: "#15243C", marginTop: "2px" }}>
                {order.id}
              </div>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#EAF3FF", border: "1px solid #CFE2FB", borderRadius: "30px", padding: "8px 15px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1D77F5" }}></span>
              <span style={{ font: "700 12.5px 'Plus Jakarta Sans'", color: "#1d5cc4" }}>In review &amp; prep</span>
            </span>
          </div>

          {/* body: preview + rows */}
          <div style={{ display: "flex", gap: "26px", padding: "26px", flexWrap: "wrap" }}>
            {/* preview */}
            <div style={{ flexShrink: 0, width: "170px", background: "linear-gradient(177deg,#F3ECE0,#E7DCCB)", borderRadius: "14px", padding: "18px", display: "flex", justifyContent: "center", alignItems: "flex-end", height: "230px" }}>
              <div style={{ background: "#fff", padding: "7px 7px 0", borderRadius: "7px 7px 3px 3px", filter: "drop-shadow(0 16px 16px rgba(21,36,60,.2))" }}>
                <img src={order.originalImageUrl} alt="Product Cutout" style={{ width: "108px", height: "168px", objectFit: "contain", borderRadius: "3px" }} />
              </div>
            </div>
            {/* rows */}
            <div style={{ flex: 1, minWidth: "240px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F0EDE6" }}>
                <span style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6" }}>Product</span>
                <span style={{ font: "600 13.5px 'Plus Jakarta Sans'", color: "#15243C" }}>Foam-board cutout</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F0EDE6" }}>
                <span style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6" }}>Size</span>
                <span style={{ font: "600 13.5px 'Plus Jakarta Sans'", color: "#15243C" }}>{sizeLabel}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F0EDE6" }}>
                <span style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6" }}>Quantity</span>
                <span style={{ font: "600 13.5px 'Plus Jakarta Sans'", color: "#15243C" }}>{order.quantity}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F0EDE6", gap: "20px" }}>
                <span style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6", flexShrink: 0 }}>Options</span>
                <span style={{ font: "600 13.5px 'Plus Jakarta Sans'", color: "#15243C", textAlign: "right" }}>{optionsStr}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
                <span style={{ font: "700 14.5px 'Plus Jakarta Sans'", color: "#15243C" }}>Total paid</span>
                <span style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "19px", color: "#15243C" }}>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* ship + eta */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #F0EDE6" }}>
            <div style={{ padding: "20px 26px", borderRight: "1px solid #F0EDE6" }}>
              <div style={{ font: "500 11.5px 'Plus Jakarta Sans'", letterSpacing: ".04em", textTransform: "uppercase", color: "#8a93a6", marginBottom: "8px" }}>Shipping to</div>
              <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C", marginBottom: "3px" }}>{order.customerName}</div>
              <div style={{ font: "500 13px/1.6 'Plus Jakarta Sans'", color: "#5B636E" }}>{addressString}</div>
            </div>
            <div style={{ padding: "20px 26px" }}>
              <div style={{ font: "500 11.5px 'Plus Jakarta Sans'", letterSpacing: ".04em", textTransform: "uppercase", color: "#8a93a6", marginBottom: "8px" }}>Estimated production</div>
              <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {prodTime}
              </div>
              <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "5px" }}>Then ships via ground &middot; tracking by email</div>
            </div>
          </div>
        </div>

        {/* what happens next */}
        <div style={{ marginTop: "30px" }}>
          <div style={{ font: "700 12px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#1D77F5", marginBottom: "16px" }}>What happens next</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {steps.map((st, idx) => (
              <div key={idx} style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "14px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "9px" }}>
                  <span style={{ width: "26px", height: "26px", borderRadius: "8px", background: st.bg, color: st.fg, fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {st.n}
                  </span>
                  <span style={{ font: "700 13px 'Plus Jakarta Sans'", color: "#15243C" }}>{st.title}</span>
                </div>
                <div style={{ font: "500 12.5px/1.55 'Plus Jakarta Sans'", color: "#8a93a6" }}>{st.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* support */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", background: "#15243C", borderRadius: "16px", padding: "20px 24px", marginTop: "26px" }}>
          <div>
            <div style={{ font: "700 14.5px 'Plus Jakarta Sans'", color: "#fff" }}>Questions about your order?</div>
            <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#aeb8c8", marginTop: "3px" }}>Reply to your confirmation email, or reach us anytime.</div>
          </div>
          <a href="mailto:help@cutoutstuff.com" style={{ display: "inline-flex", alignItems: "center", gap: "8px", font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C", background: "#fff", borderRadius: "11px", padding: "11px 18px", textDecoration: "none" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15243C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16v12H4z" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            help@cutoutstuff.com
          </a>
        </div>

        {/* return */}
        <div style={{ textAlign: "center", marginTop: "26px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", font: "700 14px 'Plus Jakarta Sans'", color: "#1D77F5", textDecoration: "none" }}>
            Back to CutoutStuff
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D77F5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
