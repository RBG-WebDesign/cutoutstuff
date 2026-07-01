import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/services/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, orderId } = body;

    if (!sessionId || !orderId) {
      return NextResponse.json({ error: "Missing sessionId or orderId" }, { status: 400 });
    }

    // Find the order
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update payment status in database
    await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "paid",
        orderStatus: "paid",
        productionStatus: "needs_package",
      },
    });

    // Send transactional order received email
    const options = JSON.parse(order.options);
    const optionsList = Object.keys(options)
      .filter((k) => options[k])
      .map((k) => `<li>${k === "touchUp" ? "Touch-up service" : k === "customMessage" ? "Custom message" : k === "rushOrder" ? "Rush production" : "Digital proof"}</li>`)
      .join("");

    const emailHtml = `
      <div style="font-family: sans-serif; color: #15243C; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="font-size: 24px; border-bottom: 2px solid #1D77F5; padding-bottom: 10px;">Order Received</h1>
        <p>Hi ${order.customerName},</p>
        <p>Thank you for your order! We've received your payment and are currently reviewing your uploaded image.</p>
        <div style="background: #F6FAFF; border: 1px solid #CFE2FB; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px;">Order Details</h3>
          <p style="margin: 4px 0;"><strong>Order ID:</strong> ${order.id}</p>
          <p style="margin: 4px 0;"><strong>Size:</strong> ${order.size}</p>
          <p style="margin: 4px 0;"><strong>Quantity:</strong> ${order.quantity}</p>
          <p style="margin: 4px 0;"><strong>Total Paid:</strong> $${order.total.toFixed(2)}</p>
        </div>
        ${optionsList ? `<h3>Add-on Options Selected:</h3><ul>${optionsList}</ul>` : ""}
        <p>We will email you a digital proof to approve before we print. Keep an eye on your inbox!</p>
        <p style="margin-top: 30px; font-size: 12px; color: #8a93a6;">© 2026 CutoutStuff.com</p>
      </div>
    `;

    await sendEmail({
      to: order.customerEmail,
      subject: `CutoutStuff: Order Received [${order.id}]`,
      html: emailHtml,
    });

    console.log(`[Webhook Service] Successfully processed payment for order ${orderId}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
