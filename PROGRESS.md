# MaaS Market — Build Progress

**@timothyglynn | Last updated: Apr 18, 2026**

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
* **Supabase env vars added to Vercel** — production site now connects to database
* **Stripe Connect dashboard setup** — Connect enabled, connected account created for self as first seller

## Known issues

* Home ISP (Charter/CujoAI) blocks maas-market.com on local network — works on cellular and other networks. Should resolve as domain builds reputation.
* Vercel Hobby plan can't link via Stripe Projects (team limit) — Vercel works fine independently

## Next steps (resume here)

1. **Stripe Connect code integration** — this is the immediate next step:
   * Need from user: Stripe test secret key (`sk_test_...`) and connected account ID (`acct_...`)
   * Wire "Buy Now" buttons to Stripe Checkout Sessions with destination charges
   * Build webhook handler for `checkout.session.completed`
   * Build "Sell on MaaS Market" onboarding flow (Express account creation + Stripe-hosted onboarding)
   * Dogfooding log: https://docs.google.com/document/d/185VkwLWJA8TMKjGIhp-9a8xqn8aSp_dtbDWG0H-NlD4
2. **Seller onboarding flow** — signup form, Stripe-hosted Account Links, basic seller dashboard
3. **Add real products** — use `/admin` to add actual product listings as items are ready

## Tech stack

* Next.js 16 / TypeScript / Tailwind CSS
* Supabase (PostgreSQL + auth + storage)
* Stripe Connect (Express accounts, destination charges)
* Vercel (hosting, auto-deploy)
* Cloudflare (domain, DNS)
* Node 22+ (via nodenv)
