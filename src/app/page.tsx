"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductFrame, { Product } from "@/components/ProductFrame";

// Placeholder products — will be replaced with database-driven content
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
  {
    id: "5",
    name: "The Statement",
    price: 60.0,
    images: [
      "https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop",
    ],
  },
  {
    id: "6",
    name: "Varsity Collection",
    price: 120.0,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=750&fit=crop",
    ],
  },
];

const ITEMS_PER_PAGE = 4;

export default function Home() {
  const [startIndex, setStartIndex] = useState(0);
  const totalPages = Math.ceil(SAMPLE_PRODUCTS.length / ITEMS_PER_PAGE);
  const currentPage = Math.floor(startIndex / ITEMS_PER_PAGE);

  const visibleProducts = SAMPLE_PRODUCTS.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  function goNext() {
    setStartIndex((i) =>
      i + ITEMS_PER_PAGE >= SAMPLE_PRODUCTS.length ? 0 : i + ITEMS_PER_PAGE
    );
  }

  function goPrev() {
    setStartIndex((i) =>
      i - ITEMS_PER_PAGE < 0
        ? Math.max(0, SAMPLE_PRODUCTS.length - ITEMS_PER_PAGE)
        : i - ITEMS_PER_PAGE
    );
  }

  return (
    <div className="gallery-wall min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        {/* Gallery subtitle */}
        <p className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-12">
          Current Exhibition
        </p>

        {/* Gallery grid with navigation arrows */}
        <div className="flex items-center gap-4 md:gap-8 w-full max-w-7xl justify-center">
          {/* Left arrow */}
          {totalPages > 1 && (
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full border border-neutral-700 text-neutral-400 flex items-center justify-center hover:border-[#c5a455] hover:text-[#c5a455] transition-colors shrink-0"
              aria-label="Previous items"
            >
              &lsaquo;
            </button>
          )}

          {/* Product frames */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {visibleProducts.map((product) => (
              <ProductFrame key={product.id} product={product} />
            ))}
          </div>

          {/* Right arrow */}
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

        {/* Page dots */}
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

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-neutral-600 border-t border-neutral-800">
        MaaS Market &mdash; Wearable Art, Curated
      </footer>
    </div>
  );
}
