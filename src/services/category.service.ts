import { query } from "@/lib/db";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const sql = `SELECT * FROM category`;
    const result = await query(sql);
    return result.rows;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const sql = `SELECT * FROM category WHERE slug = $1`;
    const result = await query(sql, [slug]);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`Failed to fetch category ${slug}:`, error);
    return null;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const sql = `SELECT * FROM category WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`Failed to fetch category ${id}:`, error);
    return null;
  }
}
