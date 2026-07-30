import Link from "next/link";
import { Sparkles, MessageCircle, Briefcase, Code } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <a href="https://orbit.smartslate.io" className="flex items-center gap-2 mb-6">
              <img src="https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png" alt="Smartslate" className="h-7 w-auto object-contain brightness-0 invert opacity-90" />
              <div className="h-5 w-px bg-white/20 mx-2"></div>
              <span className="font-heading font-bold tracking-widest text-foreground text-sm uppercase pt-0.5">Orbit</span>
            </Link>
            <p className="text-muted-foreground font-sans text-sm max-w-sm leading-relaxed mb-8">
              Smartslate's premium learning environment. Master the future of software engineering through brutal, practical, and highly interactive courses.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Community"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Careers"><Briefcase className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Open Source"><Code className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><a href="https://orbit.smartslate.io/courses" className="hover:text-primary transition-colors">Course Catalog</a></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Orbit Enterprise</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Interactive Sandboxes</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Certifications</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Smartslate</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Manifesto</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-muted-foreground text-sm">© {new Date().getFullYear()} Smartslate Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
