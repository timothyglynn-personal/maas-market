"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Product } from "./ProductFrame";

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const hasMultiple = product.images.length > 1;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasMultiple)
        setCurrentImage((i) => (i + 1) % product.images.length);
      if (e.key === "ArrowLeft" && hasMultiple)
        setCurrentImage(
          (i) => (i - 1 + product.images.length) % product.images.length
        );
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, hasMultiple, product.images.length]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative glass-card rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 text-white/80 flex items-center justify-center text-xl hover:bg-[#c5a455]/80 hover:text-[#1a1040] transition-all backdrop-blur-sm border border-white/10"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-0">
          {/* Image carousel */}
          <div className="relative w-full md:w-1/2 aspect-[3/4] bg-[#0d0825] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {hasMultiple && (
              <>
                <button
                  onClick={() =>
                    setCurrentImage(
                      (i) =>
                        (i - 1 + product.images.length) % product.images.length
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1a1040]/70 text-white flex items-center justify-center text-lg hover:bg-[#c5a455]/80 hover:text-[#1a1040] transition-all backdrop-blur-sm border border-white/10"
                >
                  &lsaquo;
                </button>
                <button
                  onClick={() =>
                    setCurrentImage((i) => (i + 1) % product.images.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1a1040]/70 text-white flex items-center justify-center text-lg hover:bg-[#c5a455]/80 hover:text-[#1a1040] transition-all backdrop-blur-sm border border-white/10"
                >
                  &rsaquo;
                </button>

                {/* Thumbnail strip */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                        i === currentImage
                          ? "border-[#c5a455] shadow-[0_0_8px_rgba(197,164,85,0.5)]"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product details */}
          <div className="p-8 flex flex-col justify-between flex-1">
            <div>
              <h2
                className="text-2xl md:text-3xl tracking-[0.2em] uppercase text-[#c5a455] mb-2"
                style={{ fontFamily: "var(--font-marker), cursive" }}
              >
                {product.name}
              </h2>

              <p
                className="text-3xl text-[#c5a455] mb-6 tracking-[0.1em]"
                style={{ fontFamily: "var(--font-marker), cursive" }}
              >
                ${product.price.toFixed(2)}
              </p>

              <div className="splatter-divider w-full mb-6" />

              {product.description && (
                <p className="text-purple-300/70 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs bg-purple-900/40 text-purple-300/70 border border-purple-700/30">
                  Limited Edition
                </span>
              </div>
            </div>

            <button
              onClick={async () => {
                const res = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    productName: product.name,
                    priceInCents: Math.round(product.price * 100),
                    connectedAccountId: product.sellerId,
                  }),
                });
                const { url } = await res.json();
                if (url) window.location.href = url;
              }}
              className="btn-gold w-full py-3 rounded-sm text-base cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
