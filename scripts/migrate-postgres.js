const { Pool, Client } = require("pg");
require("dotenv").config();

async function migrate() {
  // 1. Create Database if it doesn't exist
  try {
    const dbUrl = process.env.DATABASE_URL;
    const dbName = dbUrl.split("/").pop();
    const postgresUrl = dbUrl.replace(/\/[^/]+$/, "/postgres");

    const sysClient = new Client({ connectionString: postgresUrl });
    await sysClient.connect();

    const res = await sysClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
    if (res.rowCount === 0) {
      console.log(`Creating database "${dbName}"...`);
      await sysClient.query(`CREATE DATABASE "${dbName}"`);
    }
    await sysClient.end();
  } catch (e) {
    console.log(
      "Note: Automatic database creation skipped or failed (proceeding to migration):",
      e.message
    );
  }

  // 2. Connect to the target database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  try {
    console.log("Initializing Hybrid Marketplace Migration (PostgreSQL)...");

    await client.query("BEGIN");

    // 1. Drop existing tables (Cascade to handle foreign keys)
    const tables = [
      "order_item",
      "order",
      "wishlist",
      "product_variant",
      "product",
      "category",
      "verification",
      "verification_token",
      "account",
      "session",
      "user",
    ];
    for (const table of tables) {
      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    }

    // 2. Create Tables

    // Auth Tables (Better-Auth compatible)
    await client.query(`
      CREATE TABLE "user" (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" BOOLEAN DEFAULT FALSE,
        image TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE "session" (
        id TEXT PRIMARY KEY,
        "token" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
        "ipAddress" TEXT,
        "userAgent" TEXT
      );

      CREATE TABLE "account" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "expiresAt" TIMESTAMP,
        "idToken" TEXT,
        "password" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // E-commerce Tables
    await client.query(`
      CREATE TABLE category (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT
      );

      CREATE TABLE product (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        "categoryId" TEXT NOT NULL REFERENCES category(id),
        image TEXT,
        features JSONB, -- Bullet points
        specs JSONB,    -- Technical specs
        type TEXT NOT NULL DEFAULT 'physical', -- 'physical' or 'digital'
        "editionSize" INTEGER, -- For limited editions (e.g., 100)
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE product_variant (
        id TEXT PRIMARY KEY,
        "productId" TEXT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        name TEXT NOT NULL, -- e.g. "A3 Print" or "4K Download"
        options JSONB,      -- { size: "A3", frame: "Black" } or { format: "MP4" }
        stock INTEGER NOT NULL DEFAULT 0,
        sku TEXT
      );

      CREATE TABLE wishlist (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "productId" TEXT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE "order" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "user"(id),
        total DECIMAL(10, 2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        "paymentRef" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE order_item (
        id TEXT PRIMARY KEY,
        "orderId" TEXT NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
        "productId" TEXT NOT NULL REFERENCES product(id),
        "variantId" TEXT REFERENCES product_variant(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );
    `);

    // 3. Seed Data
    const categories = [
      {
        id: "cat_nft",
        name: "Digital Artifacts",
        slug: "digital-artifacts",
        description: "Verified NFTs and Digital Keys.",
      },
      {
        id: "cat_art",
        name: "Fine Art Prints",
        slug: "art-prints",
        description: "Museum-grade physical reproductions.",
      },
      {
        id: "cat_collect",
        name: "Collectibles",
        slug: "collectibles",
        description: "Limited edition statues and props.",
      },
      {
        id: "cat_access",
        name: "Access Keys",
        slug: "access-keys",
        description: "Membership tokens and passes.",
      },
    ];

    for (const cat of categories) {
      await client.query(
        "INSERT INTO category (id, name, slug, description) VALUES ($1, $2, $3, $4)",
        [cat.id, cat.name, cat.slug, cat.description]
      );
    }

    // Helper to generate UUIDs (simple version for seeding)
    const uuid = () =>
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Seed Products
    const products = [
      // DIGITAL ARTIFACTS (NFTs)
      {
        id: uuid(),
        name: "Genesis Cube #001",
        description:
          "The first iteration of the Genesis series. A perfectly rendered 4D hypercube containing the source code for the original protocol.",
        price: 2.5, // ETH equivalent or high value
        categoryId: "cat_nft",
        image:
          "https://images.unsplash.com/photo-1614726365723-49cfae988527?q=80&w=1000&auto=format&fit=crop",
        type: "digital",
        editionSize: 1,
        features: JSON.stringify([
          "1 of 1 Unique",
          "4K Render File",
          "Commercial Rights",
        ]),
        specs: JSON.stringify({
          Format: ".GLB",
          Size: "450MB",
          Chain: "Ethereum",
        }),
      },
      {
        id: uuid(),
        name: "Neon Samurai Glitch",
        description:
          "A corrupted memory file recovered from Sector 7. Displays a samurai silhouette against a dying sun.",
        price: 0.8,
        categoryId: "cat_nft",
        image:
          "https://images.unsplash.com/photo-1558478551-1a378f63328e?q=80&w=1000&auto=format&fit=crop",
        type: "digital",
        editionSize: 100,
        features: JSON.stringify([
          "Limited Edition",
          "Animated GIF",
          "Profile Picture",
        ]),
        specs: JSON.stringify({
          Format: ".GIF",
          Size: "12MB",
          Chain: "Solana",
        }),
      },
      // PHYSICAL ART
      {
        id: uuid(),
        name: "Cyber-Tokyo Skyline",
        description:
          "High-definition metal print of the Neo-Tokyo skyline in 2077. Printed on brushed aluminum.",
        price: 150.0,
        categoryId: "cat_art",
        image:
          "https://images.unsplash.com/photo-1504609773096-104ff10587a2?q=80&w=1000&auto=format&fit=crop",
        type: "physical",
        editionSize: 500,
        features: JSON.stringify([
          "Brushed Aluminum",
          "Wall Mount Included",
          "Signed by Artist",
        ]),
        specs: JSON.stringify({
          Dimensions: "24x36 inches",
          Weight: "2kg",
          Material: "Aluminum",
        }),
      },
      // COLLECTIBLES
      {
        id: uuid(),
        name: "Mecha-Head Replica",
        description:
          "1:1 Scale replica of the Unit-01 mechanical head. Features LED lighting and voice activation.",
        price: 450.0,
        categoryId: "cat_collect",
        image:
          "https://images.unsplash.com/photo-1535378437327-b7128d8de746?q=80&w=1000&auto=format&fit=crop",
        type: "physical",
        editionSize: 50,
        features: JSON.stringify([
          "LED Eyes",
          "Voice Activated",
          "Certificate of Authenticity",
        ]),
        specs: JSON.stringify({
          Scale: "1:1",
          Material: "Resin/ABS",
          Power: "USB-C",
        }),
      },
    ];

    for (const p of products) {
      await client.query(
        'INSERT INTO product (id, name, description, price, "categoryId", image, features, specs, type, "editionSize") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [
          p.id,
          p.name,
          p.description,
          p.price,
          p.categoryId,
          p.image,
          p.features,
          p.specs,
          p.type,
          p.editionSize,
        ]
      );

      // Add Variants
      if (p.type === "physical") {
        // Physical variants (e.g., Sizes)
        await client.query(
          'INSERT INTO product_variant (id, "productId", name, options, stock, sku) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            uuid(),
            p.id,
            "Standard",
            JSON.stringify({ size: "Standard" }),
            50,
            `SKU-${p.id.substring(0, 4)}-STD`,
          ]
        );
      } else {
        // Digital variants (e.g., License Types)
        await client.query(
          'INSERT INTO product_variant (id, "productId", name, options, stock, sku) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            uuid(),
            p.id,
            "Personal License",
            JSON.stringify({ license: "Personal" }),
            100,
            `SKU-${p.id.substring(0, 4)}-PER`,
          ]
        );
        await client.query(
          'INSERT INTO product_variant (id, "productId", name, options, stock, sku) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            uuid(),
            p.id,
            "Commercial License",
            JSON.stringify({ license: "Commercial" }),
            10,
            `SKU-${p.id.substring(0, 4)}-COM`,
          ]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Migration & Seeding Complete!");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Migration Failed:", e);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
