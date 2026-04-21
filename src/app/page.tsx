"use client";

import { Simulator } from "@/components/Simulator";
import { AppWindow, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden selection:bg-blue-500/30 pb-20">
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        
        {/* Header */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white shadow-xl shadow-blue-500/10 dark:bg-white/10 dark:shadow-none"
          >
            <AppWindow className="w-8 h-8 text-blue-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4"
          >
            Execution Journey
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto mb-8"
          >
            Step through the life cycle of a program. From static binary on disk, to OS memory allocation, down to the CPU hardware, and finally context switching.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <Link 
              href="/learn" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-500/20 transition-all border border-blue-500/20 hover:border-blue-500/40"
            >
              <BookOpen className="w-5 h-5" />
              Learn the Theory
            </Link>
          </motion.div>
        </div>

        {/* Simulator Dashboard */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Simulator language="Go" />
        </motion.div>
      </div>
    </main>
  );
}
