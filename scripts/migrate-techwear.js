const Database = require("better-sqlite3");
const db = new Database("dev.db");

console.log("Initializing Techwear Migration...");

// 1. Drop existing tables to ensure clean slate for new schema
const tables = [
  "order_item",
  "order",
  "wishlist",
  "product_variant",
  "product",
  "category",
  "verification",
  "account",
  "session",
  "user",
];
tables.forEach((table) => {
  try {
    db.prepare(`DROP TABLE IF EXISTS "${table}"`).run();
  } catch (e) {
    console.log(`Note: Could not drop table ${table} (might not exist)`);
  }
});

// 2. Create Tables
db.exec(`
    CREATE TABLE user (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        emailVerified INTEGER DEFAULT 0,
        image TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
    );

    CREATE TABLE session (
        id TEXT PRIMARY KEY,
        expiresAt INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        ipAddress TEXT,
        userAgent TEXT,
        userId TEXT NOT NULL REFERENCES user(id)
    );

    CREATE TABLE account (
        id TEXT PRIMARY KEY,
        accountId TEXT NOT NULL,
        providerId TEXT NOT NULL,
        userId TEXT NOT NULL REFERENCES user(id),
        accessToken TEXT,
        refreshToken TEXT,
        idToken TEXT,
        accessTokenExpiresAt INTEGER,
        refreshTokenExpiresAt INTEGER,
        scope TEXT,
        password TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
    );

    CREATE TABLE verification (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expiresAt INTEGER NOT NULL,
        createdAt INTEGER,
        updatedAt INTEGER
    );

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
        price REAL NOT NULL,
        categoryId TEXT NOT NULL REFERENCES category(id),
        image TEXT,
        features TEXT, -- JSON string of bullet points
        specs TEXT,    -- JSON string of technical specs
        createdAt INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE product_variant (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL REFERENCES product(id),
        name TEXT NOT NULL, -- e.g. "Black / L"
        size TEXT,
        color TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        sku TEXT
    );

    CREATE TABLE wishlist (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL REFERENCES user(id),
        productId TEXT NOT NULL REFERENCES product(id),
        createdAt INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE "order" (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL REFERENCES user(id),
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE order_item (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL REFERENCES "order"(id),
        productId TEXT NOT NULL REFERENCES product(id),
        variantId TEXT REFERENCES product_variant(id),
        quantity INTEGER NOT NULL,
        price REAL NOT NULL
    );
`);

// 3. Seed Data
const categories = [
  {
    id: "cat_armor",
    name: "Armor",
    slug: "armor",
    description: "Outerwear shells and ballistic protection.",
  },
  {
    id: "cat_mobility",
    name: "Mobility",
    slug: "mobility",
    description: "Technical trousers and kinetic wear.",
  },
  {
    id: "cat_footgear",
    name: "Footgear",
    slug: "footgear",
    description: "All-terrain traversal units.",
  },
  {
    id: "cat_loadout",
    name: "Loadout",
    slug: "loadout",
    description: "Modular storage and auxiliary systems.",
  },
];

const insertCategory = db.prepare(
  "INSERT INTO category (id, name, slug, description) VALUES (?, ?, ?, ?)"
);
categories.forEach((cat) =>
  insertCategory.run(cat.id, cat.name, cat.slug, cat.description)
);

const products = [
  // ARMOR
  {
    id: "prod_spectre",
    name: "Spectre Shell V2",
    description:
      "Advanced waterproof hardshell with adaptive thermal regulation. Features magnetic quick-release fasteners and a deployable hood system.",
    price: 450.0,
    categoryId: "cat_armor",
    image:
      "https://images.unsplash.com/photo-1551488852-d80fd566195d?auto=format&fit=crop&q=80&w=800",
    features: JSON.stringify([
      "3-Layer Gore-Tex Pro",
      "Magnetic Fidlock Buckles",
      "Articulated Sleeves",
      "Hidden Comms Port",
    ]),
    specs: JSON.stringify({
      Waterproof: "20,000mm",
      Breathability: "15,000g/m²",
      Weight: "450g",
    }),
  },
  {
    id: "prod_ronin",
    name: "Ronin Field Jacket",
    description:
      "Modular field jacket with detachable utility pouches. Constructed from abrasion-resistant Cordura fabric.",
    price: 320.0,
    categoryId: "cat_armor",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
    features: JSON.stringify([
      "Cordura 500D",
      "MOLLE Compatible",
      "Reinforced Elbows",
      "Storm Flap",
    ]),
    specs: JSON.stringify({
      Material: "Cordura Nylon",
      Pockets: "8 External, 2 Internal",
      Fit: "Relaxed",
    }),
  },
  // MOBILITY
  {
    id: "prod_ghost",
    name: "Ghost Cargo Pants",
    description:
      "High-mobility cargo trousers with tapered fit and water-repellent coating. Multiple secure pockets for urban carry.",
    price: 180.0,
    categoryId: "cat_mobility",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
    features: JSON.stringify([
      "DWR Coating",
      "Tapered Fit",
      "Cargo Straps",
      "Ankle Cinch",
    ]),
    specs: JSON.stringify({
      Fabric: "Cotton/Nylon Blend",
      Stretch: "4-Way",
      Inseam: '32"',
    }),
  },
  {
    id: "prod_vector",
    name: "Vector Tech Shorts",
    description:
      "Lightweight utility shorts designed for high-output activity. Laser-cut ventilation and bonded seams.",
    price: 120.0,
    categoryId: "cat_mobility",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800",
    features: JSON.stringify([
      "Quick-Dry Fabric",
      "Magnetic Belt",
      "Hidden Phone Pocket",
      "Reflective Details",
    ]),
    specs: JSON.stringify({
      Weight: "150g",
      Liner: "Mesh",
      Length: "Above Knee",
    }),
  },
  // FOOTGEAR
  {
    id: "prod_strider",
    name: "Strider Combat Boots",
    description:
      "Urban combat boots with Vibram megagrip sole and side-zip entry. Waterproof and breathable.",
    price: 280.0,
    categoryId: "cat_footgear",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800",
    features: JSON.stringify([
      "Vibram Sole",
      "YKK Side Zip",
      "Composite Toe",
      "Anti-Fatigue Insole",
    ]),
    specs: JSON.stringify({
      Upper: "Full Grain Leather",
      Waterproof: "Yes",
      Height: '8"',
    }),
  },
  {
    id: "prod_runner",
    name: "Cyber Runner 2077",
    description:
      "Futuristic sneakers with knit upper and energy-return foam midsole. Laceless fit system.",
    price: 220.0,
    categoryId: "cat_footgear",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800",
    features: JSON.stringify([
      "Primeknit Upper",
      "Boost Midsole",
      "Sock-like Fit",
      "Carbon Plate",
    ]),
    specs: JSON.stringify({ Drop: "10mm", Weight: "220g", Terrain: "Urban" }),
  },
  // LOADOUT
  {
    id: "prod_sling",
    name: "Delta Sling Bag",
    description:
      "Cross-body sling for essential daily carry. Weatherproof zippers and internal organization.",
    price: 95.0,
    categoryId: "cat_loadout",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
    features: JSON.stringify([
      "X-Pac Fabric",
      "Fidlock V-Buckle",
      "Tablet Sleeve",
      "Key Tether",
    ]),
    specs: JSON.stringify({
      Volume: "6L",
      Weight: "300g",
      Dimensions: "30x20x10cm",
    }),
  },
];

const insertProduct = db.prepare(
  "INSERT INTO product (id, name, description, price, categoryId, image, features, specs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);
const insertVariant = db.prepare(
  "INSERT INTO product_variant (id, productId, name, size, color, stock, sku) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

products.forEach((prod) => {
  insertProduct.run(
    prod.id,
    prod.name,
    prod.description,
    prod.price,
    prod.categoryId,
    prod.image,
    prod.features,
    prod.specs
  );

  // Generate Variants
  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Black", "Olive", "Grey"];

  if (prod.categoryId === "cat_footgear") {
    // Shoe sizes
    const shoeSizes = ["US 8", "US 9", "US 10", "US 11", "US 12"];
    shoeSizes.forEach((size, i) => {
      insertVariant.run(
        `${prod.id}_v_${i}`,
        prod.id,
        `Black / ${size}`,
        size,
        "Black",
        Math.floor(Math.random() * 20), // Random stock
        `${prod.id.toUpperCase()}-BLK-${size.replace(" ", "")}`
      );
    });
  } else if (prod.categoryId === "cat_loadout") {
    // One size, multiple colors
    colors.forEach((color, i) => {
      insertVariant.run(
        `${prod.id}_v_${i}`,
        prod.id,
        `${color} / OS`,
        "OS",
        color,
        Math.floor(Math.random() * 50),
        `${prod.id.toUpperCase()}-${color.substring(0, 3).toUpperCase()}-OS`
      );
    });
  } else {
    // Clothing sizes and colors
    let vIndex = 0;
    colors.forEach((color) => {
      sizes.forEach((size) => {
        insertVariant.run(
          `${prod.id}_v_${vIndex++}`,
          prod.id,
          `${color} / ${size}`,
          size,
          color,
          Math.floor(Math.random() * 15),
          `${prod.id.toUpperCase()}-${color
            .substring(0, 3)
            .toUpperCase()}-${size}`
        );
      });
    });
  }
});

console.log(
  "Migration Complete. Database updated with Techwear schema and data."
);
