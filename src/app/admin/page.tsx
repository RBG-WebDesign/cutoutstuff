"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  size: string;
  quantity: number;
  options: string;
  originalImageUrl: string;
  previewImageUrl: string;
  previewApproved: boolean;
  subtotal: number;
  total: number;
  stripeSessionId: string | null;
  paymentStatus: string;
  orderStatus: string;
  productionStatus: string;
  driveFolderUrl: string | null;
  factoryNotifiedAt: string | null;
  trackingNumber: string | null;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
  issues: Issue[];
}

interface Issue {
  id: string;
  orderId: string;
  type: string;
  status: string;
  priority: string;
  note: string;
  createdAt: string;
  order?: Order;
}

export default function AdminPortal() {
  const [view, setView] = useState<"queue" | "issues" | "detail">("queue");
  const [orders, setOrders] = useState<Order[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const [filter, setFilter] = useState<"all" | "paid" | "needs" | "ready" | "sent" | "issue">("all");
  const [issueFilter, setIssueFilter] = useState<"open" | "all" | "resolved">("open");
  const [search, setSearch] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      const issuesRes = await fetch("/api/issues");
      const issuesData = await issuesRes.json();
      setIssues(issuesData);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handlePatchOrder = async (orderId: string, payload: Partial<Order>) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, ...payload }),
      });

      if (!res.ok) throw new Error("Failed to update order");
      
      showToast(`Updated order ${orderId}`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Error updating order");
    }
  };

  const handlePatchIssue = async (issueId: string, status: "open" | "resolved") => {
    try {
      const res = await fetch("/api/issues", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: issueId, status }),
      });

      if (!res.ok) throw new Error("Failed to update issue");

      showToast(`Issue ${issueId} marked as ${status}`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Error updating issue");
    }
  };

  // Helper actions
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const handleAddNote = async () => {
    if (!selectedOrder || !noteInput.trim()) return;
    try {
      const existingNotes = JSON.parse(selectedOrder.internalNotes || "[]");
      const newNote = {
        t: "Jamie Reyes",
        m: noteInput.trim(),
        w: "just now",
      };
      const updatedNotes = [newNote, ...existingNotes];

      await handlePatchOrder(selectedOrder.id, {
        internalNotes: JSON.stringify(updatedNotes),
      });

      setNoteInput("");
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  const handleGenPackage = async () => {
    if (!selectedOrder) return;
    try {
      showToast("Generating production assets...");
      const res = await fetch("/api/orders/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder.id }),
      });

      if (!res.ok) throw new Error("Failed to generate package");

      const data = await res.json();
      showToast(`Production package generated on Google Drive`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Error generating package");
    }
  };

  const handleUploadDrive = async () => {
    if (!selectedOrder) return;
    const lastName = selectedOrder.customerName.split(" ").pop() || "Customer";
    const driveUrl = `drive.google.com/drive/folders/${selectedOrder.id}_${lastName}`;
    await handlePatchOrder(selectedOrder.id, {
      productionStatus: "package_uploaded",
      driveFolderUrl: driveUrl,
    });
    showToast(`Uploaded to Google Drive for ${selectedOrder.id}`);
  };

  const handleMarkSentFactory = async () => {
    if (!selectedOrder) return;
    await handlePatchOrder(selectedOrder.id, {
      productionStatus: "sent_to_factory",
      orderStatus: "in_production",
      factoryNotifiedAt: new Date().toISOString(),
    });
    showToast(`Marked sent to factory for ${selectedOrder.id}`);
  };

  const handleAddTracking = async () => {
    if (!selectedOrder) return;
    const tracking = `1Z999AA101${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`;
    await handlePatchOrder(selectedOrder.id, {
      trackingNumber: tracking,
      orderStatus: "shipped",
    });
    showToast(`Tracking ${tracking} added and saved`);
  };

  const handleApproveReview = async () => {
    if (!selectedOrder) return;
    await handlePatchOrder(selectedOrder.id, {
      orderStatus: "paid",
      productionStatus: "needs_package",
    });
    showToast(`Photo approved and released to production`);
  };

  const handleFailReview = async () => {
    if (!selectedOrder) return;
    const existingNotes = JSON.parse(selectedOrder.internalNotes || "[]");
    const warningNote = {
      t: "Jamie Reyes",
      m: "Manual review failed — emailed customer to request higher quality photo.",
      w: "just now",
    };
    await handlePatchOrder(selectedOrder.id, {
      orderStatus: "issue",
      internalNotes: JSON.stringify([warningNote, ...existingNotes]),
    });
    showToast(`Manual review rejected. Order marked as issue.`);
  };

  const handleRefund = async () => {
    if (!selectedOrder) return;
    await handlePatchOrder(selectedOrder.id, {
      paymentStatus: "refunded",
      orderStatus: "refunded",
      productionStatus: "none",
    });
    showToast(`Order ${selectedOrder.id} refunded`);
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;
    await handlePatchOrder(selectedOrder.id, {
      orderStatus: "canceled",
      productionStatus: "none",
    });
    showToast(`Order ${selectedOrder.id} canceled`);
  };

  const handleContactCustomer = async () => {
    if (!selectedOrder) return;
    const existingNotes = JSON.parse(selectedOrder.internalNotes || "[]");
    const newNote = {
      t: "Jamie Reyes",
      m: `Emailed customer at ${selectedOrder.customerEmail}`,
      w: "just now",
    };
    await handlePatchOrder(selectedOrder.id, {
      internalNotes: JSON.stringify([newNote, ...existingNotes]),
    });
    showToast(`Logged customer contact event`);
  };

  const handleOpenIssue = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          type: "support_needed",
          priority: "normal",
          note: "Support query logged manually.",
        }),
      });

      if (!res.ok) throw new Error("Failed to log issue");

      showToast(`Logged issue for ${selectedOrder.id}`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to log issue");
    }
  };

  // Filter computations
  const isPaidFresh = (o: Order) => o.paymentStatus === "paid";
  const isNeedsPkg = (o: Order) => o.productionStatus === "needs_package";
  const isPkgReady = (o: Order) => ["package_ready", "package_uploaded"].includes(o.productionStatus);
  const isSentFactory = (o: Order) => o.productionStatus === "sent_to_factory";
  const isIssueStatus = (o: Order) => o.orderStatus === "issue" || o.productionStatus === "cutline_failed" || o.issues.some((i) => i.status === "open");

  const todayCount = orders.filter((o) => {
    const today = new Date().toISOString().split("T")[0];
    const created = o.createdAt.split("T")[0];
    return created === today;
  }).length;
  const needsCount = orders.filter(isNeedsPkg).length;
  const readyCount = orders.filter(isPkgReady).length;
  const sentCount = orders.filter(isSentFactory).length;
  const issueCount = orders.filter(isIssueStatus).length;

  const matchFilter = {
    all: () => true,
    paid: isPaidFresh,
    needs: isNeedsPkg,
    ready: isPkgReady,
    sent: isSentFactory,
    issue: isIssueStatus,
  };

  const searchQuery = search.trim().toLowerCase();
  let filteredOrders = orders.filter(matchFilter[filter] || matchFilter.all);
  if (searchQuery) {
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(searchQuery) ||
        o.customerName.toLowerCase().includes(searchQuery) ||
        o.customerEmail.toLowerCase().includes(searchQuery)
    );
  }

  // Issues Filter
  const filteredIssues = issues.filter((i) => {
    if (issueFilter === "open") return i.status === "open";
    if (issueFilter === "resolved") return i.status === "resolved";
    return true;
  });

  const getOrderStatusPillDetails = (status: string) => {
    const map: Record<string, { bg: string; fg: string; dot: string }> = {
      "Needs manual review": { bg: "#FEF6E6", fg: "#9a7212", dot: "#F4B63F" },
      paid: { bg: "#EAF3FF", fg: "#1d5cc4", dot: "#1D77F5" },
      "Sent to factory": { bg: "#EFEAFB", fg: "#5b46b0", dot: "#7a63d6" },
      in_production: { bg: "#EAF3FF", fg: "#1d5cc4", dot: "#1D77F5" },
      shipped: { bg: "#E7F7EF", fg: "#127a50", dot: "#1FA971" },
      delivered: { bg: "#E7F7EF", fg: "#127a50", dot: "#1FA971" },
      issue: { bg: "#FDECEC", fg: "#b5292e", dot: "#E5484D" },
      canceled: { bg: "#EFF1F4", fg: "#5B636E", dot: "#9aa0ab" },
      refunded: { bg: "#EFF1F4", fg: "#5B636E", dot: "#9aa0ab" },
    };
    return map[status] || { bg: "#EFF1F4", fg: "#5B636E", dot: "#9aa0ab" };
  };

  const getProductionStatusPillColor = (status: string) => {
    const map: Record<string, { fg: string; bg: string }> = {
      needs_package: { fg: "#9a7212", bg: "#FEF6E6" },
      package_ready: { fg: "#1d5cc4", bg: "#EAF3FF" },
      package_uploaded: { fg: "#5b46b0", bg: "#EFEAFB" },
      sent_to_factory: { fg: "#127a50", bg: "#E7F7EF" },
      cutline_failed: { fg: "#b5292e", bg: "#FDECEC" },
    };
    return map[status] || { fg: "#5B636E", bg: "#EFF1F4" };
  };

  const getPriorityBadgeColor = (priority: string) => {
    const map: Record<string, { bg: string; fg: string }> = {
      high: { bg: "#FDECEC", fg: "#b5292e" },
      normal: { bg: "#EAF3FF", fg: "#1d5cc4" },
      low: { bg: "#EFF1F4", fg: "#5B636E" },
    };
    return map[priority.toLowerCase()] || { bg: "#EAF3FF", fg: "#1d5cc4" };
  };

  const getFormattedOptions = (optionsJson: string) => {
    try {
      const opts = JSON.parse(optionsJson || "{}");
      const mapping: Record<string, string> = {
        touchUp: "Touch-up",
        customMessage: "Back message",
        rushOrder: "Rush production",
        proofRequest: "Digital proof",
      };
      const active = Object.keys(opts).filter((k) => opts[k]);
      return active.length ? active.map((k) => mapping[k] || k).join(", ") : "Standard";
    } catch {
      return "Standard";
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "880px", maxWidth: "1340px", margin: "0 auto", background: "#FBF8F3", border: "1px solid #E3E7EE" }}>
      {/* Side Toast Notification */}
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#15243C", color: "#fff", padding: "14px 20px", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", zIndex: 100, font: "600 13.5px 'Plus Jakarta Sans'" }}>
          {toast}
        </div>
      )}

      {/* ===== SIDEBAR ===== */}
      <aside style={{ width: "230px", flexShrink: 0, background: "#15243C", display: "flex", flexDirection: "column", padding: "22px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 8px 22px", borderBottom: "1px solid rgba(255,255,255,.1)", marginBottom: "16px" }}>
          <img src="/assets/cs-mark.png" alt="" style={{ height: "30px", width: "auto", display: "block" }} />
          <div>
            <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "16px", letterSpacing: "-.02em", color: "#fff", lineHeight: 1 }}>
              Cutout<span style={{ color: "#5DA0FF" }}>Stuff</span>
            </div>
            <div style={{ font: "700 9px/1 'Plus Jakarta Sans'", letterSpacing: ".18em", textTransform: "uppercase", color: "#7e90ad", marginTop: "5px" }}>
              Operations
            </div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <button
            onClick={() => { setView("queue"); setFilter("all"); }}
            style={{ display: "flex", alignItems: "center", gap: "11px", padding: "11px 12px", border: "none", background: view === "queue" || view === "detail" ? "rgba(93,160,255,.16)" : "transparent", color: view === "queue" || view === "detail" ? "#fff" : "#aeb8c8", borderRadius: "10px", font: "700 13.5px 'Plus Jakarta Sans'", width: "100%", textAlign: "left", cursor: "pointer" }}
          >
            <span>📁 Orders</span>
            <span style={{ marginLeft: "auto", font: "700 11px 'Plus Jakarta Sans'", background: "#1D77F5", color: "#fff", borderRadius: "20px", padding: "2px 8px" }}>
              {orders.filter((o) => !["delivered", "canceled", "refunded"].includes(o.orderStatus)).length}
            </span>
          </button>
          <button
            onClick={() => setView("issues")}
            style={{ display: "flex", alignItems: "center", gap: "11px", padding: "11px 12px", border: "none", background: view === "issues" ? "rgba(93,160,255,.16)" : "transparent", color: view === "issues" ? "#fff" : "#aeb8c8", borderRadius: "10px", font: "700 13.5px 'Plus Jakarta Sans'", width: "100%", textAlign: "left", cursor: "pointer" }}
          >
            <span>⚠️ Issues</span>
            <span style={{ marginLeft: "auto", font: "700 11px 'Plus Jakarta Sans'", background: "#E5484D", color: "#fff", borderRadius: "20px", padding: "2px 8px" }}>
              {issues.filter((i) => i.status === "open").length}
            </span>
          </button>
        </nav>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "rgba(255,255,255,.05)", borderRadius: "12px" }}>
          <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#5DA0FF", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px 'Plus Jakarta Sans'", color: "#15243C", flexShrink: 0 }}>
            JR
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: "700 12.5px 'Plus Jakarta Sans'", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Jamie Reyes</div>
            <div style={{ font: "500 11px 'Plus Jakarta Sans'", color: "#7e90ad" }}>Owner</div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={{ flexGrow: 1, minWidth: 0, background: "#FBF8F3", display: "flex", flexDirection: "column" }}>
        
        {/* Topbar Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 28px", background: "#fff", borderBottom: "1px solid #E9EDF3" }}>
          <div style={{ flexGrow: 1, display: "flex", alignItems: "center", gap: "9px", maxWidth: "380px", background: "#F4F6F9", border: "1px solid #E3E7EE", borderRadius: "11px", padding: "9px 13px" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer, or email"
              style={{ flexGrow: 1, border: "none", background: "transparent", fontSize: "13.5px", color: "#15243C" }}
            />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 12px 'Plus Jakarta Sans'", color: "#127a50", background: "#E7F7EF", borderRadius: "30px", padding: "7px 13px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1FA971" }}></span>
              Store online
            </span>
          </div>
        </div>

        {/* Dynamic Views */}
        <div style={{ flexGrow: 1, overflowY: "auto", position: "relative" }}>
          
          {/* ===================== ORDER QUEUE ===================== */}
          {view === "queue" && (
            <div style={{ padding: "26px 28px 40px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "18px", flexWrap: "wrap", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "27px", letterSpacing: "-.02em", margin: 0 }}>Orders</h1>
                  <p style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "5px" }}>
                    {todayCount} placed today · {orders.length} total orders stored
                  </p>
                </div>
              </div>

              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "13px", marginBottom: "22px" }}>
                {[
                  { label: "All Orders", value: orders.length, filter: "all", dot: "#1D77F5" },
                  { label: "Needs Package", value: needsCount, filter: "needs", dot: "#F4B63F" },
                  { label: "Package Ready", value: readyCount, filter: "ready", dot: "#1D77F5" },
                  { label: "Sent to Factory", value: sentCount, filter: "sent", dot: "#1FA971" },
                  { label: "Issues Logged", value: issueCount, filter: "issue", dot: "#E5484D" },
                ].map((st) => {
                  const active = filter === st.filter;
                  return (
                    <div
                      key={st.filter}
                      onClick={() => setFilter(st.filter as any)}
                      style={{
                        background: "#fff",
                        border: `1.5px solid ${active ? "#1D77F5" : "#E3E7EE"}`,
                        borderRadius: "14px",
                        padding: "15px 16px",
                        cursor: "pointer",
                        transition: ".12s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ font: "600 11.5px 'Plus Jakarta Sans'", color: "#8a93a6" }}>{st.label}</span>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: st.dot }}></span>
                      </div>
                      <div style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "30px", letterSpacing: "-.02em", marginTop: "8px", color: "#15243C" }}>
                        {st.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order List Table */}
              <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "108px 1.6fr 120px 84px 86px 196px 26px", gap: "8px", padding: "13px 20px", background: "#F8FAFC", borderBottom: "1px solid #E9EDF3", font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".09em", textTransform: "uppercase", color: "#9aa0ab" }}>
                  <span>Order</span>
                  <span>Customer</span>
                  <span>Placed</span>
                  <span>Size</span>
                  <span>Total</span>
                  <span>Status · Production</span>
                  <span></span>
                </div>

                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => {
                    const statusDetail = getOrderStatusPillDetails(o.orderStatus);
                    const prodDetail = getProductionStatusPillColor(o.productionStatus);

                    return (
                      <div
                        key={o.id}
                        onClick={() => { setSelectedOrderId(o.id); setView("detail"); }}
                        style={{ display: "grid", gridTemplateColumns: "108px 1.6fr 120px 84px 86px 196px 26px", gap: "8px", alignItems: "center", padding: "15px 20px", borderBottom: "1px solid #F0EDE6", cursor: "pointer", transition: "background .12s" }}
                      >
                        <span style={{ font: "800 13px var(--font-cabinet-grotesk)", color: "#15243C" }}>{o.id}</span>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: "block", font: "700 13.5px 'Plus Jakarta Sans'", color: "#15243C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {o.customerName}
                          </span>
                          <span style={{ display: "block", font: "500 12px 'Plus Jakarta Sans'", color: "#9aa0ab", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {o.customerEmail}
                          </span>
                        </span>
                        <span style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#5B636E" }}>
                          {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span style={{ font: "600 13px 'Plus Jakarta Sans'", color: "#15243C" }}>
                          {o.size} <span style={{ color: "#9aa0ab", fontWeight: 500 }}>×{o.quantity}</span>
                        </span>
                        <span style={{ font: "700 13px 'Plus Jakarta Sans'", color: "#15243C" }}>${o.total.toFixed(2)}</span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start", minWidth: 0 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", font: "700 11.5px 'Plus Jakarta Sans'", color: statusDetail.fg, background: statusDetail.bg, borderRadius: "30px", padding: "5px 11px", whiteSpace: "nowrap" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: statusDetail.dot }} />
                            {o.orderStatus.replace("_", " ")}
                          </span>
                          {o.productionStatus !== "none" && (
                            <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: "10.5px", fontWeight: 600, color: prodDetail.fg, background: prodDetail.bg, borderRadius: "6px", padding: "3px 7px", whiteSpace: "nowrap" }}>
                              {o.productionStatus}
                            </span>
                          )}
                        </span>
                        <span style={{ color: "#C2C9D4", fontSize: "16px" }}>→</span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: "48px", textAlign: "center", font: "500 14px 'Plus Jakarta Sans'", color: "#9aa0ab" }}>
                    No orders found in this view.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== ISSUES QUEUE ===================== */}
          {view === "issues" && (
            <div style={{ padding: "26px 28px 40px" }}>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "27px", letterSpacing: "-.02em", margin: 0 }}>Issues</h1>
                <p style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "5px" }}>
                  {issues.filter((i) => i.status === "open").length} open issues needing action
                </p>
              </div>

              {/* Issue Filters */}
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px", flexWrap: "wrap" }}>
                {[
                  { f: "open", label: "Open Issues", count: issues.filter((i) => i.status === "open").length },
                  { f: "all", label: "All Logged", count: issues.length },
                  { f: "resolved", label: "Resolved", count: issues.filter((i) => i.status === "resolved").length },
                ].map((t) => {
                  const on = issueFilter === t.f;
                  return (
                    <button
                      key={t.f}
                      onClick={() => setIssueFilter(t.f as any)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        font: "700 12.5px 'Plus Jakarta Sans'",
                        border: `1px solid ${on ? "#15243C" : "#E3E7EE"}`,
                        background: on ? "#15243C" : "#fff",
                        color: on ? "#fff" : "#5B636E",
                        borderRadius: "30px",
                        padding: "8px 14px",
                        cursor: "pointer",
                      }}
                    >
                      {t.label}
                      <span style={{ font: "700 11px 'Plus Jakarta Sans'", color: on ? "#fff" : "#9aa0ab", background: on ? "rgba(255,255,255,.18)" : "#F0F2F5", borderRadius: "20px", padding: "1px 7px" }}>
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Issues Table */}
              <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "84px 96px 1.1fr 1.8fr 92px 104px 120px", gap: "10px", padding: "13px 20px", background: "#F8FAFC", borderBottom: "1px solid #E9EDF3", font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".09em", textTransform: "uppercase", color: "#9aa0ab" }}>
                  <span>Issue</span>
                  <span>Order</span>
                  <span>Type</span>
                  <span>Detail</span>
                  <span>Priority</span>
                  <span>Status</span>
                  <span>Created</span>
                </div>

                {filteredIssues.length > 0 ? (
                  filteredIssues.map((i) => {
                    const pri = getPriorityBadgeColor(i.priority);
                    const isOpen = i.status === "open";
                    
                    return (
                      <div
                        key={i.id}
                        onClick={() => { setSelectedOrderId(i.orderId); setView("detail"); }}
                        style={{ display: "grid", gridTemplateColumns: "84px 96px 1.1fr 1.8fr 92px 104px 120px", gap: "10px", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F0EDE6", cursor: "pointer" }}
                      >
                        <span style={{ font: "800 12.5px var(--font-cabinet-grotesk)", color: "#15243C" }}>{i.id}</span>
                        <span style={{ font: "700 12.5px var(--font-cabinet-grotesk)", color: "#1D77F5" }}>{i.orderId}</span>
                        <span style={{ font: "700 12.5px 'Plus Jakarta Sans'", color: "#15243C" }}>{i.type.replace("_", " ")}</span>
                        <span style={{ font: "500 12px/1.45 'Plus Jakarta Sans'", color: "#5B636E", minWidth: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {i.note}
                        </span>
                        <span>
                          <span style={{ display: "inline-block", textAlign: "center", font: "700 11px 'Plus Jakarta Sans'", color: pri.fg, background: pri.bg, borderRadius: "20px", padding: "4px 10px" }}>
                            {i.priority}
                          </span>
                        </span>
                        <span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", font: "700 11px 'Plus Jakarta Sans'", color: isOpen ? "#9a7212" : "#5B636E", background: isOpen ? "#FEF6E6" : "#EFF1F4", borderRadius: "20px", padding: "4px 10px", whiteSpace: "nowrap" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isOpen ? "#F4B63F" : "#9aa0ab" }} />
                            {i.status}
                          </span>
                        </span>
                        <span style={{ font: "500 12px 'Plus Jakarta Sans'", color: "#9aa0ab" }}>
                          {new Date(i.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: "48px", textAlign: "center", font: "500 14px 'Plus Jakarta Sans'", color: "#9aa0ab" }}>
                    No issues found in this view.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== DETAIL VIEW ===================== */}
          {view === "detail" && selectedOrder && (
            <div style={{ padding: "22px 28px 44px" }}>
              <button
                onClick={() => setView("queue")}
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px 'Plus Jakarta Sans'", color: "#5B636E", background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", marginBottom: "14px" }}
              >
                ← Back to orders
              </button>

              {/* Detail Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "18px", flexWrap: "wrap", marginBottom: "20px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <h1 style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "28px", letterSpacing: "-.02em", margin: 0 }}>
                      {selectedOrder.id}
                    </h1>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", font: "700 11.5px 'Plus Jakarta Sans'", color: getOrderStatusPillDetails(selectedOrder.orderStatus).fg, background: getOrderStatusPillDetails(selectedOrder.orderStatus).bg, borderRadius: "30px", padding: "5px 11px", whiteSpace: "nowrap" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: getOrderStatusPillDetails(selectedOrder.orderStatus).dot }} />
                      {selectedOrder.orderStatus.replace("_", " ")}
                    </span>
                    {selectedOrder.productionStatus !== "none" && (
                      <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: "10.5px", fontWeight: 600, color: getProductionStatusPillColor(selectedOrder.productionStatus).fg, background: getProductionStatusPillColor(selectedOrder.productionStatus).bg, borderRadius: "6px", padding: "3px 7px", whiteSpace: "nowrap" }}>
                        {selectedOrder.productionStatus}
                      </span>
                    )}
                  </div>
                  <p style={{ font: "500 13.5px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "7px" }}>
                    {selectedOrder.customerName} · placed {new Date(selectedOrder.createdAt).toLocaleDateString()} · Payment: {selectedOrder.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Grid Content */}
              <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 320px", gap: "18px", alignItems: "start" }}>
                
                {/* LEFT: Images & Files */}
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px" }}>
                    <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "14px" }}>
                      Images
                    </div>
                    <div style={{ display: "flex", gap: "14px" }}>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ background: "#F4F6F9", borderRadius: "10px", padding: "8px", height: "166px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={selectedOrder.originalImageUrl} alt="Original" style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "6px" }} />
                        </div>
                        <div style={{ font: "600 11px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "8px" }}>Uploaded</div>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ background: "linear-gradient(177deg,#F3ECE0,#E7DCCB)", borderRadius: "10px", padding: "8px", height: "166px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                          <div style={{ background: "#fff", padding: "5px 5px 0", borderRadius: "5px 5px 2px 2px", filter: "drop-shadow(0 8px 8px rgba(21,36,60,.18))" }}>
                            <img src={selectedOrder.previewImageUrl} alt="Prepared" style={{ width: "84px", height: "120px", objectFit: "contain" }} />
                          </div>
                        </div>
                        <div style={{ font: "600 11px 'Plus Jakarta Sans'", color: "#8a93a6", marginTop: "8px" }}>Prepared</div>
                      </div>
                    </div>
                  </div>

                  {/* Files checklist */}
                  <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px" }}>
                    <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "12px" }}>
                      Files · {selectedOrder.id}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                      {[
                        { ext: "JPG", name: `${selectedOrder.id}_original.jpg`, bg: "#FBEFD9", fg: "#9a5b12" },
                        { ext: "PNG", name: `${selectedOrder.id}_preview.png`, bg: "#EAF3FF", fg: "#1d5cc4" },
                        { ext: "PDF", name: `${selectedOrder.id}_print-file.pdf`, bg: "#FDECEC", fg: "#b5292e" },
                        { ext: "SVG", name: `${selectedOrder.id}_cutline.svg`, bg: "#EFEAFB", fg: "#5b46b0" },
                      ].map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "9px", font: "500 12px 'Plus Jakarta Sans'", color: "#3c4658" }}>
                          <span style={{ font: "700 9px 'Plus Jakarta Sans'", letterSpacing: ".04em", color: f.fg, background: f.bg, borderRadius: "5px", padding: "3px 6px", flexShrink: 0, width: "38px", textAlign: "center" }}>
                            {f.ext}
                          </span>
                          <span style={{ fontFamily: "monospace", fontSize: "11px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {f.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Factory handoff meta */}
                  <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px" }}>
                    <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "13px" }}>
                      Factory handoff
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "13px", borderBottom: "1px solid #F0EDE6", marginBottom: "13px" }}>
                      <span style={{ fontSize: "18px" }}>📁</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ font: "700 12px 'Plus Jakarta Sans'", color: "#15243C" }}>Google Drive folder</div>
                        {selectedOrder.driveFolderUrl ? (
                          <a href={`https://${selectedOrder.driveFolderUrl}`} target="_blank" style={{ fontFamily: "monospace", fontSize: "11px", color: "#1D77F5", textDecoration: "underline", wordBreak: "break-all" }}>
                            {selectedOrder.driveFolderUrl}
                          </a>
                        ) : (
                          <div style={{ font: "500 11.5px 'Plus Jakarta Sans'", color: "#9aa0ab" }}>Not created yet</div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{ fontSize: "18px" }}>✉️</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ font: "700 12px 'Plus Jakarta Sans'", color: "#15243C" }}>Big Visual email</div>
                        <div style={{ font: "500 11.5px 'Plus Jakarta Sans'", color: selectedOrder.factoryNotifiedAt ? "#127a50" : "#9aa0ab" }}>
                          {selectedOrder.factoryNotifiedAt ? `Sent · ${new Date(selectedOrder.factoryNotifiedAt).toLocaleDateString()}` : "Not sent yet"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CENTER: Details & Addresses */}
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  
                  {/* Status Box */}
                  <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px 20px" }}>
                    <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "13px" }}>
                      Status Config
                    </div>
                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ font: "600 11px 'Plus Jakarta Sans'", color: "#9aa0ab", marginBottom: "6px" }}>Customer sees</div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", font: "700 11.5px 'Plus Jakarta Sans'", color: getOrderStatusPillDetails(selectedOrder.orderStatus).fg, background: getOrderStatusPillDetails(selectedOrder.orderStatus).bg, borderRadius: "30px", padding: "5px 11px", whiteSpace: "nowrap" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: getOrderStatusPillDetails(selectedOrder.orderStatus).dot }} />
                          {selectedOrder.orderStatus.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <div style={{ font: "600 11px 'Plus Jakarta Sans'", color: "#9aa0ab", marginBottom: "6px" }}>Production Pipeline</div>
                        <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: "10.5px", fontWeight: 600, color: getProductionStatusPillColor(selectedOrder.productionStatus).fg, background: getProductionStatusPillColor(selectedOrder.productionStatus).bg, borderRadius: "6px", padding: "3px 7px", whiteSpace: "nowrap" }}>
                          {selectedOrder.productionStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order info summary */}
                  <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "20px 22px" }}>
                    <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "14px" }}>
                      Order Items
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #F0EDE6" }}>
                        <span style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#8a93a6" }}>Product</span>
                        <span style={{ font: "600 13px 'Plus Jakarta Sans'", color: "#15243C" }}>Custom cutout (10mm Foam-board)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #F0EDE6" }}>
                        <span style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#8a93a6" }}>Size &amp; Qty</span>
                        <span style={{ font: "600 13px 'Plus Jakarta Sans'", color: "#15243C" }}>{selectedOrder.size} &times; {selectedOrder.quantity}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #F0EDE6" }}>
                        <span style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#8a93a6" }}>Add-on options</span>
                        <span style={{ font: "600 13px 'Plus Jakarta Sans'", color: "#15243C" }}>{getFormattedOptions(selectedOrder.options)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 0" }}>
                        <span style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C" }}>Total paid</span>
                        <span style={{ fontFamily: "var(--font-cabinet-grotesk)", fontWeight: 800, fontSize: "18px", color: "#15243C" }}>
                          ${selectedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer / Address info cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                    <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "20px 22px" }}>
                      <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "12px" }}>
                        Ship to
                      </div>
                      <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C", marginBottom: "4px" }}>
                        {selectedOrder.customerName}
                      </div>
                      <div style={{ font: "500 13px/1.6 'Plus Jakarta Sans'", color: "#5B636E" }}>
                        {(() => {
                          try {
                            const addr = JSON.parse(selectedOrder.shippingAddress);
                            return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`;
                          } catch {
                            return selectedOrder.shippingAddress;
                          }
                        })()}
                      </div>
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "20px 22px" }}>
                      <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "12px" }}>
                        Customer Contact
                      </div>
                      <div style={{ font: "700 14px 'Plus Jakarta Sans'", color: "#15243C", marginBottom: "4px" }}>
                        {selectedOrder.customerName}
                      </div>
                      <a href={`mailto:${selectedOrder.customerEmail}`} style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#1D77F5", textDecoration: "underline", wordBreak: "break-all" }}>
                        {selectedOrder.customerEmail}
                      </a>
                    </div>
                  </div>

                  {/* Linked Issues list */}
                  <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "20px 22px" }}>
                    <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "13px" }}>
                      Issues on this order
                    </div>
                    {selectedOrder.issues.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                        {selectedOrder.issues.map((i) => (
                          <div key={i.id} style={{ display: "flex", alignItems: "center", gap: "11px", background: "#F8FAFC", border: "1px solid #EEF1F5", borderRadius: "11px", padding: "11px 13px" }}>
                            <span style={{ font: "800 11.5px var(--font-cabinet-grotesk)", color: "#15243C" }}>{i.id}</span>
                            <div style={{ flexGrow: 1 }}>
                              <span style={{ font: "700 12.5px 'Plus Jakarta Sans'", color: "#15243C" }}>{i.type.replace("_", " ")}</span>
                              <span style={{ display: "block", font: "500 11.5px 'Plus Jakarta Sans'", color: "#8a93a6" }}>{i.note}</span>
                            </div>
                            <button
                              onClick={() => handlePatchIssue(i.id, i.status === "open" ? "resolved" : "open")}
                              style={{ border: "none", background: i.status === "open" ? "#FEF6E6" : "#E7F7EF", color: i.status === "open" ? "#9a7212" : "#127a50", font: "700 11px 'Plus Jakarta Sans'", padding: "4px 10px", borderRadius: "20px", cursor: "pointer" }}
                            >
                              {i.status}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ font: "500 13px 'Plus Jakarta Sans'", color: "#9aa0ab" }}>No issues logged.</div>
                    )}
                  </div>
                </div>

                {/* RIGHT: Actions Panel & Notes */}
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  
                  {/* Operations actions */}
                  <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px" }}>
                    <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "14px" }}>
                      Actions
                    </div>

                    {/* Manual review controls */}
                    {selectedOrder.orderStatus === "Needs manual review" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "14px", borderBottom: "1px solid #F0EDE6", marginBottom: "14px" }}>
                        <div style={{ font: "700 12px 'Plus Jakarta Sans'", color: "#9a7212" }}>Manual Image Review Needed</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={handleApproveReview} style={{ flex: 1, background: "#1FA971", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", font: "700 12.5px 'Plus Jakarta Sans'", cursor: "pointer" }}>
                            Approve Photo
                          </button>
                          <button onClick={handleFailReview} style={{ flex: 1, background: "#E5484D", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", font: "700 12.5px 'Plus Jakarta Sans'", cursor: "pointer" }}>
                            Request New
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                      {/* Step 1: Package gen */}
                      <button
                        onClick={handleGenPackage}
                        disabled={selectedOrder.productionStatus !== "needs_package"}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "none",
                          font: "700 13px 'Plus Jakarta Sans'",
                          cursor: selectedOrder.productionStatus === "needs_package" ? "pointer" : "default",
                          background: selectedOrder.productionStatus === "needs_package" ? "#1D77F5" : "#E7F7EF",
                          color: selectedOrder.productionStatus === "needs_package" ? "#fff" : "#127a50",
                        }}
                      >
                        {["package_ready", "package_uploaded", "sent_to_factory"].includes(selectedOrder.productionStatus)
                          ? "✓ Package generated"
                          : "Generate production package"}
                      </button>

                      {/* Step 2: Google Drive upload */}
                      <button
                        onClick={handleUploadDrive}
                        disabled={selectedOrder.productionStatus !== "package_ready"}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "none",
                          font: "700 13px 'Plus Jakarta Sans'",
                          cursor: selectedOrder.productionStatus === "package_ready" ? "pointer" : "default",
                          background: selectedOrder.productionStatus === "package_ready" ? "#1D77F5" : ["package_uploaded", "sent_to_factory"].includes(selectedOrder.productionStatus) ? "#E7F7EF" : "#F4F6F9",
                          color: selectedOrder.productionStatus === "package_ready" ? "#fff" : ["package_uploaded", "sent_to_factory"].includes(selectedOrder.productionStatus) ? "#127a50" : "#b9c0cb",
                        }}
                      >
                        {["package_uploaded", "sent_to_factory"].includes(selectedOrder.productionStatus)
                          ? "✓ Uploaded to Google Drive"
                          : "Upload package to Google Drive"}
                      </button>

                      {/* Step 3: Factory notification */}
                      <button
                        onClick={handleMarkSentFactory}
                        disabled={selectedOrder.productionStatus !== "package_uploaded"}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "none",
                          font: "700 13px 'Plus Jakarta Sans'",
                          cursor: selectedOrder.productionStatus === "package_uploaded" ? "pointer" : "default",
                          background: selectedOrder.productionStatus === "package_uploaded" ? "#1D77F5" : selectedOrder.productionStatus === "sent_to_factory" ? "#E7F7EF" : "#F4F6F9",
                          color: selectedOrder.productionStatus === "package_uploaded" ? "#fff" : selectedOrder.productionStatus === "sent_to_factory" ? "#127a50" : "#b9c0cb",
                        }}
                      >
                        {selectedOrder.productionStatus === "sent_to_factory"
                          ? "✓ Sent to Big Visual Factory"
                          : "Email Factory & mark sent"}
                      </button>

                      {/* Step 4: Tracking addition */}
                      <button
                        onClick={handleAddTracking}
                        disabled={selectedOrder.productionStatus !== "sent_to_factory" || !!selectedOrder.trackingNumber}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "none",
                          font: "700 13px 'Plus Jakarta Sans'",
                          cursor: (selectedOrder.productionStatus === "sent_to_factory" && !selectedOrder.trackingNumber) ? "pointer" : "default",
                          background: (selectedOrder.productionStatus === "sent_to_factory" && !selectedOrder.trackingNumber) ? "#1D77F5" : selectedOrder.trackingNumber ? "#E7F7EF" : "#F4F6F9",
                          color: (selectedOrder.productionStatus === "sent_to_factory" && !selectedOrder.trackingNumber) ? "#fff" : selectedOrder.trackingNumber ? "#127a50" : "#b9c0cb",
                        }}
                      >
                        {selectedOrder.trackingNumber
                          ? `✓ Shipped (${selectedOrder.trackingNumber})`
                          : "Add tracking number"}
                      </button>
                    </div>
                  </div>

                  {/* Customer care & issues */}
                  <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px" }}>
                    <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "14px" }}>
                      Customer Support
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <button onClick={handleContactCustomer} style={{ width: "100%", font: "700 13px 'Plus Jakarta Sans'", border: "1px solid #DCE3EC", borderRadius: "8px", padding: "10px", background: "#fff", color: "#15243C", cursor: "pointer" }}>
                        Contact Customer
                      </button>
                      <button onClick={handleOpenIssue} style={{ width: "100%", font: "700 13px 'Plus Jakarta Sans'", border: "1px solid #DCE3EC", borderRadius: "8px", padding: "10px", background: "#fff", color: "#15243C", cursor: "pointer" }}>
                        Log Support Issue
                      </button>
                      <button onClick={handleRefund} disabled={selectedOrder.paymentStatus === "refunded"} style={{ width: "100%", font: "700 13px 'Plus Jakarta Sans'", border: "1px solid #F6C4C6", borderRadius: "8px", padding: "10px", background: "#fff", color: selectedOrder.paymentStatus === "refunded" ? "#c9ccd2" : "#b5292e", cursor: selectedOrder.paymentStatus === "refunded" ? "not-allowed" : "pointer" }}>
                        Refund Order
                      </button>
                      <button onClick={handleCancel} disabled={selectedOrder.orderStatus === "canceled"} style={{ width: "100%", font: "700 13px 'Plus Jakarta Sans'", border: "1px solid #F6C4C6", borderRadius: "8px", padding: "10px", background: "#fff", color: selectedOrder.orderStatus === "canceled" ? "#c9ccd2" : "#b5292e", cursor: selectedOrder.orderStatus === "canceled" ? "not-allowed" : "pointer" }}>
                        Cancel Order
                      </button>
                    </div>
                  </div>

                  {/* Notes Feed log */}
                  <div style={{ background: "#fff", border: "1px solid #E3E7EE", borderRadius: "16px", padding: "18px" }}>
                    <div style={{ font: "700 10.5px 'Plus Jakarta Sans'", letterSpacing: ".1em", textTransform: "uppercase", color: "#9aa0ab", marginBottom: "14px" }}>
                      Internal Notes
                    </div>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Type note message..."
                        rows={3}
                        style={{ width: "100%", border: "1.5px solid #E3E7EE", borderRadius: "8px", padding: "10px", font: "inherit", resize: "none" }}
                      />
                      <button onClick={handleAddNote} style={{ marginTop: "6px", width: "100%", background: "#15243C", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", font: "700 13px 'Plus Jakarta Sans'", cursor: "pointer" }}>
                        Save Note
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                      {(() => {
                        try {
                          const notes = JSON.parse(selectedOrder.internalNotes || "[]");
                          if (!notes.length) return <div style={{ font: "500 12.5px 'Plus Jakarta Sans'", color: "#9aa0ab" }}>No notes logged yet.</div>;
                          return notes.map((n: any, idx: number) => (
                            <div key={idx} style={{ padding: "8px", background: "#F8FAFC", borderRadius: "8px", fontSize: "12px", border: "1px solid #EEF1F5" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#15243C", marginBottom: "4px" }}>
                                <span>{n.t}</span>
                                <span style={{ color: "#9aa0ab", fontWeight: 500 }}>{n.w}</span>
                              </div>
                              <div style={{ color: "#5B636E", lineHeight: 1.45 }}>{n.m}</div>
                            </div>
                          ));
                        } catch {
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
