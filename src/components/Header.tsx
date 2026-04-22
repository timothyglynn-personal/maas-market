import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full border-b border-purple-900/50 bg-[#1a1040]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Wordmark */}
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/llama.jpeg"
            alt="MaaS Market mascot"
            width={40}
            height={40}
            className="rounded-full border-2 border-[#c5a455]/50"
          />
          <div className="flex items-baseline gap-1">
            <Image
              src="/Maas.png"
              alt="MaaS"
              width={80}
              height={28}
              className="invert brightness-200 opacity-90"
              style={{ filter: "invert(1) brightness(2)" }}
            />
            <span
              className="spray-text text-lg text-white/90 spray-drip"
              style={{ fontFamily: "var(--font-marker), cursive" }}
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
          className="px-4 py-2 rounded-sm text-xs font-bold tracking-wider uppercase border-2 border-[#c5a455]/60 text-[#c5a455] transition-all hover:bg-[#c5a455] hover:text-[#1a1040] hover:shadow-[0_0_20px_rgba(197,164,85,0.3)]"
        >
          Sell on MaaS
        </a>
      </div>
    </header>
  );
}
