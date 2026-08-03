"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModuleTracker } from "@/components/dashboard/module-tracker";
import { fetchPromptTemplates, PromptTemplate } from "@/actions/resources";
import { COURSE_NOTES } from "@/lib/course-notes";
import { Copy, Check, Wrench, Boxes, Server, ExternalLink, Library, BookOpen, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface DashboardTabsProps {
  completedModules: string[];
  activeModuleId: string | null;
  projectSpine: string | null;
  projectSpineAnswers: Record<string, any>;
  totalFraction: number;
  totalModules: number;
  completedCount: number;
  mounted: boolean;
}

export function DashboardTabs({
  completedModules,
  activeModuleId,
  projectSpine,
  projectSpineAnswers,
  totalFraction,
  totalModules,
  completedCount,
  mounted,
}: DashboardTabsProps) {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(true);
  const [notesPage, setNotesPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPromptTemplates().then(data => {
      setPrompts(data);
      setLoadingPrompts(false);
    });
  }, []);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Tabs defaultValue="journey" className="w-full space-y-8 dashboard-fade">
      <TabsList className="bg-card/50 border border-white/10 p-1.5 rounded-xl h-auto">
        <TabsTrigger value="journey" className="px-6 py-3 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold">
          Your Journey
        </TabsTrigger>
        <TabsTrigger value="resources" className="px-6 py-3 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold">
          Resources
        </TabsTrigger>
        <TabsTrigger value="notes" className="px-6 py-3 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold">
          Course Notes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="journey" className="focus:outline-none">
        <ModuleTracker
          completedModules={completedModules}
          activeModuleId={activeModuleId}
          projectSpine={projectSpine}
          projectSpineAnswers={projectSpineAnswers}
          totalFraction={totalFraction}
          totalModules={totalModules}
          completedCount={completedCount}
          mounted={mounted}
        />
      </TabsContent>

      <TabsContent value="resources" className="space-y-12 focus:outline-none">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Library className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold font-heading">Prompt Templates</h2>
          </div>
          {loadingPrompts ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : prompts.length === 0 ? (
            <div className="p-8 text-center bg-card/40 border border-white/10 rounded-2xl">
              <p className="text-muted-foreground">Connect your Supabase 'prompt_templates' table to see templates here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {prompts.map(prompt => (
                <div key={prompt.id} className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">
                          {prompt.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{prompt.title}</h3>
                      <p className="text-sm text-muted-foreground">{prompt.description}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(prompt.id, prompt.content)}
                      className="shrink-0 p-2 rounded-full bg-zinc-800 hover:bg-primary/20 text-zinc-400 hover:text-primary transition-colors"
                      title="Copy template"
                    >
                      {copiedId === prompt.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <pre className="relative z-10 bg-zinc-950 p-4 rounded-xl text-sm font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap border border-white/5">
                    {prompt.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
            <Wrench className="w-6 h-6 text-primary mb-4 relative z-10" />
            <h3 className="text-lg font-bold text-foreground mb-2 relative z-10">Recommended Skills</h3>
            <p className="text-sm text-muted-foreground mb-4 relative z-10">Curated skills to install in your autonomous agents.</p>
            <div className="space-y-2 relative z-10">
              <span className="block text-xs font-mono px-3 py-2 bg-zinc-950 rounded-lg text-zinc-300 border border-white/5">design-taste-frontend</span>
              <span className="block text-xs font-mono px-3 py-2 bg-zinc-950 rounded-lg text-zinc-300 border border-white/5">master-instructional-design</span>
              <span className="block text-xs font-mono px-3 py-2 bg-zinc-950 rounded-lg text-zinc-300 border border-white/5">impeccable</span>
            </div>
          </div>
          
          <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />
            <Server className="w-6 h-6 text-indigo-400 mb-4 relative z-10" />
            <h3 className="text-lg font-bold text-foreground mb-2 relative z-10">Recommended MCPs</h3>
            <p className="text-sm text-muted-foreground mb-4 relative z-10">Essential servers for contextual tooling.</p>
            <div className="space-y-2 relative z-10">
              <span className="block text-xs font-mono px-3 py-2 bg-zinc-950 rounded-lg text-zinc-300 border border-white/5">github</span>
              <span className="block text-xs font-mono px-3 py-2 bg-zinc-950 rounded-lg text-zinc-300 border border-white/5">postgres</span>
              <span className="block text-xs font-mono px-3 py-2 bg-zinc-950 rounded-lg text-zinc-300 border border-white/5">puppeteer</span>
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] rounded-full pointer-events-none" />
            <Boxes className="w-6 h-6 text-rose-400 mb-4 relative z-10" />
            <h3 className="text-lg font-bold text-foreground mb-2 relative z-10">Tool Repositories</h3>
            <p className="text-sm text-muted-foreground mb-4 relative z-10">External collections and directories.</p>
            <div className="space-y-3 relative z-10">
              <a href="#" className="flex items-center justify-between px-3 py-2 bg-zinc-950 rounded-lg border border-white/5 hover:border-primary/30 transition-colors">
                <span className="text-xs font-bold text-zinc-300">MCP Registry</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
              <a href="#" className="flex items-center justify-between px-3 py-2 bg-zinc-950 rounded-lg border border-white/5 hover:border-primary/30 transition-colors">
                <span className="text-xs font-bold text-zinc-300">Awesome Agents</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="notes" className="focus:outline-none">
        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-8">
          <div className="flex items-center gap-3 mb-10">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold font-heading">Course Notes</h2>
          </div>
          
          <div className="space-y-8">
            {(() => {
              const groupedNotes = Object.entries(
                COURSE_NOTES.reduce((acc, note) => {
                  if (!acc[note.moduleId]) acc[note.moduleId] = {};
                  if (!acc[note.moduleId][note.lessonIndex]) acc[note.moduleId][note.lessonIndex] = [];
                  acc[note.moduleId][note.lessonIndex].push(note);
                  return acc;
                }, {} as Record<string, Record<string, typeof COURSE_NOTES>>)
              ).sort((a, b) => parseInt(a[0]) - parseInt(b[0])); // Sort by module ID

              const itemsPerPage = 1; // 1 Module per page
              const totalPages = Math.ceil(groupedNotes.length / itemsPerPage);
              const paginatedModules = groupedNotes.slice((notesPage - 1) * itemsPerPage, notesPage * itemsPerPage);

              const moduleNames: Record<string, string> = {
                "1": "The Intelligence Illusion",
                "2": "The Goldfish Problem",
                "3": "The Toolbelt",
                "4": "The Engine Room",
                "6": "Operationalizing AI"
              };
              
              return (
                <>
                  <Accordion type="multiple" className="space-y-6" defaultValue={paginatedModules.map(m => `module-${m[0]}`)}>
                    {paginatedModules.map(([moduleId, lessons]) => (
                      <AccordionItem key={moduleId} value={`module-${moduleId}`} className="border-none bg-zinc-950/40 rounded-2xl overflow-hidden border border-white/5">
                        <AccordionTrigger className="px-6 py-4 hover:bg-white/5 hover:no-underline transition-colors group">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm shadow-[0_0_15px_rgba(167,218,219,0.3)] shrink-0">
                              M{moduleId}
                            </div>
                            <h3 className="text-xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                              {moduleNames[moduleId] || `Module ${moduleId}`}
                            </h3>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 md:px-8 pb-6 pt-2">
                          <Accordion type="multiple" className="space-y-4" defaultValue={Object.keys(lessons).map(l => `lesson-${l}`)}>
                            {Object.entries(lessons).map(([lessonIndex, slides]) => (
                              <AccordionItem key={lessonIndex} value={`lesson-${lessonIndex}`} className="border-none">
                                <AccordionTrigger className="hover:no-underline py-2 group">
                                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-zinc-200 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shadow-[0_0_0_4px_rgba(39,39,42,0.5)] group-hover:bg-primary transition-colors" />
                                    Lesson {parseInt(lessonIndex) + 1}
                                  </h4>
                                </AccordionTrigger>
                                <AccordionContent className="pl-6 md:pl-10 border-l border-white/10 mt-4 space-y-4">
                                  <div className="grid grid-cols-1 gap-4">
                                    {slides.map(note => (
                                      <div 
                                        key={note.id} 
                                        className="bg-zinc-900/40 border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(167,218,219,0.05)]"
                                      >
                                        <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-white/5">
                                          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded shrink-0">
                                            Slide {note.slideIndex + 1}
                                          </span>
                                          {note.title && <span className="text-sm font-bold text-zinc-300">{note.title}</span>}
                                        </div>
                                        <div className="prose prose-sm prose-invert prose-p:leading-relaxed prose-p:text-zinc-400 prose-headings:text-zinc-200 prose-strong:text-zinc-300 prose-li:text-zinc-400 prose-a:text-primary max-w-none">
                                          <ReactMarkdown>{note.content}</ReactMarkdown>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
                      <button
                        onClick={() => setNotesPage(p => Math.max(1, p - 1))}
                        disabled={notesPage === 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 text-sm font-medium transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous Module
                      </button>
                      <span className="text-sm font-medium text-zinc-400">
                        Module {notesPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setNotesPage(p => Math.min(totalPages, p + 1))}
                        disabled={notesPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 text-sm font-medium transition-colors"
                      >
                        Next Module <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
