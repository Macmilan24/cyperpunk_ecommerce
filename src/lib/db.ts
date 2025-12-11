import { Pool } from "pg";

// Use a global variable to prevent multiple pools in development (Hot Reloading)
let pool: Pool;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  // In build time this might be missing, so we warn but don't crash immediately
  // unless a query is attempted.
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
      : { rejectUnauthorized: false },
};

if (process.env.NODE_ENV === "production") {
  pool = new Pool(config);
} else {
  if (!(global as any).postgresPool) {
    (global as any).postgresPool = new Pool(config);
  }
  pool = (global as any).postgresPool;
}

// Helper wrapper to mimic better-sqlite3 synchronous style where possible,
// but for async Postgres we need to adapt the calling code.
// For now, we export the raw pool to allow async queries.
export default pool;

// Helper for simple one-off queries
export const query = (text: string, params?: any[]) => pool.query(text, params);
