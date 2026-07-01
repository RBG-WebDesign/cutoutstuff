import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const issues = await db.issue.findMany({
      include: { order: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(issues);
  } catch (err: any) {
    console.error("GET issues error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, type, priority, note } = body;

    if (!orderId || !type || !priority) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique ID IS-####
    let issueId = "";
    let attempts = 0;
    while (attempts < 10) {
      const num = Math.floor(1000 + Math.random() * 9000);
      const possibleId = `IS-${num}`;
      const existing = await db.issue.findUnique({ where: { id: possibleId } });
      if (!existing) {
        issueId = possibleId;
        break;
      }
      attempts++;
    }

    if (!issueId) {
      return NextResponse.json({ error: "Failed to generate unique issue ID" }, { status: 500 });
    }

    const issue = await db.issue.create({
      data: {
        id: issueId,
        orderId,
        type,
        priority,
        status: "open",
        note: note || "",
      },
    });

    return NextResponse.json(issue);
  } catch (err: any) {
    console.error("POST issue error:", err);
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await db.issue.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PATCH issue error:", err);
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}
