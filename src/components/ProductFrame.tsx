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
    <div className="spotlight flex flex-col items-center gap-4">
      {/* Item name */}
      <h3
        className="text-lg md:text-xl font-semibold tracking-wide text-center"
        style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          color: "#c5a455",
        }}
      >
        {product.name}
      </h3>

      {/* Gold frame */}
      <div className="frame-outer rounded-sm">
        <div className="frame-inner rounded-sm">
          <div className="frame-mat relative">
            <div className="relative w-[240px] h-[300px] md:w-[280px] md:h-[350px] overflow-hidden bg-neutral-100">
              <Image
                src={product.images[currentImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 240px, 280px"
              />

              {hasMultiple && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center text-sm hover:bg-black/60 transition-colors"
                    aria-label="Previous image"
                  >
                    &lsaquo;
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center text-sm hover:bg-black/60 transition-colors"
                    aria-label="Next image"
                  >
                    &rsaquo;
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentImage
                            ? "bg-white"
                            : "bg-white/40 hover:bg-white/60"
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
        <span className="text-sm text-neutral-400">
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
          className="px-6 py-2 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all hover:brightness-110 cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, #c5a455 0%, #d4b96a 50%, #a68a3e 100%)",
            color: "#1a1714",
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
