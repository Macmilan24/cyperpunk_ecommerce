import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/chapa";
import db from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get("tx_ref");

  if (!tx_ref) {
    return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
  }

  try {
    const verification = await verifyPayment(tx_ref);

    if (verification.status === "success") {
      const order = db
        .prepare('SELECT * FROM "order" WHERE paymentRef = ?')
        .get(tx_ref) as any;

      if (order && order.status === "PENDING") {
        db.prepare('UPDATE "order" SET status = ? WHERE id = ?').run(
          "PAID",
          order.id
        );
      }

      return NextResponse.json({ status: "success", data: verification.data });
    } else {
      return NextResponse.json({ status: "failed" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
