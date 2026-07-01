import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCheckoutSession } from "@/lib/services/stripe";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    // If no ID is provided, return all orders with issues (for admin portal)
    if (!id) {
      const orders = await db.order.findMany({
        include: { issues: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(orders);
    }

    const query: any = { id };
    if (email) {
      query.customerEmail = email.trim();
    }

    const order = await db.order.findUnique({
      where: { id },
      include: { issues: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify email if provided
    if (email && order.customerEmail.toLowerCase() !== email.toLowerCase().trim()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error("GET order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      shippingAddress,
      size,
      quantity,
      options,
      originalImageUrl,
      subtotal,
      total,
    } = body;

    // Generate unique order ID CS-####
    let orderId = "";
    let attempts = 0;
    while (attempts < 10) {
      const num = Math.floor(1000 + Math.random() * 9000);
      const possibleId = `CS-${num}`;
      const existing = await db.order.findUnique({ where: { id: possibleId } });
      if (!existing) {
        orderId = possibleId;
        break;
      }
      attempts++;
    }

    if (!orderId) {
      return NextResponse.json({ error: "Failed to generate unique order ID" }, { status: 500 });
    }

    // Create a mock preview image URL
    const previewImageUrl = originalImageUrl; // Fallback or mock path

    // Write unpaid order record to SQLite
    const order = await db.order.create({
      data: {
        id: orderId,
        customerName,
        customerEmail,
        shippingAddress: JSON.stringify(shippingAddress),
        size,
        quantity: quantity || 1,
        options: JSON.stringify(options),
        originalImageUrl,
        previewImageUrl,
        previewApproved: false,
        subtotal,
        total,
        paymentStatus: "pending",
        orderStatus: "paid", // Initial state once paid
        productionStatus: "needs_package",
      },
    });

    // Create Stripe Session (or Mock Session)
    const { url, sessionId } = await createCheckoutSession({
      orderId: order.id,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      subtotal: order.subtotal,
      total: order.total,
    });

    // Update order with session ID
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: sessionId },
    });

    return NextResponse.json({ url, orderId: order.id });
  } catch (err: any) {
    console.error("POST order error:", err);
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, orderStatus, productionStatus, trackingNumber, internalNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const data: any = {};
    if (orderStatus !== undefined) data.orderStatus = orderStatus;
    if (productionStatus !== undefined) data.productionStatus = productionStatus;
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;
    if (internalNotes !== undefined) data.internalNotes = JSON.stringify(internalNotes);

    const updated = await db.order.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PATCH order error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
