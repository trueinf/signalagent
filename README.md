# Signal - Lead Operating System

A modern Next.js application for managing and operating leads efficiently with AI-powered prioritization.

## Features

- **Today's Prioritized Leads**: AI-ranked lead list based on intent score, behavior signals, product interest, and urgency
- Lead management with comprehensive filtering (Source, Industry, Buyer Role, Age)
- Real-time lead prioritization with intent scoring
- Signal trail tracking for lead behavior
- AI-powered insights for each lead
- Responsive UI using IBM Carbon Design System tokens

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

3. Seed the database with sample data:
```bash
npm run db:seed
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Navigation Structure

- **Leads**
  - Today's Prioritized Leads
- **Renewals** (Coming soon)
- **Objection Tree** (Coming soon)
- **Insights** (Coming soon)

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with IBM Carbon Design tokens
- **Prisma** - Database ORM with SQLite
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons

## Database Schema

The Lead model includes:
- Contact information (name, email, phone, company, title)
- Lead status and prioritization fields
- Intent score (0-100)
- Signal trail (JSON array of behavioral signals)
- AI insights
- Source type, industry, and buyer role categorization

## Design System

The application uses IBM Carbon Design System tokens for:
- Colors (10-value palette per hue)
- Typography (IBM Plex Sans)
- Spacing (2px base grid)
- Components styled with design tokens
