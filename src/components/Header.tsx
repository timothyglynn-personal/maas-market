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
            width={40}
            height={40}
            className="rounded-full border-2 border-[#c5a455]/40 shadow-[0_0_12px_rgba(197,164,85,0.15)]"
          />
          <div className="flex items-baseline gap-1.5">
            <Image
              src="/Maas.png"
              alt="MaaS"
              width={72}
              height={25}
              className="invert brightness-200"
            />
            <span
              className="spray-text text-base text-white/85 spray-drip"
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
          className="btn-gold px-4 py-2 rounded-sm text-xs cursor-pointer"
        >
          Sell on MaaS
        </a>
      </div>
    </header>
  );
}
