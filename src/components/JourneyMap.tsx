"use client";

import { motion } from "framer-motion";
import { concepts, ConceptId } from "@/data/curriculum";
import { cn } from "@/lib/utils";

// Group concepts by category
const categorizedConcepts = {
  "Hardware Basics": ["ram", "cpu", "alu", "cu", "registers", "cache"],
  "The Cycle": ["fde-cycle"],
  "OS Core": ["os", "kernel", "kernel-space", "user-space", "system-call"],
  "Processes & Threads": ["program", "process", "pcb", "context-switching", "threads"],
  "Concurrency & Parallelism": ["concurrency", "parallelism", "multithreading"],
  "Memory Management": ["virtual-memory", "stack", "heap"],
};

interface JourneyMapProps {
  onSelectConcept: (id: ConceptId) => void;
  activeConceptId: ConceptId | null;
}

export function JourneyMap({ onSelectConcept, activeConceptId }: JourneyMapProps) {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 flex flex-col gap-16 relative z-10">
      {Object.entries(categorizedConcepts).map(([categoryName, conceptIds], index) => (
        <motion.div 
          key={categoryName}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="relative"
        >
          {/* Connector line between categories (except the last one) */}
          {index !== Object.entries(categorizedConcepts).length - 1 && (
            <div className="absolute left-8 top-24 bottom-[-64px] w-0.5 bg-gradient-to-b from-blue-500/30 to-purple-500/30 hidden md:block"></div>
          )}

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/4 sticky top-24 z-20 glass-panel p-4 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Phase {index + 1}
              </h2>
              <p className="text-white text-lg font-medium mt-1">{categoryName}</p>
            </div>
            
            <div className="md:w-3/4 flex flex-wrap gap-4 relative">
              {conceptIds.map((id, i) => {
                const concept = concepts[id];
                const isActive = activeConceptId === id;
                return (
                  <motion.button
                    key={id}
                    onClick={() => onSelectConcept(id)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative group p-5 rounded-xl border text-left transition-all duration-300 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]",
                      isActive 
                        ? "bg-blue-600/20 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                        : "bg-black/40 border-white/10 hover:border-blue-500/50 hover:bg-white/5 shadow-lg backdrop-blur-sm"
                    )}
                  >
                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-background"></span>
                      </span>
                    )}
                    
                    <h3 className={cn(
                      "font-bold text-lg mb-2 transition-colors",
                      isActive ? "text-blue-300" : "text-gray-100 group-hover:text-blue-200"
                    )}>
                      {concept.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                      {concept.shortDescription}
                    </p>
                    
                    {/* Dependency count indicator */}
                    {concept.dependencies.length > 0 && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Builds on {concept.dependencies.length} concept{concept.dependencies.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
