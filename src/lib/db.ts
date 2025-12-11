import { Pool, QueryResult } from "pg";

// Use a global variable to prevent multiple pools in development (Hot Reloading)
let pool: Pool;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("DATABASE_URL or POSTGRES_URL is missing.");
  }
}

const config = {
  connectionString,
  ssl:
    connectionString &&
    (connectionString.includes("localhost") ||
      connectionString.includes("127.0.0.1"))
      ? false
      : { rejectUnauthorized: false }, // Required for Neon
  max: 10, // Limit pool size for serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

if (process.env.NODE_ENV === "production") {
  pool = new Pool(config);
} else {
  if (!(global as any).postgresPool) {
    (global as any).postgresPool = new Pool(config);
  }
  pool = (global as any).postgresPool;
}

// Robust query helper with error handling
export async function query(
  text: string,
  params?: any[]
): Promise<QueryResult> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    // const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Error executing query", { text, error });
    throw error;
  }
}

export default pool;
