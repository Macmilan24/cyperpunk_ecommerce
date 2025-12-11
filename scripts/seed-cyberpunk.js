const { Pool } = require("pg");
const { v4: uuid } = require("uuid");
require("dotenv").config();

async function main() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) throw new Error("DATABASE_URL/POSTGRES_URL missing");

  const pool = new Pool({
    connectionString,
    ssl:
      connectionString &&
      (connectionString.includes("localhost") ||
        connectionString.includes("127.0.0.1"))
        ? false
        : { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    console.log("Seeding professional demo data...");
    await client.query("BEGIN");

    // Ensure categories exist
    const categories = [
      {
        id: "cat_nft",
        name: "Digital Artifacts",
        slug: "digital-artifacts",
        description: "Verified NFTs and Digital Keys.",
      },
      {
        id: "cat_digital",
        name: "Digital Assets",
        slug: "digital",
        description: "Downloadable content and software.",
      },
      {
        id: "cat_physical",
        name: "Physical Gear",
        slug: "physical",
        description: "Apparel and hardware.",
      },
      {
        id: "cat_art",
        name: "Fine Art Prints",
        slug: "art-prints",
        description: "Museum-grade physical reproductions.",
      },
    ];

    for (const c of categories) {
      await client.query(
        "INSERT INTO category (id, name, slug, description) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description",
        [c.id, c.name, c.slug, c.description]
      );
    }

    // Seed 60 NFT items (CC0-style metadata)
    const nftProducts = Array.from({ length: 60 }).map((_, i) => {
      const id = uuid();
      const tokenId = (i + 1).toString();
      const name = `NOUNS DERIVATIVE #${tokenId}`;
      const image = `https://api.dicebear.com/9.x/notionists/svg?seed=${tokenId}`;
      const attributes = [
        { trait_type: "Background", value: ["Green", "Blue", "Purple"][i % 3] },
        { trait_type: "Eyes", value: ["Round", "Sharp", "Hidden"][i % 3] },
      ];
      return {
        id,
        name,
        description: "Community-sourced CC0 derivative artwork.",
        price: (50 + (i % 10) * 10).toFixed(2),
        categoryId: "cat_nft",
        image,
        creator: "CC0 Collective",
        collection: "Nouns Derivatives",
        chain: "Ethereum",
        tokenId,
        attributes,
        type: "digital",
        editionSize: 1,
      };
    });

    // Seed 40 museum digital artworks (public domain)
    const artProducts = Array.from({ length: 40 }).map((_, i) => {
      const id = uuid();
      const name = `Public Domain Artwork ${i + 1}`;
      const image = `https://picsum.photos/seed/art-${i + 1}/1000/800`;
      return {
        id,
        name,
        description: "High-resolution public domain artwork",
        price: (20 + (i % 5) * 5).toFixed(2),
        categoryId: "cat_digital",
        image,
        creator: "Museum Collection",
        collection: "Open Collection",
        chain: null,
        tokenId: null,
        attributes: [
          {
            trait_type: "Era",
            value: ["Modern", "Classical", "Renaissance"][i % 3],
          },
        ],
        type: "digital",
        editionSize: 100,
      };
    });

    const products = [...nftProducts, ...artProducts];

    for (const p of products) {
      await client.query(
        'INSERT INTO product (id, name, description, price, "categoryId", image, creator, collection, chain, "tokenId", attributes, type, "editionSize") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id) DO NOTHING',
        [
          p.id,
          p.name,
          p.description,
          p.price,
          p.categoryId,
          p.image,
          p.creator,
          p.collection,
          p.chain,
          p.tokenId,
          JSON.stringify(p.attributes),
          p.type,
          p.editionSize,
        ]
      );

      // Add simple variants
      if (p.type === "digital") {
        await client.query(
          'INSERT INTO product_variant (id, "productId", name, options, stock, sku) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
          [
            uuid(),
            p.id,
            "Standard License",
            JSON.stringify({ license: "Standard" }),
            9999,
            `SKU-${p.id.substring(0, 4)}-STD`,
          ]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Seeding complete: ", products.length, "products");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Seeding failed:", e);
  } finally {
    client.release();
    process.exit(0);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
