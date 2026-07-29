"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/hooks/use-user";
import { getCertificateData, requestVerification, CertificateRecord } from "@/actions/certificate";
import { useProgressStore } from "@/store/progress";
import { Loader2, ShieldCheck, ShieldAlert, Share2, Download, ExternalLink, Trophy, Target, History, Sparkles, User, Briefcase, Activity, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";

export default function CertificatePage() {
  const { user } = useUser();
  const { projectSpine } = useProgressStore();
  const [certData, setCertData] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  
  const certRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getCertificateData(user?.id || "guest-123");
      if (data) {
        data.projectSpine = projectSpine 
          ? projectSpine.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : "AI Application Foundation";
        setCertData(data);
      }
      setLoading(false);
    }
    loadData();
  }, [user, projectSpine]);

  useEffect(() => {
    if (!loading && certData && pageRef.current) {
      gsap.fromTo(
        ".fade-in-stagger",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
    }
  }, [loading, certData]);

  const handleRequestVerification = async () => {
    if (!certData) return;
    setVerifying(true);
    await requestVerification(certData.id);
    setVerifying(false);
    alert("Capstone verification requested. We will review your project and update your credential status.");
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!certData) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center p-8 text-center bg-zinc-950">
        <h2 className="text-2xl font-bold text-white mb-2">No Credential Found</h2>
        <p className="text-zinc-400">Complete the course modules and the final assessment to earn your credential.</p>
      </div>
    );
  }

  // Generate some mock LRS metadata for the analytics section
  const mockLRSData = {
    simulationsCompleted: 14,
    hoursInvested: 24.5,
    toolsMastered: 8,
    accuracy: 94,
    milestones: [
      { name: "Tokens & Context Mastered", date: "2 days ago" },
      { name: "RAG Pipeline Built", date: "4 days ago" },
      { name: "First Autonomous Agent", date: "5 days ago" },
    ]
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-y-auto">
      
      {/* 
        We use a specific class 'print-only' and 'no-print' to handle the download functionality. 
        When printing, only the certificate frame will be visible.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .cert-container { 
            position: absolute; top: 0; left: 0; right: 0; 
            width: 100vw; height: 100vh;
            background: #18181b !important;
            transform: none !important;
            margin: 0 !important;
            border: none !important;
          }
          /* Print optimizations for background graphics */
          .print-bg-fix { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}} />

      {/* --- HERO / PORTFOLIO HEADER (NO PRINT) --- */}
      <div className="no-print relative border-b border-white/10 bg-zinc-950/50 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          
          <div className="fade-in-stagger relative group">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-800 border-4 border-zinc-900 rounded-full flex items-center justify-center overflow-hidden shadow-2xl relative z-10">
              {/* Fallback avatar if user doesn't have one */}
              <User className="w-16 h-16 text-zinc-500" />
            </div>
            {certData.isVerified && (
              <div className="absolute bottom-2 right-2 bg-emerald-500 text-black p-1.5 rounded-full shadow-lg border-2 border-zinc-900 z-20">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="fade-in-stagger flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold tracking-wider mb-4 border border-indigo-500/20 uppercase">
              <Briefcase className="w-3 h-3" /> AI Engineer Credential
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2">
              {certData.studentName}
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl">
              Completed the Concept2Application curriculum with a specialized capstone in <span className="text-indigo-300 font-medium">{certData.projectSpine}</span>.
            </p>
          </div>

          <div className="fade-in-stagger flex gap-3 w-full md:w-auto">
            <button onClick={handleDownload} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Save PDF
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-900/30">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

        </div>
      </div>

      {/* --- THE CERTIFICATE ITSELF --- */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        <div className="fade-in-stagger flex items-center justify-between mb-8 no-print">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-indigo-500" /> Official Certification
          </h2>
          <span className="text-sm font-mono text-zinc-500">ID: {certData.id.toUpperCase()}</span>
        </div>

        {/* Certificate Container (Printed) */}
        <div className="fade-in-stagger flex justify-center no-print">
          <div 
            className="cert-container w-full max-w-[1000px] aspect-[1.414/1] relative perspective-1000 print-bg-fix shadow-2xl"
            style={{ minHeight: '600px' }}
          >
            <div 
              ref={certRef}
              className="absolute inset-0 bg-zinc-900 rounded-xl overflow-hidden flex flex-col border border-zinc-800 print-bg-fix"
              style={{
                backgroundImage: `radial-gradient(circle at 100% 100%, rgba(99,102,241,0.08) 0%, transparent 40%),
                                  radial-gradient(circle at 0% 0%, rgba(20,184,166,0.05) 0%, transparent 40%)`
              }}
            >
              {/* Noise */}
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
              
              {/* Header */}
              <div className="p-8 md:p-12 pb-4 flex justify-between items-start z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold tracking-widest text-white/50 text-xs uppercase">AI Foundations</span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Credential ID</span>
                  <span className="font-mono text-xs text-zinc-400">{certData.id.toUpperCase()}</span>
                </div>
              </div>

              {/* Main Copy */}
              <div className="flex-1 px-8 md:px-12 flex flex-col justify-center z-10">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-teal-400 mb-4 border-l-2 border-teal-500 pl-3">
                  Certificate of Completion & Competency
                </div>
                
                <h2 className="text-2xl text-zinc-400 font-light mb-2">This certifies that</h2>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
                  {certData.studentName}
                </h1>
                
                <p className="text-zinc-300 max-w-2xl leading-relaxed">
                  has successfully completed the comprehensive AI Engineering curriculum and demonstrated proficiency in Context Engineering, RAG Architecture, Multi-Agent Workflows, and LLMOps by building the:
                </p>
                <p className="text-xl font-medium text-indigo-300 mt-4">
                  "{certData.projectSpine}"
                </p>
              </div>

              {/* Verified Badge on Certificate */}
              <div className="absolute bottom-12 right-12 z-20 opacity-80">
                {certData.isVerified ? (
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="w-16 h-16 text-emerald-500/50 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Verified</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-30">
                    <ShieldAlert className="w-16 h-16 text-zinc-500 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Unverified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- DATA ANALYTICS & LRS DATA SECTION (NO PRINT) --- */}
        <div className="fade-in-stagger mt-24 no-print">
          <div className="flex items-center gap-3 mb-10">
            <Activity className="w-6 h-6 text-teal-500" />
            <h2 className="text-2xl font-bold text-white">Learning Analytics Profile</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent ml-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            
            {/* LRS Macro Score Cards */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <History className="w-24 h-24" />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Baseline Diagnostic</span>
                <p className="text-xs text-zinc-500 mt-1">Starting Knowledge</p>
              </div>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{certData.baselineScore}</span>
                <span className="text-lg text-zinc-500 font-medium">/ 100</span>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="w-24 h-24" />
              </div>
              <div>
                <span className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Final Capstone Assessment</span>
                <p className="text-xs text-zinc-500 mt-1">Post-Course Evaluation</p>
              </div>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{certData.finalScore}</span>
                <span className="text-lg text-zinc-500 font-medium">/ 100</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-teal-900/40 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-24 h-24" />
              </div>
              <div>
                <span className="text-sm font-bold text-teal-300 uppercase tracking-wider">Knowledge Growth</span>
                <p className="text-xs text-teal-300/50 mt-1">Delta improvement</p>
              </div>
              <div className="mt-8 flex items-baseline gap-2 text-teal-400">
                <span className="text-5xl font-black">+{certData.finalScore - certData.baselineScore}</span>
                <span className="text-lg font-medium">pts</span>
              </div>
            </div>

          </div>

          {/* Module Breakdown & xAPI Meta */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-zinc-400" /> Module Proficiency
              </h3>
              <div className="space-y-5">
                {certData.moduleScores.map((mod) => (
                  <div key={mod.moduleId}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-zinc-300">{mod.moduleName}</span>
                      <span className="text-sm font-mono text-zinc-500">{mod.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(mod.score / mod.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-zinc-400" /> Interaction Metrics
              </h3>
              <ul className="space-y-6">
                <li>
                  <div className="text-3xl font-black text-white">{mockLRSData.simulationsCompleted}</div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-1">Simulations Completed</div>
                </li>
                <li>
                  <div className="text-3xl font-black text-white">{mockLRSData.hoursInvested}h</div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-1">Interactive Hours Invested</div>
                </li>
                <li>
                  <div className="text-3xl font-black text-white">{mockLRSData.toolsMastered}</div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-1">Tools Mastered</div>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Verification Banner */}
        {!certData.isVerified && (
          <div className="fade-in-stagger mt-12 w-full bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 no-print">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500/20 p-2 rounded-full mt-1">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-amber-400 font-bold mb-1">Capstone Verification Pending</h3>
                <p className="text-sm text-zinc-400 max-w-xl">
                  Your credential is fully earned but marked as "Unverified" until your Capstone Project ({certData.projectSpine}) is reviewed by an instructor or LLM judge.
                </p>
              </div>
            </div>
            <button 
              onClick={handleRequestVerification}
              disabled={verifying}
              className="shrink-0 flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-6 py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              {verifying ? "Requesting..." : "Submit for Review"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
