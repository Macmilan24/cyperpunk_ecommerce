import { NextResponse } from "next/server";
import { initializePayment } from "@/lib/chapa";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartItems, totalAmount } = body;

    const orderId = uuidv4();

    // Transaction for order creation
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        'INSERT INTO "order" (id, "userId", total, status) VALUES ($1, $2, $3, $4)',
        [orderId, session.user.id, totalAmount, "PENDING"]
      );

      for (const item of cartItems) {
        const productId = item.productId || item.id;
        const variantId = item.variant?.id || null;
        await client.query(
          'INSERT INTO order_item (id, "orderId", "productId", "variantId", quantity, price) VALUES ($1, $2, $3, $4, $5, $6)',
          [uuidv4(), orderId, productId, variantId, item.quantity, item.price]
        );
      }

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }

    const tx_ref = `TX-${orderId}`;

    await db.query('UPDATE "order" SET "paymentRef" = $1 WHERE id = $2', [
      tx_ref,
      orderId,
    ]);

    const chapaResponse = await initializePayment({
      amount: totalAmount.toString(),
      currency: "ETB",
      email: session.user.email,
      first_name: session.user.name?.split(" ")[0] || "User",
      last_name: session.user.name?.split(" ")[1] || "Name",
      tx_ref: tx_ref,
      return_url: `${process.env.BETTER_AUTH_URL}/payment/success?tx_ref=${tx_ref}`,
      callback_url: `${process.env.BETTER_AUTH_URL}/api/webhooks/chapa`,
    });

    return NextResponse.json({ checkout_url: chapaResponse.data.checkout_url });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
