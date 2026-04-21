"use client";

import { useEffect, useRef, useState } from "react";
import { useSimulator } from "@/hooks/useSimulator";
import { ActiveComponent, Language } from "@/types/simulator";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, StepForward, StepBack, RotateCcw, Cpu, Database, Server, Layers, Briefcase, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

function TypingText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [prevText, setPrevText] = useState(text);

  if (text !== prevText) {
    setPrevText(text);
    setDisplayedText("");
  }

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20); // Typing speed
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}

const ComponentBox = ({ title, icon: Icon, isActive, children, className, comp }: { title: string, icon?: React.ElementType, isActive: boolean, children: React.ReactNode, className?: string, comp?: string }) => (
  <div className={cn(
    "glass-panel rounded-xl p-4 transition-all duration-500 relative overflow-hidden flex flex-col",
    isActive ? "active-glow bg-blue-50/5 dark:bg-blue-900/10 scale-[1.02]" : "border-gray-200/20 dark:border-white/10",
    className
  )}>
    {isActive && (
      <motion.div 
        className="absolute inset-0 bg-blue-400/5" 
        animate={{ opacity: [0.1, 0.3, 0.1] }} 
        transition={{ repeat: Infinity, duration: 2 }} 
      />
    )}
    <div className="flex items-center gap-2 mb-3 text-gray-800 dark:text-gray-200 font-semibold z-10 border-b border-gray-200/50 dark:border-white/10 pb-2">
      {Icon && <Icon className={cn("w-4 h-4", isActive ? "text-blue-500" : "text-gray-400")} />}
      {title}
    </div>
    <div className="z-10 flex-1">
      {children}
    </div>
  </div>
);

export function Simulator({ language }: { language: Language }) {
  const { state, scenario, fileName, codeFiles, stepForward, stepBackward, reset, toggleRun, currentStepDef } = useSimulator(language);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEl = document.getElementById(`timeline-step-${state.currentStep}`);
    if (activeEl && timelineRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [state.currentStep]);

  const isActive = (comp: ActiveComponent) => state.activeComponents.includes(comp);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 text-gray-800 dark:text-gray-200">
      
      {/* Top Header / Controls */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {currentStepDef.topic}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Phase {state.currentStep + 1} of {scenario.length}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={stepBackward} 
            disabled={state.currentStep === 0 || state.isRunning}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 transition-all shadow-sm"
          >
            <StepBack size={18} />
          </button>
          <button 
            onClick={toggleRun} 
            className={cn(
              "p-2.5 px-6 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md text-white",
              state.isRunning 
                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" 
                : "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20"
            )}
          >
            {state.isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play</>}
          </button>
          <button 
            onClick={stepForward} 
            disabled={state.currentStep >= scenario.length - 1 || state.isRunning}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 transition-all shadow-sm"
          >
            <StepForward size={18} />
          </button>
          <button 
            onClick={reset}
            className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm ml-2"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Sidebar: Narrative, Timeline, & Code */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          
          {/* Code Viewer */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col relative overflow-hidden bg-[#0d1117] dark:bg-[#0d1117] text-gray-300 font-mono text-[11px] h-full">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <span className="font-bold text-gray-500">{fileName}</span>
            </div>
            <div className="flex flex-col gap-0.5 overflow-y-auto custom-scrollbar flex-1 pb-4">
              {codeFiles.map((c) => {
                const isActive = state.activeLines?.includes(c.line);
                return (
                  <div key={c.line} className={cn("flex items-start px-2 py-0.5 rounded transition-all duration-300", isActive ? "bg-blue-500/20 border-l-2 border-blue-500" : "border-l-2 border-transparent")}>
                    <span className="w-6 text-gray-600 select-none shrink-0">{c.line}</span>
                    <span className={cn("whitespace-pre", isActive ? "text-blue-300 font-bold" : "")}>{c.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Architecture Visualization & Narrative */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* Narrative Panel (Moved above OS/Hardware) */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
             <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
             
             <div className="flex-1 w-full pb-2">
               <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{currentStepDef.title}</h3>
               <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed min-h-[72px]">
                 <TypingText text={currentStepDef.description} />
               </p>
             </div>
             
             {/* Progress Bar along the bottom border */}
             <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200 dark:bg-white/5">
               <motion.div 
                 className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                 initial={{ width: 0 }}
                 animate={{ width: `${((state.currentStep + 1) / scenario.length) * 100}%` }}
                 transition={{ duration: 0.3, ease: "easeOut" }}
               />
             </div>
          </div>

          {/* Architecture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          {/* Global Data Flow Animation Layer */}
          <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
            <AnimatePresence mode="popLayout">
              {state.dataFlow && (
                <motion.div
                  key={`${state.currentStep}-${state.dataFlow.label}`}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center gap-2"
                >
                  <Activity size={16} />
                  {state.dataFlow.label}
                  <div className="text-xs opacity-80">({state.dataFlow.from} → {state.dataFlow.to})</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Column 1: Software / OS Layer */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-[-10px]">Operating System Layer</h3>
            
            <ComponentBox comp="DISK" title="Secondary Storage (Disk)" icon={Database} isActive={isActive('DISK')}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-white/5">
                  <span className="font-mono text-xs">main.go</span>
                  <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded", isActive('COMPILER') ? "bg-amber-500 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-500")}>
                    COMPILER
                  </div>
                </div>
                <div className={cn("flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors", state.hasProcess ? "bg-gray-200 dark:bg-white/10" : "bg-gray-50 dark:bg-black/20")}>
                  <span className="font-mono text-xs opacity-80">main.exe (Binary)</span>
                </div>
              </div>
            </ComponentBox>

            <ComponentBox comp="KERNEL" title="Kernel Space" icon={Server} isActive={isActive('KERNEL')} className={cn("border-l-4", state.isInKernelMode ? "border-l-purple-500" : "border-l-gray-300")}>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-70">Privilege Level</span>
                  <span className={cn("px-2 py-1 rounded-md font-bold", state.isInKernelMode ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400")}>
                    {state.isInKernelMode ? "Ring 0 (Active)" : "Idle"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                   <div className={cn("p-2 rounded text-center text-xs transition-colors", isActive('SCHEDULER') ? "bg-purple-500 text-white font-bold" : "bg-gray-100 dark:bg-white/5")}>
                     OS Scheduler
                   </div>
                   <div className={cn("p-2 rounded text-center text-xs transition-colors", isActive('PCB') ? "bg-purple-500 text-white font-bold" : "bg-gray-100 dark:bg-white/5")}>
                     {state.hasProcess ? "PCB (Go Proc)" : "No Process"}
                   </div>
                </div>
                {/* OS Threads representation */}
                <div className="mt-1 pt-2 border-t border-gray-200 dark:border-white/10">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Hardware Threads</span>
                  <div className="flex gap-2 mt-1">
                    <div className={cn("flex-1 p-1.5 rounded text-center text-xs border", isActive('OS_THREAD') ? "bg-indigo-500 text-white border-indigo-500 font-bold" : "bg-transparent border-gray-300 dark:border-gray-600 opacity-50")}>
                      OS Thread 1
                    </div>
                    <div className={cn("flex-1 p-1.5 rounded text-center text-xs border", state.activeGoroutines > 1 ? "bg-indigo-500 text-white border-indigo-500 font-bold" : "bg-transparent border-gray-300 dark:border-gray-600 opacity-50")}>
                      OS Thread 2
                    </div>
                  </div>
                </div>
              </div>
            </ComponentBox>

            <ComponentBox comp="USER_SPACE" title="User Space (Virtual Memory)" icon={Layers} isActive={isActive('USER_SPACE')}>
              {!state.hasVirtualMemory ? (
                <div className="h-24 flex items-center justify-center opacity-50 text-sm">Unallocated</div>
              ) : (
                <div className="flex flex-col gap-2 h-full">
                  {/* Goroutines indicator */}
                  {state.activeGoroutines > 0 && (
                     <div className="flex gap-2 mb-1">
                       {[...Array(state.activeGoroutines)].map((_, i) => (
                         <div key={i} className={cn("flex-1 rounded p-1 text-[10px] font-bold text-center", isActive('GOROUTINE') ? "bg-cyan-500 text-white" : "bg-cyan-100 text-cyan-800")}>
                           Goroutine {i+1}
                         </div>
                       ))}
                     </div>
                  )}
                  <div className={cn("flex-1 rounded p-2 text-xs flex items-center justify-center transition-colors", isActive('STACK') ? "bg-blue-500 text-white font-bold" : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300")}>
                    Stack (Local Vars)
                  </div>
                  <div className="h-4 rounded flex items-center justify-center text-[10px] opacity-40">
                    Free Space
                  </div>
                  <div className={cn("flex-1 rounded p-2 text-xs flex flex-col items-center justify-center relative transition-colors", isActive('HEAP') ? "bg-green-500 text-white font-bold" : "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300")}>
                    <span>Heap (Dynamic)</span>
                    {/* GC Indicator inside Heap */}
                    <AnimatePresence>
                      {isActive('GC') && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold"
                        >
                          GC Running
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </ComponentBox>
          </div>

          {/* Column 2: Hardware Layer */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-[-10px]">Hardware Layer</h3>
            
            <ComponentBox comp="CPU" title="Central Processing Unit (CPU)" icon={Cpu} isActive={isActive('CPU')}>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex flex-col gap-4">
                  <div className={cn(
                    "flex-1 p-3 rounded-xl border text-center flex flex-col justify-center transition-all",
                    isActive('CU') ? "bg-blue-500 border-blue-500 text-white shadow-lg" : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                  )}>
                    <span className="font-bold text-sm">Control Unit</span>
                  </div>
                  <div className={cn(
                    "flex-1 p-3 rounded-xl border text-center flex flex-col justify-center transition-all",
                    isActive('ALU') ? "bg-amber-500 border-amber-500 text-white shadow-lg" : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                  )}>
                    <span className="font-bold text-sm">ALU</span>
                  </div>
                </div>
                
                <div className={cn(
                  "flex flex-col gap-1.5 p-3 rounded-xl border transition-all",
                  isActive('REGISTERS') ? "bg-indigo-500/10 border-indigo-500/50" : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                )}>
                  <span className="font-bold text-xs mb-1 opacity-70">Registers</span>
                  <div className="bg-white dark:bg-black rounded p-1 text-[10px] font-mono flex justify-between border border-gray-200 dark:border-white/10"><span>R1</span><span>0x00</span></div>
                  <div className="bg-white dark:bg-black rounded p-1 text-[10px] font-mono flex justify-between border border-gray-200 dark:border-white/10"><span>R2</span><span>0x00</span></div>
                  <div className="bg-white dark:bg-black rounded p-1 text-[10px] font-mono flex justify-between border border-gray-200 dark:border-white/10"><span>PC</span><span>0x01</span></div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 rounded p-1 text-[10px] font-mono flex justify-between border border-amber-200 dark:border-amber-700/50 mt-1"><span>SP</span><span>{state.sp}</span></div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 rounded p-1 text-[10px] font-mono flex justify-between border border-amber-200 dark:border-amber-700/50"><span>BP</span><span>{state.bp}</span></div>
                </div>
              </div>
            </ComponentBox>

            <ComponentBox comp="CACHE" title="L1/L2 Cache" icon={Briefcase} isActive={isActive('CACHE')}>
              <div className="h-12 w-full flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex-1 h-full bg-gray-100 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/10"></div>
                ))}
              </div>
            </ComponentBox>

            <ComponentBox comp="RAM" title="Physical RAM" icon={Database} isActive={isActive('RAM')}>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={cn(
                    "aspect-square rounded-lg flex items-center justify-center font-mono text-xs border transition-all duration-500",
                    state.hasProcess && i < 4 ? "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700/50 dark:text-blue-300" : "bg-gray-50 border-gray-200 text-gray-400 dark:bg-white/5 dark:border-white/10"
                  )}>
                    0x{i}
                  </div>
                ))}
              </div>
            </ComponentBox>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
