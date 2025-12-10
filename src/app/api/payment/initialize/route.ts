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
    const createOrder = db.transaction(() => {
      db.prepare(
        'INSERT INTO "order" (id, userId, total, status) VALUES (?, ?, ?, ?)'
      ).run(orderId, session.user.id, totalAmount, "PENDING");

      const insertItem = db.prepare(
        "INSERT INTO order_item (id, orderId, productId, quantity, price) VALUES (?, ?, ?, ?, ?)"
      );
      for (const item of cartItems) {
        insertItem.run(uuidv4(), orderId, item.id, item.quantity, item.price);
      }
    });

    createOrder();

    const tx_ref = `TX-${orderId}`;

    db.prepare('UPDATE "order" SET paymentRef = ? WHERE id = ?').run(
      tx_ref,
      orderId
    );

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
