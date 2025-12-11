import { query } from "@/lib/db";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string | null;
  features: any;
  specs: any;
  type: string;
  editionSize: number | null;
  createdAt: Date;
}

export async function getProducts(): Promise<Product[]> {
  try {
    // Ensure we select columns that match our interface
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
      ORDER BY "createdAt" DESC
    `;
    const result = await query(sql);
    return result.rows;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
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
      WHERE id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
}

export async function getFeaturedProducts(
  limit: number = 4
): Promise<Product[]> {
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
      ORDER BY RANDOM()
      LIMIT $1
    `;
    const result = await query(sql, [limit]);
    return result.rows;
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export async function getNewArrivals(limit: number = 4): Promise<Product[]> {
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
      ORDER BY "createdAt" DESC
      LIMIT $1
    `;
    const result = await query(sql, [limit]);
    return result.rows;
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
    return [];
  }
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
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
      WHERE "categoryId" = $1
    `;
    const result = await query(sql, [categoryId]);
    return result.rows;
  } catch (error) {
    console.error(
      `Failed to fetch products for category ${categoryId}:`,
      error
    );
    return [];
  }
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit: number = 4
): Promise<Product[]> {
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
      WHERE "categoryId" = $1 AND id != $2
      LIMIT $3
    `;
    const result = await query(sql, [categoryId, excludeId, limit]);
    return result.rows;
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

export async function getProductVariants(productId: string): Promise<any[]> {
  try {
    const sql = `SELECT * FROM product_variant WHERE "productId" = $1`;
    const result = await query(sql, [productId]);
    return result.rows;
  } catch (error) {
    console.error(`Failed to fetch variants for product ${productId}:`, error);
    return [];
  }
}
