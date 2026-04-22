"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";

export default function SellPage() {
  return (
    <Suspense>
      <SellPageInner />
    </Suspense>
  );
}

function SellPageInner() {
  const searchParams = useSearchParams();
  const onboardingComplete = searchParams.get("onboarding") === "complete";
  const refreshed = searchParams.get("refresh") === "true";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/sellers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      setError(data.error || "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="gallery-wall min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full">
          {onboardingComplete ? (
            <div className="text-center glass-card rounded-lg p-10">
              <h1
                className="gold-shimmer text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Welcome to MaaS Market
              </h1>
              <p className="text-purple-300/60 mb-6">
                Your seller account is being set up. You&apos;ll be able to
                list products once your account is verified.
              </p>
              <a href="/" className="btn-gold inline-block px-6 py-2 rounded-sm text-sm">
                Browse the Gallery
              </a>
            </div>
          ) : (
            <>
              <h1
                className="text-3xl font-bold mb-2 text-center"
                style={{ fontFamily: "var(--font-marker), cursive" }}
              >
                <span className="spray-text text-white/90">Sell on MaaS</span>
              </h1>
              <p className="text-purple-300/50 text-sm text-center mb-8">
                Join our curated marketplace and showcase your wearable art
              </p>

              {refreshed && (
                <p className="text-yellow-400 text-sm text-center mb-4">
                  Your onboarding session expired. Please try again.
                </p>
              )}

              <form
                onSubmit={handleSubmit}
                className="glass-card rounded-lg p-6"
              >
                <div className="mb-4">
                  <label className="block text-sm text-purple-300/60 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-sm input-blurple text-sm"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-purple-300/60 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-sm input-blurple text-sm"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm mb-4">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full py-2 rounded-sm text-sm disabled:opacity-50"
                >
                  {submitting ? "Setting up..." : "Get Started"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
