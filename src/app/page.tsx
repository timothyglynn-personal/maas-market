"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
      .catch(() => {});
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentPage = Math.floor(startIndex / ITEMS_PER_PAGE);
  const visibleProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function goNext() {
    setStartIndex((i) => i + ITEMS_PER_PAGE >= products.length ? 0 : i + ITEMS_PER_PAGE);
  }
  function goPrev() {
    setStartIndex((i) => i - ITEMS_PER_PAGE < 0 ? Math.max(0, products.length - ITEMS_PER_PAGE) : i - ITEMS_PER_PAGE);
  }

  return (
    <div className="gallery-wall min-h-screen flex flex-col">
      <Header />

      {/* Hero section */}
      <section className="relative flex flex-col items-center pt-16 pb-8 px-4 overflow-hidden">
        {/* Llama watermark */}
        <div className="absolute right-[5%] top-8 opacity-[0.04] pointer-events-none select-none">
          <Image src="/llama.jpeg" alt="" width={300} height={300} className="rotate-12" />
        </div>

        {/* Title */}
        <div className="flex items-end gap-2 mb-4">
          <Image
            src="/Maas.png"
            alt="MaaS"
            width={220}
            height={75}
            className="drop-shadow-[0_0_20px_rgba(197,164,85,0.3)]"
            style={{ filter: "invert(1) brightness(2)" }}
          />
          <span
            className="spray-text spray-drip text-4xl md:text-5xl text-white/90 -mb-1"
            style={{ fontFamily: "var(--font-marker), cursive" }}
          >
            Market
          </span>
        </div>

        <p
          className="text-base md:text-lg tracking-widest uppercase text-purple-300/60 mb-2"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Wearable Art, Curated
        </p>

        {/* Splatter divider */}
        <div className="splatter-divider w-48 mt-6" />
      </section>

      {/* Gallery */}
      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-14">
        <p
          className="spray-text text-sm tracking-[0.3em] uppercase text-purple-300/50 mb-10"
          style={{ fontFamily: "var(--font-marker), cursive" }}
        >
          Current Exhibition
        </p>

        <div className="flex items-center gap-4 md:gap-8 w-full max-w-7xl justify-center">
          {totalPages > 1 && (
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full border-2 border-purple-700/50 text-purple-400/60 flex items-center justify-center hover:border-[#c5a455] hover:text-[#c5a455] hover:shadow-[0_0_15px_rgba(197,164,85,0.2)] transition-all shrink-0"
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
              className="w-10 h-10 rounded-full border-2 border-purple-700/50 text-purple-400/60 flex items-center justify-center hover:border-[#c5a455] hover:text-[#c5a455] hover:shadow-[0_0_15px_rgba(197,164,85,0.2)] transition-all shrink-0"
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
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentPage
                    ? "bg-[#c5a455] shadow-[0_0_8px_rgba(197,164,85,0.5)]"
                    : "bg-purple-700/40 hover:bg-purple-500/50"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </main>

      {/* Splatter divider */}
      <div className="splatter-divider w-64 mx-auto" />

      {/* Email signup */}
      <section className="w-full max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-lg p-8">
          <h2
            className="gold-shimmer text-xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Stay in the loop
          </h2>
          <p className="text-sm text-purple-300/50 mb-6">
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
              className="px-4 py-2 rounded-sm input-blurple text-sm w-64"
            />
            <button type="submit" className="btn-gold px-5 py-2 rounded-sm text-sm">
              Subscribe
            </button>
          </form>
          <p data-msg className="text-sm mt-3">&nbsp;</p>
        </div>
      </section>

      {/* Content suggestions */}
      <section className="w-full max-w-xl mx-auto px-4 pb-16 text-center">
        <div className="glass-card rounded-lg p-8">
          <h2
            className="text-xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-marker), cursive", color: "rgba(240,238,245,0.8)" }}
          >
            <span className="spray-text">Suggest content ideas</span>
          </h2>
          <p className="text-sm text-purple-300/50 mb-6">
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
              className="w-full px-4 py-2 rounded-sm input-blurple text-sm"
            />
            <input
              name="suggestEmail"
              type="email"
              placeholder="Your email (optional)"
              className="w-full px-4 py-2 rounded-sm input-blurple text-sm"
            />
            <button type="submit" className="btn-gold px-5 py-2 rounded-sm text-sm self-center">
              Submit
            </button>
          </form>
          <p data-suggest-msg className="text-sm mt-3">&nbsp;</p>
        </div>
      </section>

      <footer className="text-center py-8 text-xs text-purple-400/30 border-t border-purple-900/30">
        <span className="gold-shimmer">MaaS Market</span> &mdash; Wearable Art, Curated
      </footer>
    </div>
  );
}
