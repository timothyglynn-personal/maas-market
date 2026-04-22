"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductFrame, { Product } from "@/components/ProductFrame";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "The Original",
    price: 45.0,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=750&fit=crop",
    ],
  },
  {
    id: "2",
    name: "Gallery Edition",
    price: 55.0,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=750&fit=crop",
    ],
  },
  {
    id: "3",
    name: "Street Canvas",
    price: 50.0,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4f94032fc?w=600&h=750&fit=crop",
    ],
  },
  {
    id: "4",
    name: "Monochrome",
    price: 48.0,
    images: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=750&fit=crop",
    ],
  },
];

const ITEMS_PER_PAGE = 4;

export default function Home() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Product[] = data.map((p: {
            id: string;
            name: string;
            price: number;
            product_images: { url: string; sort_order: number }[];
          }) => ({
            id: p.id,
            name: p.name,
            price: p.price / 100,
            images: p.product_images
              ?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
              .map((img: { url: string }) => img.url) || [],
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {
        // Keep sample products on error
      });
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentPage = Math.floor(startIndex / ITEMS_PER_PAGE);

  const visibleProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  function goNext() {
    setStartIndex((i) =>
      i + ITEMS_PER_PAGE >= products.length ? 0 : i + ITEMS_PER_PAGE
    );
  }

  function goPrev() {
    setStartIndex((i) =>
      i - ITEMS_PER_PAGE < 0
        ? Math.max(0, products.length - ITEMS_PER_PAGE)
        : i - ITEMS_PER_PAGE
    );
  }

  return (
    <div className="gallery-wall min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <p className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-12">
          Current Exhibition
        </p>

        <div className="flex items-center gap-4 md:gap-8 w-full max-w-7xl justify-center">
          {totalPages > 1 && (
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full border border-neutral-700 text-neutral-400 flex items-center justify-center hover:border-[#c5a455] hover:text-[#c5a455] transition-colors shrink-0"
              aria-label="Previous items"
            >
              &lsaquo;
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {visibleProducts.map((product) => (
              <ProductFrame key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full border border-neutral-700 text-neutral-400 flex items-center justify-center hover:border-[#c5a455] hover:text-[#c5a455] transition-colors shrink-0"
              aria-label="Next items"
            >
              &rsaquo;
            </button>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStartIndex(i * ITEMS_PER_PAGE)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === currentPage
                    ? "bg-[#c5a455]"
                    : "bg-neutral-700 hover:bg-neutral-500"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </main>

      {/* Email signup */}
      <section className="w-full max-w-xl mx-auto px-4 py-16 text-center">
        <h2
          className="text-xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#c5a455" }}
        >
          Stay in the loop
        </h2>
        <p className="text-sm text-neutral-400 mb-6">
          Sign up for the latest updates and swag drops
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem("email") as HTMLInputElement;
            const msg = form.querySelector("[data-msg]") as HTMLElement;
            const res = await fetch("/api/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: input.value }),
            });
            const data = await res.json();
            msg.textContent = data.message || data.error;
            msg.className = res.ok ? "text-sm text-green-400 mt-3" : "text-sm text-red-400 mt-3";
            if (res.ok) input.value = "";
          }}
          className="flex gap-2 justify-center"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-sm text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#c5a455]/50 w-64"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-sm text-sm font-semibold tracking-wider uppercase"
            style={{
              background: "linear-gradient(135deg, #c5a455 0%, #d4b96a 50%, #a68a3e 100%)",
              color: "#1a1714",
            }}
          >
            Subscribe
          </button>
        </form>
        <p data-msg className="text-sm mt-3">&nbsp;</p>
      </section>

      {/* Content suggestions */}
      <section className="w-full max-w-xl mx-auto px-4 pb-16 text-center">
        <h2
          className="text-xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#c5a455" }}
        >
          Suggest content ideas
        </h2>
        <p className="text-sm text-neutral-400 mb-6">
          Got an idea for a design, collab, or drop? We&apos;re all ears.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const messageEl = form.elements.namedItem("message") as HTMLTextAreaElement;
            const emailEl = form.elements.namedItem("suggestEmail") as HTMLInputElement;
            const msg = form.querySelector("[data-suggest-msg]") as HTMLElement;
            const res = await fetch("/api/suggest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: messageEl.value, email: emailEl.value }),
            });
            const data = await res.json();
            msg.textContent = data.message || data.error;
            msg.className = res.ok ? "text-sm text-green-400 mt-3" : "text-sm text-red-400 mt-3";
            if (res.ok) { messageEl.value = ""; emailEl.value = ""; }
          }}
          className="flex flex-col gap-3"
        >
          <textarea
            name="message"
            required
            rows={3}
            placeholder="Your idea..."
            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-sm text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#c5a455]/50"
          />
          <input
            name="suggestEmail"
            type="email"
            placeholder="Your email (optional)"
            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-sm text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#c5a455]/50"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-sm text-sm font-semibold tracking-wider uppercase self-center"
            style={{
              background: "linear-gradient(135deg, #c5a455 0%, #d4b96a 50%, #a68a3e 100%)",
              color: "#1a1714",
            }}
          >
            Submit
          </button>
        </form>
        <p data-suggest-msg className="text-sm mt-3">&nbsp;</p>
      </section>

      <footer className="text-center py-6 text-xs text-neutral-600 border-t border-neutral-800">
        MaaS Market &mdash; Wearable Art, Curated
      </footer>
    </div>
  );
}
