import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full border-b border-purple-900/40 bg-[#130c30]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Wordmark */}
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/llama.jpeg"
            alt="MaaS Market mascot"
            width={38}
            height={38}
            className="rounded-full border-2 border-[#c5a455]/40 shadow-[0_0_12px_rgba(197,164,85,0.15)]"
          />
          <div className="flex items-center gap-0">
            <Image
              src="/maas-logo.png"
              alt="MaaS"
              width={60}
              height={22}
              className="brightness-[10] drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
            />
            <span
              className="text-xl text-white/90 -ml-0.5 relative"
              style={{
                fontFamily: "var(--font-marker), cursive",
                textShadow: "0 0 8px rgba(255,255,255,0.2), 2px 2px 0 rgba(0,0,0,0.4)",
                transform: "rotate(-3deg) skewX(-2deg)",
                display: "inline-block",
              }}
            >
              Market
            </span>
          </div>
        </a>

        {/* Search */}
        <div className="hidden sm:block flex-1 max-w-md mx-8">
          <input
            type="text"
            placeholder="Search the collection..."
            className="w-full px-4 py-2 rounded-sm input-blurple text-sm"
          />
        </div>

        {/* Sell button */}
        <a
          href="/sell"
          className="btn-gold px-4 py-2 rounded-sm text-xs cursor-pointer"
        >
          Sell on MaaS
        </a>
      </div>
    </header>
  );
}
