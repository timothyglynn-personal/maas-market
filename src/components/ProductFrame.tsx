"use client";

import { useState } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
};

// SVG corner flourish
function CornerFlourish({ className }: { className: string }) {
  return (
    <div className={`frame-corner ${className}`}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2 C2 2, 2 12, 2 16 C2 20, 4 22, 8 22 C12 22, 22 22, 22 22 M2 2 C2 2, 12 2, 16 2 C20 2, 22 4, 22 8"
          stroke="rgba(212,185,106,0.5)" strokeWidth="1.5" fill="none" />
        <circle cx="2" cy="2" r="1.5" />
      </svg>
    </div>
  );
}

export default function ProductFrame({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: () => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const hasMultiple = product.images.length > 1;

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrentImage((i) => (i + 1) % product.images.length);
  }

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrentImage(
      (i) => (i - 1 + product.images.length) % product.images.length
    );
  }

  return (
    <div className="spotlight animate-slide-up flex flex-col items-center gap-4 group cursor-pointer" onClick={onSelect}>
      {/* Item name */}
      <h3
        className="spray-text text-lg md:text-xl tracking-[0.3em] uppercase text-center text-[#c5a455] h-14 flex items-center justify-center"
        style={{ fontFamily: "var(--font-marker), cursive" }}
      >
        {product.name}
      </h3>

      {/* Gold frame */}
      <div className="frame-outer rounded-sm relative">
        <div className="frame-inner rounded-sm relative">
          <CornerFlourish className="tl" />
          <CornerFlourish className="tr" />
          <CornerFlourish className="bl" />
          <CornerFlourish className="br" />
          <div className="frame-mat relative">
            <div className="relative w-[240px] h-[300px] md:w-[280px] md:h-[350px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />

              {hasMultiple && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1a1040]/70 text-white flex items-center justify-center text-base hover:bg-[#c5a455]/90 hover:text-[#1a1040] transition-all backdrop-blur-sm border border-white/10"
                    aria-label="Previous image"
                  >
                    &lsaquo;
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1a1040]/70 text-white flex items-center justify-center text-base hover:bg-[#c5a455]/90 hover:text-[#1a1040] transition-all backdrop-blur-sm border border-white/10"
                    aria-label="Next image"
                  >
                    &rsaquo;
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImage(i);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          i === currentImage
                            ? "bg-[#c5a455] shadow-[0_0_8px_rgba(197,164,85,0.7)]"
                            : "bg-white/30 hover:bg-white/60"
                        }`}
                        aria-label={`Image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price and buy button */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-purple-300/60 font-medium">
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            const res = await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productName: product.name,
                priceInCents: Math.round(product.price * 100),
                connectedAccountId:
                  process.env.NEXT_PUBLIC_STRIPE_CONNECTED_ACCOUNT_ID ||
                  "acct_1TNigiE9MgvpljEt",
              }),
            });
            const { url } = await res.json();
            if (url) window.location.href = url;
          }}
          className="btn-gold px-6 py-2 rounded-sm text-sm cursor-pointer"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
