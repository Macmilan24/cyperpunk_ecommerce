# Deployment Guide (Vercel + PostgreSQL)

## 1. Prerequisites

- A GitHub account.
- A Vercel account.
- This project pushed to a GitHub repository.

## 2. Setup Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Import your `cyperpunk_ecommerce` repository.
4. **Framework Preset**: Next.js (default).
5. **Root Directory**: `store` (Since your project is in the `store` folder).
   - _Note: If Vercel doesn't auto-detect the `store` folder, make sure to edit the Root Directory setting during import._

## 3. Configure Database (Vercel Postgres)

1. After importing (or in the Project Settings -> Storage), click **"Connect Store"**.
2. Select **"Postgres"** (Vercel Postgres / Neon).
3. Create a new database (e.g., `nexus-db`).
4. Select your region (e.g., `Washington, D.C. (iad1)` or closest to you).
5. Click **"Connect"**.
   - This will automatically add environment variables like `POSTGRES_URL`, `POSTGRES_USER`, etc., to your project.

## 4. Environment Variables

Go to **Settings** -> **Environment Variables** and add the following:

| Variable             | Value                                  | Description                                                                        |
| -------------------- | -------------------------------------- | ---------------------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET` | `(Generate a random string)`           | You can generate one using `openssl rand -base64 32` or any password generator.    |
| `BETTER_AUTH_URL`    | `https://your-project-name.vercel.app` | Your Vercel deployment URL. Update this after the first deploy if the URL changes. |

_Note: `POSTGRES_URL` and `DATABASE_URL` should be handled automatically by the Vercel Postgres integration. If not, copy `POSTGRES_URL` value to `DATABASE_URL`._

## 5. Initial Deployment

1. Click **"Deploy"**.
2. The build might succeed, but the application will error at runtime because the **database is empty** (no tables).

## 6. Run Migrations (Create Tables & Seed Data)

Since we can't easily run the migration script inside the Vercel build process, run it **locally** connecting to the **production** database.

1. Go to Vercel Dashboard -> Project -> **Storage** -> **.env.local**.
2. Copy the `POSTGRES_URL` (and other variables).
3. In your local terminal (VS Code):

   ```powershell
   # Set the production URL temporarily (Windows PowerShell)
   $env:POSTGRES_URL="postgres://default:..." # Paste your Vercel POSTGRES_URL here

   # Run the migration
   npm run db:migrate
   ```

   _Alternatively, you can create a `.env.production` file locally with the Vercel credentials and run the script._

4. The script will:
   - Connect to the Vercel database.
   - Create the tables (`user`, `session`, `product`, etc.).
   - Seed the initial "Nexus" products.

## 7. Verify

Visit your Vercel URL. The site should load with the "Nexus Market" theme and products.

## Troubleshooting

- **500 Error**: Check Vercel Logs. Usually means DB connection failed or `BETTER_AUTH_SECRET` is missing.
- **Images not loading**: Ensure `images.unsplash.com` is in `next.config.ts` (it is already configured).
