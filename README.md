# What the Project Does (in simple terms)
This Time Tracking App has two parts:

✅ 1. Next.js Web App
Used by the manager or administrator to:

Invite employees

View time logs

Manage billing (Stripe)

Connect to cloud (AWS S3, Google OAuth)

View usage reports, team status, etc.

✅ 2. Electron Desktop App
Installed on each employee's desktop. It:

Tracks activity (e.g., working time, idle time)

Sends screenshots, logs, or activity data to the server

Authenticates the user with credentials

Uploads data securely to your web app (S3 or DB)

💼 Purpose (Why this setup exists)
The main goal is to monitor remote employees (home office workers), including:

When they started/stopped work

What applications/websites they used (if implemented)

Screenshots every X minutes (if you enable that)

Total active hours per day

Time spent on tasks/projects (manual or automatic)



# 🧪 Project Setup Guide: Next.js App + Electron App

This project contains two main parts:

- **Frontend & API** — built with [Next.js](https://nextjs.org)
- **Desktop Tracker** — built with [Electron](https://www.electronjs.org/)

---

## ⚙️ Requirements

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) or `npm`
- [PostgreSQL](https://www.postgresql.org/) (or any DB supported by Prisma)
- AWS account (for S3 usage)
- Google Cloud OAuth credentials
- Stripe account (for billing)

---

## 🧩 Next.js App (Web App)

### 1. Create a `.env` file in the root of the **Next.js** app

```env
# .env
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL="x-company@resend.dev"
PREMIUM_PRICE_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_URL_SUCCESS_PRODUCTION_REDIRECT="http://localhost:3000/billing/success"
STRIPE_URL_CANCEL_PRODUCTION_REDIRECT="http://localhost:3000/billing/cancel"
```
Then run: npx prisma db push

Then start the website: yarn next dev

# The Electrone APP

```env
# .env
JWT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=
NODE_ENV=development
```
Then run: npm install


Start the Electron app in development mode
npm run dev:watch.
