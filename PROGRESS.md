# MaaS Market — Build Progress

**@timothyglynn | Last updated: Apr 17, 2026**

---

## Completed

* **Domain:** maas-market.com registered on Cloudflare, pointed to Vercel
* **Repo:** github.com/timothyglynn-personal/maas-market (auto-deploys to Vercel on push)
* **Storefront UI:** Art gallery aesthetic — dark museum wall, gold ornate CSS frames, image carousels per product, page navigation, header with search + "Sell on MaaS Market" CTA
* **Deployed:** Live at maas-market.com and maas-market.vercel.app
* **QR codes:** Print-quality SVG and PNG in `public/` pointing to maas-market.com (high error correction for fabric printing)
* **Stripe Projects:** Initialized, Supabase provider linked
* **Supabase database:** Tables created (sellers, products, product_images) with Row Level Security
* **Admin page:** `/admin` for adding/editing/deleting products with images
* **Products API:** `/api/products` serves active products to the storefront, falls back to sample data when DB is empty

## Known issues

* Home ISP (Charter/CujoAI) blocks maas-market.com on local network — works on cellular and other networks. Should resolve as domain builds reputation.
* Vercel Hobby plan can't link via Stripe Projects (team limit) — Vercel works fine independently

## Next steps

1. **Add Supabase env vars to Vercel** — the production site needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` set in Vercel project settings so the database works in production (currently only works locally via `.env`)
2. **Stripe Connect setup (hands-on)** — enable Connect on Stripe account, create Express connected account for self (platform owner + seller), configure destination charges, integrate Stripe Checkout with "Buy Now" buttons. This is a guided hands-on step with dogfooding log.
3. **Seller onboarding flow** — "Sell on MaaS Market" button leads to signup form, Stripe-hosted Account Links for Express account onboarding, basic seller dashboard
4. **Add real products** — use `/admin` to add actual product listings as items are ready

## Tech stack

* Next.js 16 / TypeScript / Tailwind CSS
* Supabase (PostgreSQL + auth + storage)
* Stripe Connect (Express accounts, destination charges)
* Vercel (hosting, auto-deploy)
* Cloudflare (domain, DNS)
* Node 22+ (via nodenv)
