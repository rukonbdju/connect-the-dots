export type ConceptId = string;

export interface Concept {
  id: ConceptId;
  title: string;
  category: "Hardware" | "Execution" | "OS Core" | "Processes" | "Concurrency" | "Memory";
  shortDescription: string;
  detailedContent: React.ReactNode;
  icon?: string;
  dependencies: ConceptId[]; // Concepts that lead to this one
}

export const concepts: Record<ConceptId, Concept> = {
  // --- HARDWARE ---
  "cpu": {
    id: "cpu",
    title: "Central Processing Unit (CPU)",
    category: "Hardware",
    shortDescription: "The brain of the computer that executes instructions.",
    detailedContent: "The CPU is the primary component of a computer that acts as its 'brain.' It processes instructions from software programs, performing basic arithmetic, logic, controlling, and input/output (I/O) operations. It consists of several key components including the ALU, CU, and Registers.",
    dependencies: [],
  },
  "alu": {
    id: "alu",
    title: "Arithmetic Logic Unit (ALU)",
    category: "Hardware",
    shortDescription: "Performs mathematical and logical operations.",
    detailedContent: "The ALU is a digital circuit within the CPU that performs integer arithmetic and bitwise logic operations. It is the fundamental building block of the CPU.",
    dependencies: ["cpu"],
  },
  "cu": {
    id: "cu",
    title: "Control Unit (CU)",
    category: "Hardware",
    shortDescription: "Directs the operations of the CPU.",
    detailedContent: "The Control Unit orchestrates the activities of the CPU. It tells the computer's memory, arithmetic logic unit and input and output devices how to respond to the instructions that have been sent to the processor.",
    dependencies: ["cpu"],
  },
  "registers": {
    id: "registers",
    title: "Registers",
    category: "Hardware",
    shortDescription: "Fastest, smallest memory inside the CPU.",
    detailedContent: "Registers are small amounts of high-speed memory contained within the CPU. They are used by the CPU to store instructions, data, and memory addresses that the ALU needs to execute instructions quickly.",
    dependencies: ["cpu"],
  },
  "cache": {
    id: "cache",
    title: "Cache",
    category: "Hardware",
    shortDescription: "High-speed memory that stores frequently accessed data.",
    detailedContent: "Cache memory is a smaller, faster memory closer to a processor core, which stores copies of the data from frequently used main memory locations to reduce the average cost (time or energy) to access data from the main memory.",
    dependencies: ["cpu", "ram"],
  },
  "ram": {
    id: "ram",
    title: "Random Access Memory (RAM)",
    category: "Hardware",
    shortDescription: "Volatile memory used to store data currently in use.",
    detailedContent: "RAM is the main memory of a computer. It is volatile, meaning it loses its data when power is turned off. The CPU reads instructions and data from RAM to execute programs.",
    dependencies: [],
  },

  // --- EXECUTION ---
  "fde-cycle": {
    id: "fde-cycle",
    title: "Fetch-Decode-Execute Cycle",
    category: "Execution",
    shortDescription: "The basic operational process of a computer.",
    detailedContent: "This is the cycle the CPU follows from boot-up until the computer has shut down. The CPU fetches an instruction from memory (RAM/Cache), decodes it into commands the ALU/CU can understand, and then executes it.",
    dependencies: ["cpu", "ram", "registers", "cu", "alu"],
  },

  // --- OS CORE ---
  "os": {
    id: "os",
    title: "Operating System (OS)",
    category: "OS Core",
    shortDescription: "Software that manages computer hardware and software resources.",
    detailedContent: "An Operating System is system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between the user and the computer hardware.",
    dependencies: ["fde-cycle"],
  },
  "kernel": {
    id: "kernel",
    title: "Kernel",
    category: "OS Core",
    shortDescription: "The core of the OS with complete control over everything.",
    detailedContent: "The kernel is a computer program at the core of a computer's operating system and generally has complete control over everything in the system. It facilitates interactions between hardware and software components.",
    dependencies: ["os"],
  },
  "kernel-space": {
    id: "kernel-space",
    title: "Kernel Space",
    category: "OS Core",
    shortDescription: "Privileged area of memory reserved for the kernel.",
    detailedContent: "Kernel space is strictly reserved for running a privileged operating system kernel, kernel extensions, and most device drivers. In this space, the kernel can access all hardware and memory.",
    dependencies: ["kernel"],
  },
  "user-space": {
    id: "user-space",
    title: "User Space",
    category: "OS Core",
    shortDescription: "Restricted memory area where user applications run.",
    detailedContent: "User space is a set of memory locations in which user processes (like your web browser or a game) run. A process in user space cannot directly access hardware or kernel memory.",
    dependencies: ["kernel"],
  },
  "system-call": {
    id: "system-call",
    title: "System Call",
    category: "OS Core",
    shortDescription: "How user applications request services from the kernel.",
    detailedContent: "A system call is the programmatic way in which a computer program requests a service from the kernel of the operating system it is executed on. This is how user-space programs interact with kernel-space features.",
    dependencies: ["user-space", "kernel-space"],
  },

  // --- PROCESSES & THREADS ---
  "program": {
    id: "program",
    title: "Program",
    category: "Processes",
    shortDescription: "An executable file stored on disk.",
    detailedContent: "A program is a set of instructions written in a programming language that performs a specific task when executed by a computer. It is static and resides on secondary storage (like a hard drive).",
    dependencies: ["os"],
  },
  "process": {
    id: "process",
    title: "Process",
    category: "Processes",
    shortDescription: "A program in execution.",
    detailedContent: "A process is an instance of a computer program that is being executed. It contains the program code and its current activity. Each process has its own isolated memory space.",
    dependencies: ["program", "ram"],
  },
  "pcb": {
    id: "pcb",
    title: "Process Control Block (PCB)",
    category: "Processes",
    shortDescription: "Data structure storing information about a process.",
    detailedContent: "The PCB is a data structure in the operating system kernel containing the information needed to manage a particular process. It includes the process state, program counter, CPU registers, and memory management information.",
    dependencies: ["process", "kernel"],
  },
  "context-switching": {
    id: "context-switching",
    title: "Context Switching",
    category: "Processes",
    shortDescription: "Saving and restoring process states.",
    detailedContent: "A context switch is the process of storing the state of a process or thread, so that it can be restored and resume execution at a later point. This enables multiple processes to share a single CPU.",
    dependencies: ["pcb", "registers", "cpu"],
  },
  "threads": {
    id: "threads",
    title: "Threads",
    category: "Processes",
    shortDescription: "The smallest sequence of programmed instructions.",
    detailedContent: "A thread of execution is the smallest sequence of programmed instructions that can be managed independently by a scheduler. Multiple threads can exist within one process, executing concurrently and sharing resources such as memory.",
    dependencies: ["process"],
  },

  // --- CONCURRENCY ---
  "concurrency": {
    id: "concurrency",
    title: "Concurrency",
    category: "Concurrency",
    shortDescription: "Dealing with multiple tasks seemingly at once.",
    detailedContent: "Concurrency is the ability of an algorithm or program to be executed in out-of-order or in partial order, without affecting the final outcome. On a single-core CPU, tasks are rapidly switched (context switching) to give the illusion of simultaneous execution.",
    dependencies: ["context-switching"],
  },
  "parallelism": {
    id: "parallelism",
    title: "Parallelism",
    category: "Concurrency",
    shortDescription: "Executing multiple tasks literally at the exact same time.",
    detailedContent: "Parallelism involves performing multiple operations at the exact same time. This requires multiple processors or a multi-core processor where each core can handle an independent task simultaneously.",
    dependencies: ["cpu", "concurrency"],
  },
  "multithreading": {
    id: "multithreading",
    title: "Multithreading",
    category: "Concurrency",
    shortDescription: "Using multiple threads to maximize CPU utilization.",
    detailedContent: "Multithreading is a specialized form of multitasking and a way for software programs to execute multiple threads concurrently. This is often used to keep user interfaces responsive while heavy processing happens in the background.",
    dependencies: ["threads", "concurrency"],
  },

  // --- MEMORY MANAGEMENT ---
  "virtual-memory": {
    id: "virtual-memory",
    title: "Virtual Memory",
    category: "Memory",
    shortDescription: "Illusion of a large, continuous memory space.",
    detailedContent: "Virtual memory is a memory management technique where secondary memory can be used as if it were a part of the main memory. It gives each process the illusion that it has a very large, continuous memory space, isolating it from other processes.",
    dependencies: ["ram", "process", "os"],
  },
  "stack": {
    id: "stack",
    title: "Stack Memory",
    category: "Memory",
    shortDescription: "Memory for function calls and local variables.",
    detailedContent: "The stack is a region of memory that stores temporary variables created by each function (including the main() function). The stack is a LIFO (Last In, First Out) data structure, managed automatically by the CPU.",
    dependencies: ["virtual-memory", "process"],
  },
  "heap": {
    id: "heap",
    title: "Heap Memory",
    category: "Memory",
    shortDescription: "Memory for dynamic allocation.",
    detailedContent: "The heap is a region of your computer's memory that is not managed automatically for you. It's used for dynamic memory allocation, where the size of the data isn't known until runtime. Memory here must be manually managed (or garbage collected).",
    dependencies: ["virtual-memory", "process"],
  }
};
