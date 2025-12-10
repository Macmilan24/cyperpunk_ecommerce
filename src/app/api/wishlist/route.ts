import { NextResponse } from "next/server";
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

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const existing = db
      .prepare("SELECT * FROM wishlist WHERE userId = ? AND productId = ?")
      .get(session.user.id, productId) as any;

    if (existing) {
      db.prepare("DELETE FROM wishlist WHERE id = ?").run(existing.id);
      return NextResponse.json({ status: "removed" });
    } else {
      const id = uuidv4();
      db.prepare(
        "INSERT INTO wishlist (id, userId, productId) VALUES (?, ?, ?)"
      ).run(id, session.user.id, productId);
      return NextResponse.json({ status: "added" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = db
      .prepare(
        `
      SELECT w.*, p.name as productName, p.price as productPrice, p.image as productImage, p.description as productDescription 
      FROM wishlist w 
      JOIN product p ON w.productId = p.id 
      WHERE w.userId = ?
    `
      )
      .all(session.user.id) as any[];

    // Map to match previous structure if needed, or just return flat
    const formattedWishlist = wishlist.map((item) => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        image: item.productImage,
        description: item.productDescription,
      },
    }));

    return NextResponse.json(formattedWishlist);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
