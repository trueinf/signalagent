# Netlify Deployment Guide

## Prerequisites

1. A Netlify account (sign up at https://app.netlify.com)
2. GitHub repository connected (already done)

## Important Notes

⚠️ **Database Consideration**: This application currently uses SQLite, which doesn't work well on serverless platforms like Netlify. For production deployment, consider:

- Switching to PostgreSQL or another database that works with serverless
- Using Netlify's Postgres addon
- Using a managed database service (e.g., Supabase, PlanetScale, Neon)

## Deployment Steps

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select "GitHub" and authorize Netlify to access your repositories
4. Choose the `trueinf/signalagent` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `20`
6. Add environment variables (if needed):
   - `DATABASE_URL`: Your production database URL
7. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize the site:
   ```bash
   netlify init
   ```

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Environment Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

- `DATABASE_URL`: Your production database connection string

## Build Configuration

The `netlify.toml` file is already configured with:
- Next.js plugin for optimal Next.js support
- Node.js 20
- Proper build commands

## Database Setup for Production

For a production deployment, you'll need to:

1. Set up a PostgreSQL database (recommended):
   - Use Netlify Postgres addon, or
   - Use a service like Supabase, Neon, or PlanetScale

2. Update Prisma schema to use PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

## Troubleshooting

- If builds fail, check the build logs in Netlify dashboard
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version matches Netlify environment (20)

