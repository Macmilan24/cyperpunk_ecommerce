
// This script forces the migration to run against the specific Vercel database
// It bypasses environment variable issues by setting it directly.

process.env.DATABASE_URL = "postgresql://neondb_owner:npg_dFeJp2Xa6MYo@ep-royal-unit-a4djzfo7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
process.env.POSTGRES_URL = process.env.DATABASE_URL;

console.log("🚀 Starting Forced Migration to Vercel Database...");
console.log("Target: " + process.env.DATABASE_URL.split('@')[1]); // Log host for verification

// Import and run the main migration script
require('./migrate-postgres.js');
