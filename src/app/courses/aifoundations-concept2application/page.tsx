"use client";

import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, Clock, Award, Users, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { MarketingNavbar } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function CourseMarketingPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".animate-fade",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  const handlePayment = () => {
    if (typeof window === "undefined" || !(window as any).Razorpay) {
      console.error("Razorpay SDK not loaded");
      return;
    }
    
    setIsProcessing(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_THqR3iuokmLPhQ", // fallback to literal key just in case
      amount: "2999900", // 29999 INR in paise
      currency: "INR",
      name: "Smartslate",
      description: "AI Foundations: Concept to Application",
      image: "https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png",
      handler: function (response: any) {
        // Payment successful, push to dashboard
        router.push("/courses/aifoundations-concept2application/dashboard");
      },
      prefill: {
        name: "Learner",
        email: "learner@example.com",
      },
      theme: {
        color: "#18181b", // bg-zinc-900 to match theme
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <MarketingNavbar />


      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden border-b border-white/5 bg-background">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors mb-8 group">
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Orbit Catalog
            </Link>
            
            <div className="animate-fade inline-flex items-center gap-2 px-3 py-1 bg-card/40 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-primary mb-6 shadow-xl">
              <span className="text-primary">★ 4.9 Rating</span>
              <span className="w-1 h-1 rounded-full bg-primary/30"></span>
              2,104 Students
            </div>

            <h1 className="animate-fade font-heading text-5xl md:text-6xl lg:text-[4rem] font-bold text-foreground tracking-tighter leading-[1.1] mb-6 text-balance">
              AI Foundations: <br />
              <span className="text-primary">Concept to Application</span>
            </h1>

            <p className="animate-fade font-sans text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl text-pretty">
              Stop watching generic tutorials. Master applied AI Engineering through 7 interactive modules. Build and deploy a complete production-grade LLM application as your final capstone project.
            </p>

            <div className="animate-fade flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-4 bg-secondary text-white hover:bg-secondary/90 rounded-2xl font-bold transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Enroll Now — INR 29,999"} <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-card/40 backdrop-blur-md hover:bg-card/60 text-foreground border border-white/10 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-2">
                <Play className="w-4 h-4 text-primary" /> Watch Trailer
              </button>
            </div>
            <p className="animate-fade font-sans text-xs text-muted-foreground mt-4 text-center sm:text-left">30-day money-back guarantee. No questions asked.</p>
          </div>

          <div className="animate-fade relative z-10">
            <div className="aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative bg-card group cursor-pointer">
              <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay" />
              <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80" alt="Course Preview" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-background/50 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-background/70 transition-colors shadow-2xl">
                  <Play className="w-8 h-8 text-primary ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meta Bar */}
      <section className="bg-card border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-heading text-foreground font-bold text-lg">12-15 Hours</p>
              <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Self-paced</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-heading text-foreground font-bold text-lg">Official Credential</p>
              <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Verifiable Certificate</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-heading text-foreground font-bold text-lg">1 Capstone Project</p>
              <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Portfolio Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-heading text-foreground font-bold text-lg">Peer Community</p>
              <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Private Discord</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">The Curriculum</h2>
          <p className="font-sans text-muted-foreground text-lg text-pretty">7 modules designed to transform you from beginner to AI Engineer.</p>
        </div>

        <div className="space-y-6">
          {[
            { id: 0, title: "Orientation & Capstone Setup", desc: "Select your project spine and set up your learning environment." },
            { id: 1, title: "The Bedrock", desc: "Fundamentals of machine learning, neural networks, and the Turing Test." },
            { id: 2, title: "The Goldfish Problem", desc: "Mastering context windows, chunking, and the mechanics of LLM memory." },
            { id: 3, title: "The Toolbelt", desc: "Connecting LLMs to the real world. RAG pipelines and API schemas." },
            { id: 4, title: "The Engine Room", desc: "Multi-agent workflows, orchestrators, and the ReAct paradigm." },
            { id: 5, title: "The Assembly Line", desc: "Deploying your capstone project inside an interactive terminal workspace." },
            { id: 6, title: "The Horizon", desc: "AI ethics, model distillation, and graduating with your verified credential." },
          ].map((mod) => (
            <div key={mod.id} className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex items-start gap-6 hover:bg-card/60 hover:border-primary/30 transition-all cursor-pointer group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex-shrink-0 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                <span className="font-heading text-xl font-bold text-primary">{mod.id}</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{mod.title}</h3>
                <p className="font-sans text-muted-foreground">{mod.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-10 py-5 bg-secondary hover:bg-secondary/90 text-white rounded-full font-bold transition-all shadow-xl shadow-secondary/20 text-lg disabled:opacity-50"
          >
            {isProcessing ? "Starting Checkout..." : "Start Learning Now — INR 29,999"} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
