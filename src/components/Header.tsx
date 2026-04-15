export default function Header() {
  return (
    <header className="w-full border-b border-neutral-800 bg-[#141210]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#c5a455",
          }}
        >
          MaaS Market
        </a>

        {/* Search */}
        <div className="hidden sm:block flex-1 max-w-md mx-8">
          <input
            type="text"
            placeholder="Search the collection..."
            className="w-full px-4 py-2 rounded-sm bg-neutral-900 border border-neutral-700 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#c5a455]/50 transition-colors"
          />
        </div>

        {/* Sell button */}
        <a
          href="/sell"
          className="px-4 py-2 rounded-sm text-xs font-semibold tracking-wider uppercase border transition-all hover:bg-[#c5a455] hover:text-[#1a1714]"
          style={{
            borderColor: "#c5a455",
            color: "#c5a455",
          }}
        >
          Sell on MaaS Market
        </a>
      </div>
    </header>
  );
}
