# 🌌 NEXUS MARKET

![Project Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

> **The Future of Hybrid Commerce.**  
> A cyberpunk-themed marketplace bridging the gap between physical collectibles and digital assets.

---

## 🚀 Overview

**Nexus Market** is a cutting-edge e-commerce platform designed for the next generation of digital natives. It seamlessly integrates physical goods (streetwear, hardware) with digital assets (NFTs, software keys, art) in a unified shopping experience.

Built with performance and scalability in mind, it leverages the latest web technologies to deliver a blazing-fast, immersive user experience wrapped in a distinct "High Tech, Low Life" aesthetic.

## ✨ Key Features

- **🛍️ Hybrid Inventory System**: Support for both `Physical` (shipping required) and `Digital` (instant delivery) product types.
- **🔐 Robust Authentication**: Secure user management powered by **Better-Auth** and **PostgreSQL**.
- **🎨 Cyberpunk UI/UX**: Immersive interface featuring glassmorphism, neon accents, and smooth **Framer Motion** animations.
- **⚡ Next.js 16 Architecture**: Utilizing React Server Components (RSC) and Turbopack for optimal performance.
- **🛒 State Management**: Global cart and user state managed via **Zustand**.
- **📱 Responsive Design**: Mobile-first approach ensuring a perfect experience on any device.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via `pg` driver)
- **Authentication**: [Better-Auth](https://better-auth.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL Database (Local or Cloud)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Macmilan24/cyperpunk_ecommerce.git
   cd cyperpunk_ecommerce/store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/nexus_db"
   BETTER_AUTH_SECRET="your_generated_secret_here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Database Migration & Seeding**
   Initialize the database schema and seed initial products:

   ```bash
   npm run db:migrate
   ```

5. **Start the Development Server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to enter the Nexus.

## 🚀 Deployment

This project is optimized for deployment on **Vercel**.

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Connect a Vercel Postgres database.
4. Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in Vercel Environment Variables.
5. Run the migration script locally against the production database URL to seed data.

See [DEPLOY.md](./DEPLOY.md) for a detailed step-by-step guide.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

_Built with 💜 by Macmilan24_
