import { query } from "@/lib/db";
import { Product } from "./product.service";

export async function searchProducts(q: string): Promise<Product[]> {
  try {
    const sql = `
      SELECT 
        id, 
        name, 
        description, 
        price::float as price, 
        "categoryId", 
        image, 
        features, 
        specs, 
        type, 
        "editionSize", 
        "createdAt"
      FROM product 
      WHERE name ILIKE $1 OR description ILIKE $2
    `;
    const result = await query(sql, [`%${q}%`, `%${q}%`]);
    return result.rows;
  } catch (error) {
    console.error(`Failed to search products for "${q}":`, error);
    return [];
  }
}
