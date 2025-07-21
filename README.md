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
