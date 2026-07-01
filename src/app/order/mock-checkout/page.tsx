"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const sessionId = searchParams?.get("session_id") || "";
  const orderId = searchParams?.get("order_id") || "";

  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders?id=${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrderDetails(data))
        .catch((err) => console.error("Error fetching order details for checkout page", err));
    }
  }, [orderId]);

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, orderId }),
      });

      if (!res.ok) {
        throw new Error("Webhook simulation failed");
      }

      router.push(`/order/${orderId}/confirmation?session_id=${sessionId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to simulate payment webhook");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/create");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", padding: "20px" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "30px", maxWidth: "500px", width: "100%", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #e5e7eb", paddingBottom: "16px", marginBottom: "20px" }}>
          <span style={{ fontSize: "20px", fontWeight: "bold", color: "#6366f1" }}>stripe</span>
          <span style={{ color: "#9ca3af" }}>|</span>
          <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "600" }}>Mock Checkout Page</span>
        </div>

        {orderDetails ? (
          <div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Paying CutoutStuff</div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#111827", marginBottom: "20px" }}>
              ${orderDetails.total.toFixed(2)}
            </div>

            <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "14px", fontSize: "14px", color: "#374151", marginBottom: "24px" }}>
              <div style={{ marginBottom: "6px" }}><strong>Order ID:</strong> {orderId}</div>
              <div style={{ marginBottom: "6px" }}><strong>Customer:</strong> {orderDetails.customerName} ({orderDetails.customerEmail})</div>
              <div><strong>Item:</strong> Custom Cutout ({orderDetails.size})</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "14px", color: "#6b7280", padding: "20px 0", textAlign: "center" }}>Loading order details...</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handlePaymentSuccess}
            disabled={loading}
            style={{ width: "100%", background: "#6366f1", color: "#fff", border: "none", borderRadius: "10px", padding: "14px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.2)" }}
          >
            {loading ? "Processing..." : "Simulate Payment Success"}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            style={{ width: "100%", background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
          >
            Cancel and Return
          </button>
        </div>

        <div style={{ marginTop: "24px", fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
          This is a simulated checkout page because <code>USE_LOCAL_MOCKS=true</code> is enabled.
        </div>
      </div>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
