# NOXA — Setup Guide

This is a Next.js 16 site (App Router). The storefront works out of the box; three
integrations need **your own credentials** before they go live, because they touch
real accounts I can't create on your behalf:

1. Firebase (Google sign-in, orders, addresses, inbox, reviews)
2. Pathao Merchant Courier API (delivery booking)
3. Vercel (hosting)

Until you add the keys below, the site still runs — sign-in and checkout just show a
friendly "not configured yet" message instead of crashing.

## 1. Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. **Build → Authentication → Sign-in method** → enable **Google**.
3. **Build → Firestore Database** → **Create database** → start in production mode.
4. **Project settings → General → Your apps → Add app → Web** → copy the config
   object into `.env.local` (see `.env.local.example`) as the `NEXT_PUBLIC_FIREBASE_*` values.
5. **Project settings → Service accounts → Generate new private key** → downloads a JSON
   file. Minify it to one line (e.g. `jq -c . serviceAccount.json`) and paste it as
   `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env.local`. This one is server-only — never expose it
   in client code or commit it.
6. Copy the contents of [`firestore.rules`](./firestore.rules) in this repo into
   **Firestore → Rules** in the Firebase console and publish. It locks reads/writes to
   each signed-in user's own data, and makes order-status updates and review moderation
   admin-only (done server-side via the Admin SDK, never directly by a client).

7. In **Authentication → Settings → Authorized domains**, add your Vercel domain once deployed.

## 2. Admin panel (`/admin`)

A built-in admin panel lets you manage orders, moderate reviews, and reply to the
support inbox — all in one place, gated behind Google sign-in.

1. Set `ADMIN_EMAILS` in `.env.local` to a comma-separated list of the Google account
   email(s) that should have access, e.g. `ADMIN_EMAILS=you@gmail.com`.
2. Make sure `FIREBASE_SERVICE_ACCOUNT_KEY` is set (step 5 above) — the admin panel's
   API routes run server-side through the Admin SDK, which bypasses Firestore rules
   entirely, so access control happens purely through the `ADMIN_EMAILS` check.
3. Visit `/admin` on your site, sign in with an allowed Google account, and you'll see:
   - **Orders** — every order, with a status dropdown (Order Placed → ... → Delivered).
   - **Reviews** — every submitted review, with Publish/Unpublish and Delete.
   - **Inbox** — every customer's support thread, with a reply box.

Anyone signing in with a non-admin email sees a clear "Not authorized" message instead
of any data.

## 3. Pathao Merchant Courier API

1. Register as a merchant at [pathao.com](https://pathao.com) and request API access from
   your Merchant Dashboard → **API Credentials**. You'll get a `client_id`, `client_secret`,
   and use your dashboard login as `username`/`password`.
2. Note your `store_id` from the dashboard's store list.
3. Fill in the `PATHAO_*` variables in `.env.local`. Start with the sandbox base URL to test,
   then switch `PATHAO_BASE_URL` to the production URL when you're ready to go live.
4. Optional but recommended: in the dashboard, set a **Webhook URL** pointing to
   `https://yourdomain.com/api/pathao/webhook` and copy the webhook secret into
   `PATHAO_WEBHOOK_SECRET` — this keeps order tracking (in the customer's profile drawer)
   updated automatically as Pathao moves the parcel.

Without these, checkout still creates the order in Firestore and shows in the customer's
"My Orders" tab — it just won't auto-book a Pathao pickup until you add credentials.

## 4. Deploying to Vercel

1. Push this project to a GitHub repo.
2. In Vercel: **Add New → Project** → import the repo.
3. In **Settings → Environment Variables**, add every variable from `.env.local.example`
   with your real values (do this for Production, Preview and Development).
4. Deploy. Vercel runs `npm install` and `npm run build` automatically.

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in your values
npm run dev
```

## What's already wired up

- **Storefront**: hero, colorway auto-rotation, add to cart, buy flow — works immediately, no keys needed.
- **Sign-in**: Google via Firebase Auth, gated before checkout.
- **Delivery address**: saved per-user in Firestore, matches a standard BD address form
  (name, phone, email, region, city, area, address, address type).
- **Orders**: created in Firestore on checkout; visible with a live status timeline
  (Order Placed → Processing → Confirmed → Packing → Packed → Delivering → Payment → Delivered)
  in the profile drawer.
- **Pathao booking**: fires automatically after checkout via `/api/pathao/create-order`
  once `PATHAO_*` env vars are set.
- **Inbox**: a simple per-user support thread in the profile drawer, plus direct links to
  the support email and WhatsApp number in the footer and profile drawer.
- **Reviews**: the visible reviews are static/curated; the "Write a review" form at the
  bottom of the Reviews section saves submissions to a `reviews` collection with
  `published: false` for you to review before publishing them yourself.
- **Admin panel** (`/admin`): manage orders, publish/delete reviews, and reply to
  customer support threads — gated to the emails in `ADMIN_EMAILS`. See section 2 above.
