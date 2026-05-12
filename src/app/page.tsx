"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Header from "@/components/Header";
import ProductFrame, { Product } from "@/components/ProductFrame";
import ProductModal from "@/components/ProductModal";

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

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return createPortal(
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-modal-in">
      <div className="glass-card rounded-lg px-6 py-4 border border-[#c5a455]/30 shadow-[0_0_30px_rgba(197,164,85,0.2)]">
        <p className="text-[#c5a455] text-sm font-medium">{message}</p>
      </div>
    </div>,
    document.body
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Product[] = data.map((p: {
            id: string;
            name: string;
            description: string | null;
            price: number;
            seller_id: string | null;
            product_images: { url: string; sort_order: number }[];
          }) => ({
            id: p.id,
            name: p.name,
            description: p.description || undefined,
            price: p.price / 100,
            sellerId: p.seller_id || "",
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
      <section className="relative flex flex-col items-center pt-14 pb-6 px-4 overflow-hidden">
        {/* Llama watermark */}
        <div className="absolute right-[5%] top-4 opacity-[0.05] pointer-events-none select-none">
          <Image src="/llama.jpeg" alt="" width={350} height={350} className="rotate-12" />
        </div>

        {/* Title — MaaS Market as one unified phrase */}
        <div className="flex items-center gap-0 mb-3">
          <Image
            src="/maas-logo.png"
            alt="MaaS"
            width={180}
            height={62}
            className="drop-shadow-[0_0_20px_rgba(197,164,85,0.3)]"
          />
          <span
            className="text-4xl md:text-5xl text-white/90 -ml-1 -mt-2 relative"
            style={{
              fontFamily: "var(--font-marker), cursive",
              textShadow: "0 0 12px rgba(255,255,255,0.25), 0 0 30px rgba(140,80,220,0.2), 3px 3px 0 rgba(0,0,0,0.5)",
              transform: "rotate(-3deg) skewX(-3deg)",
              display: "inline-block",
            }}
          >
            Market
            {/* Drip */}
            <span className="absolute -bottom-2 left-[20%] w-[3px] h-[14px] bg-white/30 rounded-b-full" />
            <span className="absolute -bottom-3 left-[65%] w-[2px] h-[10px] bg-white/20 rounded-b-full" />
          </span>
        </div>

        <div className="splatter-divider w-56 mt-4" />
      </section>

      {/* Subscribe — at the top */}
      <section className="w-full max-w-xl mx-auto px-4 py-8 text-center">
        <div className="glass-card rounded-xl p-8">
          <h2 className="spray-text text-xl text-white/90 mb-2" style={{ fontFamily: "var(--font-marker), cursive" }}>
            Subscribe for updates to the latest drops
          </h2>
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
              if (res.ok) {
                input.value = "";
                setToast(data.message || "You're in!");
              } else {
                msg.textContent = data.error;
                msg.className = "text-sm text-red-400 mt-3";
              }
            }}
            className="flex gap-2 justify-center mt-4"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="px-4 py-2.5 rounded-sm input-blurple text-sm w-64"
            />
            <button type="submit" className="btn-gold px-5 py-2.5 rounded-sm text-sm">
              Subscribe
            </button>
          </form>
          <p data-msg className="text-sm mt-3">&nbsp;</p>
        </div>
      </section>

      {/* Gallery */}
      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-12">
        <p
          className="spray-text text-base tracking-[0.3em] uppercase text-purple-300/40 mb-10"
          style={{ fontFamily: "var(--font-marker), cursive" }}
        >
          Current Exhibition
        </p>

        <div className="flex items-center gap-4 md:gap-8 w-full max-w-7xl justify-center">
          {totalPages > 1 && (
            <button
              onClick={goPrev}
              className="w-12 h-12 rounded-full border-2 border-purple-700/40 text-purple-400/50 flex items-center justify-center text-lg hover:border-[#c5a455] hover:text-[#c5a455] hover:shadow-[0_0_20px_rgba(197,164,85,0.25)] transition-all shrink-0"
              aria-label="Previous items"
            >
              &lsaquo;
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {visibleProducts.map((product) => (
              <ProductFrame
                key={product.id}
                product={product}
                onSelect={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <button
              onClick={goNext}
              className="w-12 h-12 rounded-full border-2 border-purple-700/40 text-purple-400/50 flex items-center justify-center text-lg hover:border-[#c5a455] hover:text-[#c5a455] hover:shadow-[0_0_20px_rgba(197,164,85,0.25)] transition-all shrink-0"
              aria-label="Next items"
            >
              &rsaquo;
            </button>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex gap-3 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStartIndex(i * ITEMS_PER_PAGE)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentPage
                    ? "bg-[#c5a455] shadow-[0_0_10px_rgba(197,164,85,0.6)]"
                    : "bg-purple-700/30 hover:bg-purple-500/40"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </main>

      <div className="splatter-divider w-72 mx-auto" />

      {/* Content suggestions */}
      <section className="w-full max-w-xl mx-auto px-4 py-14 text-center">
        <div className="glass-card rounded-xl p-8">
          <h2 className="spray-text text-xl text-white/90 mb-2" style={{ fontFamily: "var(--font-marker), cursive" }}>
            Suggest content ideas
          </h2>
          <p className="text-sm text-purple-300/40 mb-6">
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
              if (res.ok) {
                messageEl.value = "";
                emailEl.value = "";
                setToast(data.message || "Thanks for the suggestion!");
              } else {
                msg.textContent = data.error;
                msg.className = "text-sm text-red-400 mt-3";
              }
            }}
            className="flex flex-col gap-3"
          >
            <textarea
              name="message"
              required
              rows={3}
              placeholder="Your idea..."
              className="w-full px-4 py-2.5 rounded-sm input-blurple text-sm"
            />
            <input
              name="suggestEmail"
              type="email"
              placeholder="Your email (optional)"
              className="w-full px-4 py-2.5 rounded-sm input-blurple text-sm"
            />
            <button type="submit" className="btn-gold px-5 py-2.5 rounded-sm text-sm self-center">
              Submit
            </button>
          </form>
          <p data-suggest-msg className="text-sm mt-3">&nbsp;</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-3 py-10 border-t border-purple-900/20">
        <Image src="/llama.jpeg" alt="MaaS Market" width={32} height={32} className="rounded-full opacity-40" />
        <p className="text-xs text-purple-400/25">
          <span className="gold-shimmer">MaaS Market</span> &mdash; Wearable Art, Curated
        </p>
      </footer>

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Toast notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
