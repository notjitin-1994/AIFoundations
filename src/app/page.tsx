import Link from "next/link";
import { ArrowRight, Code2, Cpu, BrainCircuit, Star, CheckCircle2 } from "lucide-react";
import { MarketingNavbar } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Hero } from "@/components/landing/hero";

export default function OrbitLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
      <MarketingNavbar />

      {/* Hero Section — extracted to <Hero /> for composition.
          See src/components/landing/hero.tsx for the design contract. */}
      <Hero />

      {/* Featured Course Section */}
      <section id="featured" className="py-24 bg-card/20 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">Featured Program</h2>
              <p className="font-sans text-muted-foreground">Our flagship curriculum, completely redesigned for 2026.</p>
            </div>
          </div>

          <Link href="/courses/aifoundations-concept2application" className="block group cursor-pointer">
            <div className="relative bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/10 hover:border-primary/40 transition-colors duration-500 shadow-2xl">
              
              <div className="grid md:grid-cols-2 lg:grid-cols-5 h-full">
                {/* Course Info */}
                <div className="p-10 lg:col-span-3 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-primary/20">New Release</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground"><Star className="w-3 h-3 text-primary fill-primary" /> 4.9 (2.1k Reviews)</span>
                  </div>
                  
                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4 group-hover:text-primary transition-colors">
                    AI Foundations: Concept to Application
                  </h3>
                  
                  <p className="font-sans text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl text-pretty">
                    Go from zero to building production-ready LLM applications. Master context engineering, RAG pipelines, multi-agent orchestrators, and deploy a full-scale capstone project.
                  </p>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8">
                    <div className="flex items-center gap-2 text-foreground text-sm font-sans"><CheckCircle2 className="w-4 h-4 text-primary" /> 7 Interactive Modules</div>
                    <div className="flex items-center gap-2 text-foreground text-sm font-sans"><CheckCircle2 className="w-4 h-4 text-primary" /> 15+ Custom Simulations</div>
                    <div className="flex items-center gap-2 text-foreground text-sm font-sans"><CheckCircle2 className="w-4 h-4 text-primary" /> Build 1 Capstone Project</div>
                    <div className="flex items-center gap-2 text-foreground text-sm font-sans"><CheckCircle2 className="w-4 h-4 text-primary" /> Official Certification</div>
                  </div>

                  <div className="flex items-center gap-2 text-primary font-bold group-hover:translate-x-2 transition-transform">
                    View Course Details <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Course Visual */}
                <div className="relative lg:col-span-2 h-64 md:h-full min-h-[300px] border-t md:border-t-0 md:border-l border-white/5 bg-background overflow-hidden">
                  <div className="absolute inset-0 bg-secondary/20 mix-blend-overlay" />
                  <img 
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" 
                    alt="AI Visualization" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
                </div>
              </div>

            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">Interactive Sandboxes</h3>
              <p className="font-sans text-muted-foreground leading-relaxed text-pretty">Don't just watch videos. Interact with real code, drag-and-drop toolbelts, and live terminal environments directly in the browser.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">Granular Analytics</h3>
              <p className="font-sans text-muted-foreground leading-relaxed text-pretty">Every action, slider adjustment, and drag event is tracked in our advanced LRS to map your exact knowledge graph and proficiency.</p>
            </div>

            <div className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">Capstone Driven</h3>
              <p className="font-sans text-muted-foreground leading-relaxed text-pretty">Choose a project spine on day 1. Every module builds towards your final, portfolio-ready AI application.</p>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
