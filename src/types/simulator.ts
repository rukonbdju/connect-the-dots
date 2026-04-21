export type OSComponent = 'KERNEL' | 'USER_SPACE' | 'PCB' | 'SCHEDULER' | 'COMPILER' | 'INTERPRETER';
export type MemoryComponent = 'VIRTUAL_MEM' | 'STACK' | 'HEAP' | 'RAM' | 'CACHE' | 'GC';
export type HardwareComponent = 'CPU' | 'CU' | 'ALU' | 'REGISTERS' | 'DISK';
export type ThreadComponent = 'OS_THREAD' | 'GOROUTINE';
export type ActiveComponent = OSComponent | MemoryComponent | HardwareComponent | ThreadComponent | 'NONE';

export interface StoryStep {
  id: number;
  title: string;
  topic: string; 
  description: string;
  activeComponents: ActiveComponent[];
  dataFlow?: { from: ActiveComponent; to: ActiveComponent; label: string };
  activeLines?: number[];
  action: (state: SimulatorState) => Partial<SimulatorState>;
}

export interface SimulatorState {
  currentStep: number;
  activeComponents: ActiveComponent[];
  dataFlow: { from: ActiveComponent; to: ActiveComponent; label: string } | null;
  history: string[];
  isRunning: boolean;
  
  hasProcess: boolean;
  hasVirtualMemory: boolean;
  isInKernelMode: boolean;
  activeGoroutines: number; // Keep this generic enough or specific to go, but we can reuse for threads
  sp: string; // Stack Pointer
  bp: string; // Base Pointer
  activeLines: number[];
}

export type Language = 'Go';

export interface CodeLine {
  line: number;
  text: string;
}

export interface ScenarioDefinition {
  language: Language;
  fileName: string;
  code: CodeLine[];
  steps: StoryStep[];
}
