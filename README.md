# NEXUS MARKET

### The Next-Generation Hybrid Commerce Platform

![Project Status](https://img.shields.io/badge/Status-Production_Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

---

## 📖 Table of Contents

- [Project Vision](#-project-vision)
- [System Architecture](#-system-architecture)
- [User Journey & Flow](#-user-journey--flow)
- [Technical Stack](#-technical-stack)
- [Key Features](#-key-features)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)

---

## 🔭 Project Vision

**Nexus Market** is a sophisticated e-commerce solution designed to handle a **"Hybrid Inventory"** model. Unlike traditional stores that sell only physical goods or only digital downloads, Nexus unifies these into a single, seamless customer experience.

It solves the complexity of managing shipping logistics for physical items (streetwear, hardware) while simultaneously handling instant delivery protocols for digital assets (software licenses, digital art, keys). The platform provides a unified interface where a user can purchase a physical hoodie and a digital software key in the same transaction, with the backend intelligently routing the fulfillment logic.

---

## 🏗 System Architecture

The application is built on a **Monolithic Next.js Architecture** utilizing the App Router for maximum performance and SEO optimization.

- **Server-Side Rendering (SSR)**: Used for product pages and category listings to ensure fast initial loads and indexability.
- **Client-Side Interactivity**: React Server Components (RSC) are interleaved with Client Components for dynamic features like the Cart, Wishlist, and Checkout.
- **Data Layer**: A PostgreSQL database serves as the single source of truth, accessed via a connection pool for high concurrency.
- **State Management**: Global client state (Cart, User Session) is managed via Zustand, persisting across page navigations.

---

## 🔄 User Journey & Flow

### 1. Discovery & Navigation

- **Landing**: Users are greeted with a high-performance hero section showcasing featured hybrid assets.
- **Categorization**: The inventory is strictly divided but unified in UI:
  - **Physical**: Requires shipping address logic.
  - **Digital**: Requires email delivery logic.
- **Search**: Real-time search overlay allows users to find products instantly without page reloads.

### 2. Product Interaction

- **Dynamic Routing**: Each product has a unique SEO-friendly URL (`/product/[id]`).
- **Variant Selection**:
  - _Physical Items_: Users select Size (S/M/L) and Color.
  - _Digital Items_: Users select License Type (Personal/Commercial) or Format.
- **Wishlist**: Authenticated users can save items for later (stored in Postgres).

### 3. Cart & Checkout

- **Atomic Cart State**: The cart persists locally and updates in real-time.
- **Authentication Gate**: Users must sign in/up to proceed to checkout.
- **Order Creation**:
  - The system generates a unique Order ID.
  - Splits line items into `order_item` records.
  - Calculates totals and initiates the payment gateway session.

### 4. Post-Purchase

- **Order History**: Users can view past physical and digital orders.
- **Fulfillment**:
  - Physical orders enter a "Pending Shipping" state.
  - Digital orders trigger an immediate "Delivered" state (simulated).

---

## 💻 Technical Stack

### Core Framework

- **Next.js 16**: Leveraging the latest features like Server Actions and Turbopack.
- **TypeScript**: Strict type safety across the entire codebase, ensuring robust data handling from DB to UI.

### Database & Backend

- **PostgreSQL**: Chosen for its reliability and relational data integrity.
- **node-postgres (`pg`)**: Direct, low-level database driver for maximum control over queries and connection pooling.
- **Better-Auth**: A modern, type-safe authentication library handling sessions, password hashing, and user management securely.

### Frontend & UI

- **Tailwind CSS**: Utility-first styling for rapid development and consistent design tokens.
- **Framer Motion**: Physics-based animation library used for page transitions, modal interactions, and micro-interactions.
- **Lucide React**: Consistent, lightweight icon set.

### State & Utilities

- **Zustand**: A small, fast, and scalable bearbones state-management solution. Used for the Shopping Cart to avoid React Context re-render issues.
- **Zod**: Schema validation for API routes and form inputs.

---

## 🔑 Key Features

| Feature                    | Description                                                                            |
| :------------------------- | :------------------------------------------------------------------------------------- |
| **Hybrid Product Support** | Native support for products that are physical (shipping) or digital (download).        |
| **Real-time Search**       | Instant product filtering and discovery.                                               |
| **Secure Authentication**  | Email/Password login with session management via Better-Auth.                          |
| **Persistent Cart**        | Cart contents survive page reloads and browser sessions.                               |
| **Responsive Design**      | Mobile-first architecture ensuring perfect rendering on phones, tablets, and desktops. |
| **Payment Integration**    | Ready-to-use structure for Chapa payment gateway integration.                          |

---

## 🗄 Database Schema

The project uses a relational schema optimized for e-commerce:

- **`User`**: Stores account info, email, and hashed passwords.
- **`Session`**: Manages active user login sessions.
- **`Product`**: The core entity. Contains `type` ('physical' | 'digital'), `price`, `stock`, and `jsonb` for flexible metadata.
- **`ProductVariant`**: Handles SKUs (e.g., Red/XL or Commercial License).
- **`Order`**: The parent record for a transaction.
- **`OrderItem`**: Links specific products/variants to an order at a specific price point.
- **`Wishlist`**: Many-to-many relationship between Users and Products.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL Database (Local or Cloud like Neon/Vercel)

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

4. **Database Migration**
   Initialize the database schema and seed initial data:

   ```bash
   npm run db:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## ☁️ Deployment

This project is optimized for **Vercel**.

1. **Push to GitHub**.
2. **Import to Vercel**.
3. **Connect Vercel Postgres**: This automatically sets `POSTGRES_URL`.
4. **Configure Environment**: Add `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.
5. **Run Migrations**: Execute `npm run db:migrate` locally while connected to the remote database URL.

For a detailed step-by-step deployment guide, please refer to [DEPLOY.md](./DEPLOY.md).

---

_Documentation maintained by Macmilan24_
