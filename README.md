# Traveloop

Traveloop is a full-stack travel planning web app for the Odoo hackathon. It supports multi-city trip planning, itinerary building, budgets, activities, packing lists, trip notes, public sharing, and an admin dashboard.

## Stack

- Frontend: React.js, React Router DOM, Axios, Recharts, normal CSS
- Backend: Node.js, Express.js, CommonJS
- Database: Neon PostgreSQL
- ORM: Prisma
- Auth: JWT and bcrypt
- Deployment: Vercel frontend, Render backend, Neon database

## Folder Structure

```text
Traveloop/
  client/   React frontend
  server/   Express + Prisma backend
```

## Backend Setup

```bash
cd server
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Set `DATABASE_URL` to your Neon PostgreSQL connection string.

## Frontend Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The frontend expects `VITE_API_URL=http://localhost:5000/api` in development.

## Demo Login

After seeding:

- Email: `maya@traveloop.app`
- Password: `password123`

