import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/chapa";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get("tx_ref");

  if (!tx_ref) {
    return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
  }

  try {
    const verification = await verifyPayment(tx_ref);

    if (verification.status === "success") {
      const orderResult = await query(
        'SELECT * FROM "order" WHERE "paymentRef" = $1',
        [tx_ref]
      );
      const order = orderResult.rows[0];

      if (order && order.status === "PENDING") {
        await query('UPDATE "order" SET status = $1 WHERE id = $2', [
          "PAID",
          order.id,
        ]);
      }

      return NextResponse.json({ status: "success", data: verification.data });
    } else {
      return NextResponse.json({ status: "failed" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
