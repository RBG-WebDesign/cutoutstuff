import Stripe from "stripe";

const stripe = process.env.STRIPE_API_KEY
  ? new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: "2024-06-20" as any,
    })
  : null;

export interface CheckoutSessionParams {
  orderId: string;
  customerEmail: string;
  customerName: string;
  subtotal: number;
  total: number;
}

export async function createCheckoutSession({
  orderId,
  customerEmail,
  customerName,
  subtotal,
  total,
}: CheckoutSessionParams): Promise<{ url: string; sessionId: string }> {
  const isMock = process.env.USE_LOCAL_MOCKS === "true" || !stripe;

  if (isMock) {
    const sessionId = `mock_session_${Math.random().toString(36).substring(2, 15)}`;
    // Local mock checkout page URL
    const url = `/order/mock-checkout?session_id=${sessionId}&order_id=${orderId}`;
    return { url, sessionId };
  }

  // Real Stripe session creation
  const session = await stripe!.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `CutoutStuff Order ${orderId}`,
            description: `Custom foam-board cutout`,
          },
          unit_amount: Math.round(total * 100), // Stripe expects cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/order/${orderId}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/create`,
    metadata: {
      orderId,
      customerName,
    },
  });

  return { url: session.url || "", sessionId: session.id };
}

export async function retrieveSession(sessionId: string) {
  const isMock = sessionId.startsWith("mock_");
  if (isMock) {
    return {
      id: sessionId,
      payment_status: "paid",
      status: "complete",
    };
  }
  if (!stripe) {
    throw new Error("Stripe API key is not configured");
  }
  return await stripe.checkout.sessions.retrieve(sessionId);
}
