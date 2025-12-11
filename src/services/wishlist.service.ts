import { query } from "@/lib/db";

export async function getWishlistProductIds(
  userId: string
): Promise<Set<string>> {
  try {
    const sql = `SELECT "productId" FROM wishlist WHERE "userId" = $1`;
    const result = await query(sql, [userId]);
    return new Set(result.rows.map((w: any) => w.productId));
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    return new Set();
  }
}

export async function getWishlistItems(userId: string): Promise<any[]> {
  try {
    const sql = `
      SELECT 
        w.id, 
        w."productId",
        p.name as "productName", 
        p.price::float as "productPrice", 
        p.image as "productImage", 
        p.description as "productDescription",
        p."categoryId",
        p.type
      FROM wishlist w 
      JOIN product p ON w."productId" = p.id 
      WHERE w."userId" = $1
    `;
    const result = await query(sql, [userId]);
    return result.rows.map((item: any) => ({
      id: item.id,
      product: {
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        image: item.productImage,
        description: item.productDescription,
        categoryId: item.categoryId,
        type: item.type,
      },
    }));
  } catch (error) {
    console.error("Failed to fetch wishlist items:", error);
    return [];
  }
}
