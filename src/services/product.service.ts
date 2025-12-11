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

export async function getProducts(opts?: {
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
  filters?: {
    categoryId?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    collection?: string;
    chain?: string;
  };
}): Promise<Product[]> {
  try {
    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(48, Math.max(1, opts?.limit ?? 12));
    const offset = (page - 1) * limit;

    let orderBy = '"createdAt" DESC';
    switch (opts?.sort) {
      case "price_asc":
        orderBy = "price ASC";
        break;
      case "price_desc":
        orderBy = "price DESC";
        break;
      case "name_asc":
        orderBy = "name ASC";
        break;
      case "newest":
      default:
        orderBy = '"createdAt" DESC';
    }

    const whereClauses: string[] = [];
    const params: any[] = [];
    let p = 1;

    const f = opts?.filters;
    if (f?.categoryId) {
      whereClauses.push(`"categoryId" = $${p++}`);
      params.push(f.categoryId);
    }
    if (f?.type) {
      whereClauses.push(`type = $${p++}`);
      params.push(f.type);
    }
    if (typeof f?.minPrice === "number") {
      whereClauses.push(`price >= $${p++}`);
      params.push(f.minPrice);
    }
    if (typeof f?.maxPrice === "number") {
      whereClauses.push(`price <= $${p++}`);
      params.push(f.maxPrice);
    }
    if (f?.collection) {
      whereClauses.push(`collection = $${p++}`);
      params.push(f.collection);
    }
    if (f?.chain) {
      whereClauses.push(`chain = $${p++}`);
      params.push(f.chain);
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

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
      ${whereSQL}
      ORDER BY ${orderBy}
      LIMIT $${p}
      OFFSET $${p + 1}
    `;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductsWithCount(opts?: {
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
  filters?: {
    categoryId?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    collection?: string;
    chain?: string;
  };
}): Promise<{ items: Product[]; total: number; page: number; limit: number }> {
  try {
    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(48, Math.max(1, opts?.limit ?? 12));
    const offset = (page - 1) * limit;

    let orderBy = '"createdAt" DESC';
    switch (opts?.sort) {
      case "price_asc":
        orderBy = "price ASC";
        break;
      case "price_desc":
        orderBy = "price DESC";
        break;
      case "name_asc":
        orderBy = "name ASC";
        break;
      case "newest":
      default:
        orderBy = '"createdAt" DESC';
    }

    const whereClauses: string[] = [];
    const params: any[] = [];
    let p = 1;
    const f = opts?.filters;
    if (f?.categoryId) {
      whereClauses.push(`"categoryId" = $${p++}`);
      params.push(f.categoryId);
    }
    if (f?.type) {
      whereClauses.push(`type = $${p++}`);
      params.push(f.type);
    }
    if (typeof f?.minPrice === "number") {
      whereClauses.push(`price >= $${p++}`);
      params.push(f.minPrice);
    }
    if (typeof f?.maxPrice === "number") {
      whereClauses.push(`price <= $${p++}`);
      params.push(f.maxPrice);
    }
    if (f?.collection) {
      whereClauses.push(`collection = $${p++}`);
      params.push(f.collection);
    }
    if (f?.chain) {
      whereClauses.push(`chain = $${p++}`);
      params.push(f.chain);
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const dataSql = `
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
      ${whereSQL}
      ORDER BY ${orderBy}
      LIMIT $${p}
      OFFSET $${p + 1}
    `;
    const countSql = `SELECT COUNT(*)::int AS total FROM product ${whereSQL}`;
    const dataParams = [...params, limit, offset];

    const [dataRes, countRes] = await Promise.all([
      query(dataSql, dataParams),
      query(countSql, params),
    ]);

    const total: number = countRes.rows[0]?.total ?? 0;
    return { items: dataRes.rows, total, page, limit };
  } catch (error) {
    console.error("Failed to fetch products with count:", error);
    return {
      items: [],
      total: 0,
      page: opts?.page ?? 1,
      limit: opts?.limit ?? 12,
    };
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
  categoryId: string,
  opts?: {
    page?: number;
    limit?: number;
    sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      collection?: string;
      chain?: string;
      type?: string;
    };
  }
): Promise<Product[]> {
  try {
    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(48, Math.max(1, opts?.limit ?? 12));
    const offset = (page - 1) * limit;

    let orderBy = '"createdAt" DESC';
    switch (opts?.sort) {
      case "price_asc":
        orderBy = "price ASC";
        break;
      case "price_desc":
        orderBy = "price DESC";
        break;
      case "name_asc":
        orderBy = "name ASC";
        break;
      case "newest":
      default:
        orderBy = '"createdAt" DESC';
    }

    const whereClauses: string[] = ['"categoryId" = $1'];
    const params: any[] = [categoryId];
    let p = 2;
    const f = opts?.filters;
    if (typeof f?.minPrice === "number") {
      whereClauses.push(`price >= $${p++}`);
      params.push(f.minPrice);
    }
    if (typeof f?.maxPrice === "number") {
      whereClauses.push(`price <= $${p++}`);
      params.push(f.maxPrice);
    }
    if (f?.collection) {
      whereClauses.push(`collection = $${p++}`);
      params.push(f.collection);
    }
    if (f?.chain) {
      whereClauses.push(`chain = $${p++}`);
      params.push(f.chain);
    }
    if (f?.type) {
      whereClauses.push(`type = $${p++}`);
      params.push(f.type);
    }

    const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;
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
      ${whereSQL}
      ORDER BY ${orderBy}
      LIMIT $${p}
      OFFSET $${p + 1}
    `;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  } catch (error) {
    console.error(
      `Failed to fetch products for category ${categoryId}:`,
      error
    );
    return [];
  }
}

export async function getProductsByCategoryWithCount(
  categoryId: string,
  opts?: {
    page?: number;
    limit?: number;
    sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      collection?: string;
      chain?: string;
      type?: string;
    };
  }
): Promise<{ items: Product[]; total: number; page: number; limit: number }> {
  try {
    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(48, Math.max(1, opts?.limit ?? 12));
    const offset = (page - 1) * limit;

    let orderBy = '"createdAt" DESC';
    switch (opts?.sort) {
      case "price_asc":
        orderBy = "price ASC";
        break;
      case "price_desc":
        orderBy = "price DESC";
        break;
      case "name_asc":
        orderBy = "name ASC";
        break;
      case "newest":
      default:
        orderBy = '"createdAt" DESC';
    }

    const whereClauses: string[] = ['"categoryId" = $1'];
    const params: any[] = [categoryId];
    let p = 2;
    const f = opts?.filters;
    if (typeof f?.minPrice === "number") {
      whereClauses.push(`price >= $${p++}`);
      params.push(f.minPrice);
    }
    if (typeof f?.maxPrice === "number") {
      whereClauses.push(`price <= $${p++}`);
      params.push(f.maxPrice);
    }
    if (f?.collection) {
      whereClauses.push(`collection = $${p++}`);
      params.push(f.collection);
    }
    if (f?.chain) {
      whereClauses.push(`chain = $${p++}`);
      params.push(f.chain);
    }
    if (f?.type) {
      whereClauses.push(`type = $${p++}`);
      params.push(f.type);
    }

    const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;
    const dataSql = `
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
      ${whereSQL}
      ORDER BY ${orderBy}
      LIMIT $${p}
      OFFSET $${p + 1}
    `;
    const countSql = `SELECT COUNT(*)::int AS total FROM product ${whereSQL}`;
    const dataParams = [...params, limit, offset];

    const [dataRes, countRes] = await Promise.all([
      query(dataSql, dataParams),
      query(countSql, params),
    ]);

    const total: number = countRes.rows[0]?.total ?? 0;
    return { items: dataRes.rows, total, page, limit };
  } catch (error) {
    console.error(
      `Failed to fetch products for category ${categoryId} with count:`,
      error
    );
    return {
      items: [],
      total: 0,
      page: opts?.page ?? 1,
      limit: opts?.limit ?? 12,
    };
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
