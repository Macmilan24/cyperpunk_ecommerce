import { Pool } from "pg";

// Use a global variable to prevent multiple pools in development (Hot Reloading)
let pool: Pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  });
} else {
  if (!(global as any).postgresPool) {
    (global as any).postgresPool = new Pool({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    });
  }
  pool = (global as any).postgresPool;
}

// Helper wrapper to mimic better-sqlite3 synchronous style where possible,
// but for async Postgres we need to adapt the calling code.
// For now, we export the raw pool to allow async queries.
export default pool;

// Helper for simple one-off queries
export const query = (text: string, params?: any[]) => pool.query(text, params);
