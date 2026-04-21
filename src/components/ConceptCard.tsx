"use client";

import { motion } from "framer-motion";
import { X, BookOpen, Layers } from "lucide-react";
import { Concept, concepts } from "@/data/curriculum";

interface ConceptCardProps {
  conceptId: string | null;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export function ConceptCard({ conceptId, onClose, onNavigate }: ConceptCardProps) {
  if (!conceptId) return null;
  
  const concept = concepts[conceptId];
  if (!concept) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="glass-panel rounded-2xl p-6 md:p-8 max-w-2xl w-full mx-auto relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
      >
        <X size={20} className="text-gray-400 hover:text-white" />
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="px-3 py-1 text-xs font-medium tracking-wider text-blue-300 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
          {concept.category}
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
        {concept.title}
      </h2>
      
      <p className="text-xl text-gray-300 mb-8 font-light leading-relaxed">
        {concept.shortDescription}
      </p>

      <div className="space-y-6">
        <div className="bg-black/30 rounded-xl p-5 border border-white/5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
            <BookOpen size={18} className="text-blue-400" />
            Deep Dive
          </h3>
          <div className="text-gray-300 leading-relaxed text-sm md:text-base">
            {concept.detailedContent}
          </div>
        </div>

        {concept.dependencies.length > 0 && (
          <div className="bg-black/30 rounded-xl p-5 border border-white/5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Layers size={18} className="text-purple-400" />
              Builds Upon
            </h3>
            <div className="flex flex-wrap gap-2">
              {concept.dependencies.map(depId => (
                <button
                  key={depId}
                  onClick={() => onNavigate(depId)}
                  className="px-4 py-2 text-sm bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg text-gray-200 transition-all flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-purple-400 transition-colors"></span>
                  {concepts[depId]?.title || depId}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
