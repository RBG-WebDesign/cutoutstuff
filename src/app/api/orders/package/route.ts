import { NextResponse } from "next/server";
import { generateProductionPackage } from "@/lib/services/pipeline";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const result = await generateProductionPackage(orderId);

    if (!result.success) {
      return NextResponse.json({ error: "Failed to generate package" }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API package generation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
