"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, BookA, PenLine, FileText } from "lucide-react";
import { useProgressStore } from "@/store/progress";
import { useNotesStore } from "@/store/notes";

const GLOSSARY_TERMS = [
  { term: "Artificial Intelligence (AI)", definition: "The broad concept of machines carrying out tasks in a way we consider 'smart', based on pattern recognition rather than sentient consciousness." },
  { term: "Machine Learning (ML)", definition: "A subset of AI where systems are provided with data and discover patterns without explicit rule-based programming." },
  { term: "Large Language Model (LLM)", definition: "AI models trained on vast datasets that generate text by predicting the next token, possessing broad general knowledge." },
  { term: "Small Language Model (SLM)", definition: "Compact models retaining core language capabilities, optimized for running locally on edge devices." },
  { term: "Token", definition: "The fundamental unit of text for an AI, which can be a full word, a syllable, or a single letter." },
  { term: "Context Window", definition: "The 'short-term memory' of an AI model, defining the maximum amount of text it can hold in consideration at one time." },
  { term: "RAG (Retrieval-Augmented Generation)", definition: "A technique that gives AI a 'long-term memory' by retrieving relevant information from a database before generating an answer." },
  { term: "Function Calling / Tool Calling", definition: "The ability for an AI to formulate structured instructions (like JSON) to execute external tools (e.g., search the web, run code)." },
  { term: "MCP (Model Context Protocol)", definition: "An open standard that standardizes how AI systems connect to external data sources and tools, acting as a universal translator." },
  { term: "Agent", definition: "An AI system that operates with a degree of autonomy, utilizes external tools, and maintains memory across interactions." },
  { term: "Harness / Orchestration Layer", definition: "The surrounding software infrastructure that controls the AI model, enforces safety, and manages tools." },
  { term: "Hallucination", definition: "When an AI model produces confident but factually incorrect or fabricated information." },
  { term: "Guardrails", definition: "Safety boundaries and human-in-the-loop checkpoints that limit an AI agent's autonomy and prevent cascade failures." }
];

export function AssetsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'glossary' | 'notes'>('glossary');
  const { activeModuleId, activeLessonIndex, activeSlideIndex } = useProgressStore();
  const { getNote, saveNote, notes } = useNotesStore();
  
  const [selectedNoteContext, setSelectedNoteContext] = useState<{moduleId: string, lessonIndex: number, slideIndex: number} | null>(null);
  
  const currentContext = { moduleId: activeModuleId, lessonIndex: activeLessonIndex, slideIndex: activeSlideIndex };
  const editingContext = selectedNoteContext || currentContext;

  const [noteContent, setNoteContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const note = getNote(editingContext.moduleId, editingContext.lessonIndex, editingContext.slideIndex);
      setNoteContent(note?.content || "");
    }
  }, [isOpen, editingContext.moduleId, editingContext.lessonIndex, editingContext.slideIndex, getNote]);

  // Handle note saving with debounce
  useEffect(() => {
    if (!isOpen || !isTyping) return;
    const timeout = setTimeout(() => {
      saveNote(editingContext.moduleId, editingContext.lessonIndex, editingContext.slideIndex, noteContent);
      setIsTyping(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [noteContent, isTyping, isOpen, editingContext.moduleId, editingContext.lessonIndex, editingContext.slideIndex, saveNote]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop - This gets the blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container - NO BLUR, solid background, fixed max constraints */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} 
            className="relative w-full max-w-5xl h-[85vh] max-h-[800px] bg-card border border-primary/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row z-10"
          >
            {/* Sidebar */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-muted/30 flex flex-col p-4 shrink-0 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-bold tracking-tight text-foreground/80 uppercase">Learning Assets</h2>
                <button 
                  onClick={onClose}
                  className="md:hidden p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                <button
                  onClick={() => setActiveTab('glossary')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                    activeTab === 'glossary' 
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                  }`}
                >
                  <BookA className="w-4 h-4" />
                  Glossary
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                    activeTab === 'notes' 
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                  }`}
                >
                  <PenLine className="w-4 h-4" />
                  My Notes
                </button>
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-card">
              {/* Close Button (Desktop) */}
              <button 
                onClick={onClose}
                className="hidden md:flex absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Glossary Content */}
              {activeTab === 'glossary' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex-1 overflow-y-auto p-6 md:p-10"
                >
                  <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Glossary</h1>
                    <p className="text-muted-foreground mb-8">Core terms from the AI Foundations Blueprint.</p>
                    
                    <div className="grid gap-6">
                      {GLOSSARY_TERMS.map((item, idx) => (
                         <div key={idx} className="pb-6 border-b border-border last:border-0">
                          <h3 className="font-semibold text-lg text-primary mb-2">{item.term}</h3>
                          <p className="text-muted-foreground leading-relaxed text-sm">{item.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notes Content */}
              {activeTab === 'notes' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex-1 flex flex-col md:flex-row overflow-hidden"
                >
                  {/* Notes List Sidebar */}
                  <div className="w-full md:w-1/3 md:min-w-[240px] border-b md:border-b-0 md:border-r border-border bg-muted/10 flex flex-col overflow-y-auto max-h-[30vh] md:max-h-full">
                    <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Notebook</h3>
                    </div>
                    <div className="p-3 space-y-2">
                      {/* Current Slide Note Button */}
                      <button
                        onClick={() => setSelectedNoteContext(null)}
                        className={`w-full text-left p-3 rounded-xl transition-all border ${
                          selectedNoteContext === null
                            ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
                            : 'border-transparent text-foreground hover:bg-muted hover:border-border'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${selectedNoteContext === null ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                          <span className="font-bold text-xs uppercase tracking-wide">Current Slide</span>
                        </div>
                        <div className={`text-xs truncate pl-4 ${selectedNoteContext === null ? 'text-primary/80' : 'opacity-80'}`}>
                          Module {activeModuleId} • Slide {activeSlideIndex + 1}
                        </div>
                      </button>

                      <div className="my-3 border-t border-border" />

                      {/* All saved notes */}
                      {notes.filter(n => n.content.trim().length > 0).map(note => {
                        const isSelected = selectedNoteContext?.moduleId === note.moduleId && 
                                           selectedNoteContext?.lessonIndex === note.lessonIndex && 
                                           selectedNoteContext?.slideIndex === note.slideIndex;
                        if (note.moduleId === currentContext.moduleId && 
                            note.lessonIndex === currentContext.lessonIndex && 
                            note.slideIndex === currentContext.slideIndex) {
                          return null;
                        }
                        
                        return (
                          <button
                            key={note.id}
                            onClick={() => setSelectedNoteContext({
                              moduleId: note.moduleId,
                              lessonIndex: note.lessonIndex,
                              slideIndex: note.slideIndex
                            })}
                            className={`w-full text-left p-3 rounded-xl transition-all border ${
                              isSelected
                                ? 'bg-primary/5 border-primary/20 text-primary shadow-sm'
                                : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            <div className={`font-semibold text-xs mb-1 ${isSelected ? 'text-primary' : ''}`}>
                              Module {note.moduleId} • Slide {note.slideIndex + 1}
                            </div>
                            <div className="text-xs opacity-80 line-clamp-2 leading-relaxed">
                              {note.content}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Note Editor */}
                  <div className="flex-1 flex flex-col p-4 md:p-6 relative bg-card h-full">
                    <div className="flex items-center gap-3 mb-4 shrink-0">
                      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Slide Notes</h1>
                      <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wide">
                        M{editingContext.moduleId} • S{editingContext.slideIndex + 1}
                      </span>
                    </div>
                    
                    <div className="flex-1 relative rounded-xl border border-border bg-background overflow-hidden group focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-inner min-h-[200px]">
                      <textarea
                        value={noteContent}
                        onChange={(e) => {
                          setNoteContent(e.target.value);
                          setIsTyping(true);
                        }}
                        placeholder="Capture your thoughts, reflections, or ideas here..."
                        className="w-full h-full p-4 md:p-6 bg-transparent resize-none outline-none text-foreground leading-relaxed absolute inset-0 z-10"
                      />
                      {!noteContent && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 z-0">
                          <FileText className="w-24 h-24 md:w-32 md:h-32 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
