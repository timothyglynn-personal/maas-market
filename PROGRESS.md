# MaaS Market — Build Progress

**@timothyglynn | Last updated: Apr 18, 2026**

---

## Completed

* **Domain:** maas-market.com registered on Cloudflare, pointed to Vercel
* **Repo:** github.com/timothyglynn-personal/maas-market (auto-deploys to Vercel on push)
* **Storefront UI:** Art gallery aesthetic — dark museum wall, gold ornate CSS frames, image carousels per product, page navigation, header with search + "Sell on MaaS Market" CTA
* **Deployed:** Live at maas-market.com and maas-market.vercel.app
* **QR codes:** Print-quality SVG and PNG in `public/` pointing to maas-market.com
* **Stripe Projects:** Initialized, Supabase provider linked
* **Supabase database:** Tables created (sellers, products, product_images) with Row Level Security
* **Admin page:** `/admin` for adding/editing/deleting products with images
* **Products API:** `/api/products` serves active products to the storefront
* **Stripe Connect:** Fully integrated in sandbox mode
  * Platform account: `acct_1TNiGDEALUlxsCs2` (sandbox)
  * Connected seller account: `acct_1TNigiE9MgvpljEt` (user as first seller)
  * Buy Now buttons → Stripe Checkout with destination charges, 10% platform fee
  * Shipping address collection (US, CA, GB, IE)
* **Seller onboarding:** `/sell` page with signup form → Stripe Express account creation → hosted onboarding

## Known issues

* Home ISP (Charter/CujoAI) blocks maas-market.com on local network — works on cellular and other networks
* Vercel Hobby plan can't link via Stripe Projects (team limit) — Vercel works fine independently
* Stripe Node SDK has connection issues on Vercel serverless — using direct `fetch` to Stripe API instead

## Next steps

1. **Add real products** — use `/admin` to add actual product listings with real images
2. **Build webhook handler** — `/api/webhooks/stripe` to listen for `checkout.session.completed` and track orders
3. **Seller dashboard** — let sellers view their products, sales, and payout status
4. **Go live** — swap sandbox keys to live keys, create live connected account
5. **Update dogfooding log** — document remaining steps in Google Doc

## Key accounts and IDs

* **Stripe sandbox platform:** `acct_1TNiGDEALUlxsCs2`
* **Stripe connected account (self as seller):** `acct_1TNigiE9MgvpljEt`
* **Supabase project:** `kgzvjgejnxawiwmzjkrg`
* **Vercel project:** `timothy-glynns-projects/maas-market`
* **Dogfooding log:** https://docs.google.com/document/d/185VkwLWJA8TMKjGIhp-9a8xqn8aSp_dtbDWG0H-NlD4

## Tech stack

* Next.js 16 / TypeScript / Tailwind CSS
* Supabase (PostgreSQL + auth + storage)
* Stripe Connect (Express accounts, destination charges)
* Vercel (hosting, auto-deploy)
* Cloudflare (domain, DNS)
* Node 22+ (via nodenv)
