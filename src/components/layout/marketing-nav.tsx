import Link from "next/link";

export function MarketingNavbar() {
  return (
    <nav className="absolute top-6 left-6 right-6 z-50">
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 bg-card/40 backdrop-blur-3xl border border-white/10 rounded-[24px]"
        style={{
          boxShadow:
            "0 0 50px -10px rgba(167, 218, 219, 0.35), 0 4px 16px -4px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png" alt="Smartslate" className="h-6 w-auto object-contain brightness-0 invert opacity-90" />
            <div className="h-4 w-px bg-white/20 mx-2 hidden sm:block"></div>
            <span className="hidden sm:inline font-heading font-bold tracking-widest text-foreground text-xs uppercase pt-0.5">Orbit</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Catalog</Link>
          <Link href="/enterprise" className="hover:text-primary transition-colors">Enterprise</Link>
          <Link href="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold bg-secondary text-white px-5 py-2.5 rounded-xl hover:bg-secondary/80 transition-all shadow-lg active:scale-[0.97]"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
