"use client";

import { useState } from "react";
import Image from "next/image";

export type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
};

export default function ProductFrame({ product }: { product: Product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const hasMultiple = product.images.length > 1;

  function next() {
    setCurrentImage((i) => (i + 1) % product.images.length);
  }

  function prev() {
    setCurrentImage(
      (i) => (i - 1 + product.images.length) % product.images.length
    );
  }

  return (
    <div className="spotlight flex flex-col items-center gap-4 group">
      {/* Item name — gold shimmer */}
      <h3 className="gold-shimmer text-lg md:text-xl font-semibold tracking-wide text-center"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {product.name}
      </h3>

      {/* Gold frame */}
      <div className="frame-outer rounded-sm relative">
        <div className="frame-inner rounded-sm relative">
          <div className="frame-mat relative">
            <div className="relative w-[240px] h-[300px] md:w-[280px] md:h-[350px] overflow-hidden">
              <Image
                src={product.images[currentImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 240px, 280px"
              />

              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

              {hasMultiple && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1a1040]/60 text-white flex items-center justify-center text-base hover:bg-[#c5a455]/80 hover:text-[#1a1040] transition-all backdrop-blur-sm border border-white/10"
                    aria-label="Previous image"
                  >
                    &lsaquo;
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1a1040]/60 text-white flex items-center justify-center text-base hover:bg-[#c5a455]/80 hover:text-[#1a1040] transition-all backdrop-blur-sm border border-white/10"
                    aria-label="Next image"
                  >
                    &rsaquo;
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i === currentImage
                            ? "bg-[#c5a455] shadow-[0_0_6px_rgba(197,164,85,0.6)]"
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
        <span className="text-sm text-purple-300/70 font-medium">
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={async () => {
            const res = await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productName: product.name,
                priceInCents: Math.round(product.price * 100),
                connectedAccountId: process.env.NEXT_PUBLIC_STRIPE_CONNECTED_ACCOUNT_ID || "acct_1TNigiE9MgvpljEt",
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
