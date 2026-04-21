"use client";

import { useState } from "react";
import { JourneyMap } from "@/components/JourneyMap";
import { ConceptCard } from "@/components/ConceptCard";
import { ConceptId } from "@/data/curriculum";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function LearnPage() {
  const [activeConceptId, setActiveConceptId] = useState<ConceptId | null>(null);

  return (
    <main className="min-h-screen relative overflow-x-hidden selection:bg-blue-500/30 pb-20">
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        
        {/* Header */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Simulator
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Theoretical Concepts
            </h1>
          </div>
          
          <div className="hidden md:block w-32"></div> {/* Spacer for centering */}
        </div>
        
        <div className="text-center mb-12 max-w-2xl mx-auto">
           <p className="text-gray-400 text-lg">
             Explore the core computer science concepts that power our simulation. Click on any topic below to dive deeper.
           </p>
        </div>

        {/* Journey Map */}
        <JourneyMap 
          activeConceptId={activeConceptId} 
          onSelectConcept={(id) => setActiveConceptId(id as ConceptId)} 
        />

        {/* Concept Card Modal Overlay */}
        <AnimatePresence>
          {activeConceptId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveConceptId(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />
              <div className="relative z-10 w-full max-w-2xl my-auto">
                <ConceptCard 
                  conceptId={activeConceptId} 
                  onClose={() => setActiveConceptId(null)} 
                  onNavigate={(id) => setActiveConceptId(id as ConceptId)}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
