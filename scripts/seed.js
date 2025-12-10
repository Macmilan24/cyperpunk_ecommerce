const Database = require("better-sqlite3");
const db = new Database("dev.db");
const { v4: uuidv4 } = require("uuid");

const categories = [
  {
    id: uuidv4(),
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets and devices",
  },
  {
    id: uuidv4(),
    name: "Clothing",
    slug: "clothing",
    description: "Apparel for men and women",
  },
  {
    id: uuidv4(),
    name: "Accessories",
    slug: "accessories",
    description: "Jewelry, bags, and more",
  },
  {
    id: uuidv4(),
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture and decor",
  },
];

const products = [
  // Electronics
  {
    id: uuidv4(),
    name: "Minimalist Watch",
    description: "A sleek, modern watch for everyday wear.",
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    stock: 50,
    categorySlug: "electronics",
  },
  {
    id: uuidv4(),
    name: "Wireless Headphones",
    description: "High-quality sound with noise cancellation.",
    price: 200.0,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    stock: 100,
    categorySlug: "electronics",
  },
  {
    id: uuidv4(),
    name: "Smart Speaker",
    description: "Voice-controlled smart speaker for your home.",
    price: 80.0,
    image:
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNtYXJ0JTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",
    stock: 75,
    categorySlug: "electronics",
  },
  {
    id: uuidv4(),
    name: "Mechanical Keyboard",
    description: "Tactile mechanical keyboard for typing enthusiasts.",
    price: 150.0,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 40,
    categorySlug: "electronics",
  },

  // Clothing
  {
    id: uuidv4(),
    name: "Denim Jacket",
    description: "Classic denim jacket for a casual look.",
    price: 90.0,
    image:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D",
    stock: 60,
    categorySlug: "clothing",
  },
  {
    id: uuidv4(),
    name: "Cotton T-Shirt",
    description: "Soft and comfortable cotton t-shirt.",
    price: 25.0,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHNoaXJ0fGVufDB8fDB8fHww",
    stock: 200,
    categorySlug: "clothing",
  },
  {
    id: uuidv4(),
    name: "Summer Dress",
    description: "Light and airy dress for summer days.",
    price: 60.0,
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZHJlc3N8ZW58MHx8MHx8fDA%3D",
    stock: 45,
    categorySlug: "clothing",
  },

  // Accessories
  {
    id: uuidv4(),
    name: "Leather Backpack",
    description: "Durable leather backpack with multiple compartments.",
    price: 150.0,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFja3BhY2t8ZW58MHx8MHx8fDA%3D",
    stock: 30,
    categorySlug: "accessories",
  },
  {
    id: uuidv4(),
    name: "Sunglasses",
    description: "Stylish sunglasses with UV protection.",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D",
    stock: 80,
    categorySlug: "accessories",
  },

  // Home & Living
  {
    id: uuidv4(),
    name: "Ceramic Vase",
    description: "Handcrafted ceramic vase for your flowers.",
    price: 35.0,
    image:
      "https://images.unsplash.com/photo-1581783342308-f792ca438912?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2VyYW1pYyUyMHZhc2V8ZW58MHx8MHx8fDA%3D",
    stock: 25,
    categorySlug: "home-living",
  },
  {
    id: uuidv4(),
    name: "Throw Pillow",
    description: "Soft throw pillow to accent your sofa.",
    price: 20.0,
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGlsbG93fGVufDB8fDB8fHww",
    stock: 60,
    categorySlug: "home-living",
  },
  {
    id: uuidv4(),
    name: "Modern Lamp",
    description: "Industrial style desk lamp.",
    price: 55.0,
    image:
      "https://images.unsplash.com/photo-1513506003013-d5347801d969?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 40,
    categorySlug: "home-living",
  },
  {
    id: uuidv4(),
    name: "Wall Art Print",
    description: "Abstract geometric print, framed.",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 15,
    categorySlug: "home-living",
  },

  // More Electronics
  {
    id: uuidv4(),
    name: "Gaming Mouse",
    description: "High precision RGB gaming mouse.",
    price: 60.0,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 30,
    categorySlug: "electronics",
  },
  {
    id: uuidv4(),
    name: "4K Monitor",
    description: "27-inch 4K UHD IPS Monitor.",
    price: 350.0,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 10,
    categorySlug: "electronics",
  },

  // More Clothing
  {
    id: uuidv4(),
    name: "Hoodie",
    description: "Oversized comfortable hoodie.",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 80,
    categorySlug: "clothing",
  },
  {
    id: uuidv4(),
    name: "Sneakers",
    description: "Classic white sneakers.",
    price: 75.0,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 40,
    categorySlug: "clothing",
  },

  // More Accessories
  {
    id: uuidv4(),
    name: "Leather Wallet",
    description: "Slim bifold leather wallet.",
    price: 30.0,
    image:
      "https://images.unsplash.com/photo-1627123424574-181ce5171c98?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 100,
    categorySlug: "accessories",
  },
  {
    id: uuidv4(),
    name: "Beanie",
    description: "Warm knit beanie for winter.",
    price: 15.0,
    image:
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 150,
    categorySlug: "accessories",
  },
  {
    id: uuidv4(),
    name: "Mechanical Keyboard",
    description: "Tactile mechanical keyboard for typing enthusiasts.",
    price: 150.0,
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 40,
    categorySlug: "electronics",
  },
];

const insertCategory = db.prepare(
  "INSERT INTO category (id, name, slug, description) VALUES (?, ?, ?, ?)"
);
const insertProduct = db.prepare(
  "INSERT INTO product (id, name, description, price, image, stock, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

const transaction = db.transaction(() => {
  // Insert Categories
  for (const category of categories) {
    insertCategory.run(
      category.id,
      category.name,
      category.slug,
      category.description
    );
  }

  // Insert Products
  for (const product of products) {
    const category = categories.find((c) => c.slug === product.categorySlug);
    insertProduct.run(
      product.id,
      product.name,
      product.description,
      product.price,
      product.image,
      product.stock,
      category ? category.id : null
    );
  }
});

try {
  transaction();
  console.log("Database seeded successfully");
} catch (error) {
  console.error("Error seeding database:", error);
}
