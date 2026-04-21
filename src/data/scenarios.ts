import { ScenarioDefinition, SimulatorState, StoryStep, CodeLine } from '../types/simulator';

type ScenarioOptions = {
  language: string;
  fileName: string;
  compilerName: string;
  isInterpreted: boolean;
  threadName: string;
  hasGC: boolean;
  code: CodeLine[];
  lineMapping: {
    start: number[];
    exec: number[];
    thread: number[];
    cpuStart: number[];
    heapAlloc: number[];
    sysCall: number[];
    contextSwitch: number[];
  }
};

function generateScenario(opts: ScenarioOptions): StoryStep[] {
  return [
    {
      id: 0,
      title: "1. The Source Code",
      topic: "Program",
      description: `Every piece of software begins as human-readable text. Your code is just a standard '${opts.fileName}' file resting safely on your Disk. At this stage, the computer's processor has no idea what this text means—it only understands binary.`,
      activeComponents: ['DISK'],
      activeLines: opts.lineMapping.start,
      action: () => ({ hasProcess: false, hasVirtualMemory: false, isInKernelMode: false, activeGoroutines: 0, sp: '0x0000', bp: '0x0000', activeLines: opts.lineMapping.start })
    },
    {
      id: 1,
      title: opts.isInterpreted ? `2. The ${opts.compilerName}` : `2. The ${opts.compilerName}`,
      topic: opts.isInterpreted ? "Interpretation" : "Compilation",
      description: opts.isInterpreted 
        ? `Before it can run, the ${opts.compilerName} must parse your human-readable text. Unlike compiled languages, it translates and executes your code on-the-fly rather than building a standalone binary upfront.`
        : `Before it can run, the ${opts.compilerName} must translate your human-readable text into a binary executable. It bundles your code so it can be understood by the OS and CPU.`,
      activeComponents: ['DISK', opts.isInterpreted ? 'INTERPRETER' : 'COMPILER'],
      activeLines: [],
      action: () => ({})
    },
    {
      id: 2,
      title: "3. Execution Request",
      topic: "OS & Kernel",
      description: "You execute the program. The Operating System (OS) wakes up to handle your request. The 'Kernel', which is the untouchable core of the OS that controls all hardware, takes charge of the execution process.",
      activeComponents: ['KERNEL'],
      activeLines: opts.lineMapping.exec,
      action: () => ({ isInKernelMode: true, activeLines: opts.lineMapping.exec })
    },
    {
      id: 3,
      title: "4. Safe Spaces",
      topic: "Kernel vs User Space",
      description: "To prevent your application from accidentally crashing the entire computer, memory is strictly divided. The OS lives in protected 'Kernel Space', while your app is trapped in restricted 'User Space'. It cannot touch hardware directly.",
      activeComponents: ['KERNEL', 'USER_SPACE'],
      activeLines: opts.lineMapping.exec,
      action: () => ({ isInKernelMode: false })
    },
    {
      id: 4,
      title: "5. The Memory Illusion",
      topic: "Virtual Memory",
      description: "If every app tried to use the same physical RAM addresses, they would overwrite each other. To solve this, the OS tricks your app into thinking it has the entire RAM to itself using 'Virtual Memory'.",
      activeComponents: ['USER_SPACE', 'VIRTUAL_MEM'],
      activeLines: opts.lineMapping.exec,
      action: () => ({ hasVirtualMemory: true })
    },
    {
      id: 5,
      title: "6. Organizing Memory",
      topic: "Stack & Heap",
      description: "Inside your isolated Virtual Memory, the OS sets up two distinct regions: a 'Stack' (for fast, temporary local variables) and a 'Heap' (for dynamic data that needs to persist).",
      activeComponents: ['VIRTUAL_MEM', 'STACK', 'HEAP'],
      activeLines: opts.lineMapping.exec,
      action: () => ({})
    },
    {
      id: 6,
      title: "7. Coming to Life",
      topic: "Process & RAM",
      description: "The Kernel loads your program from the slow Disk into the extremely fast Physical RAM. It's no longer just a static file—it is now a living, breathing 'Process' ready to be executed by the CPU.",
      activeComponents: ['DISK', 'RAM', 'KERNEL'],
      dataFlow: { from: 'DISK', to: 'RAM', label: 'Load to RAM' },
      activeLines: opts.lineMapping.exec,
      action: () => ({ hasProcess: true, isInKernelMode: true })
    },
    {
      id: 7,
      title: "8. The ID Card",
      topic: "Process Control Block (PCB)",
      description: "To keep track of your running app among others, the Kernel creates a PCB (Process Control Block). This acts like a digital ID card, storing the Process ID, memory limits, and the exact state of execution.",
      activeComponents: ['PCB', 'KERNEL'],
      activeLines: opts.lineMapping.exec,
      action: () => ({ isInKernelMode: false })
    },
    {
      id: 8,
      title: "9. Runtime Starts",
      topic: "OS Threads",
      description: `The program initializes. It asks the OS for 'OS Threads', which are heavy-weight, kernel-managed workers that actually get scheduled on the CPU cores.`,
      activeComponents: ['OS_THREAD', 'KERNEL', 'USER_SPACE'],
      activeLines: opts.lineMapping.exec,
      action: () => ({})
    },
    {
      id: 9,
      title: "10. Multiplexing",
      topic: `${opts.threadName}s`,
      description: `The runtime prepares its execution threads. It sets up ${opts.threadName}s to handle tasks concurrently, mapping user-level execution contexts to the underlying OS threads.`,
      activeComponents: ['GOROUTINE', 'OS_THREAD'], // reusing GOROUTINE UI box for threads
      activeLines: opts.lineMapping.thread,
      action: () => ({ activeGoroutines: 1, activeLines: opts.lineMapping.thread })
    },
    {
      id: 10,
      title: "11. Function Frames",
      topic: "SP and BP Registers",
      description: "Before executing a function, the CPU sets up a Stack Frame. It uses the Base Pointer (BP) to anchor the bottom of the frame and the Stack Pointer (SP) to track the top of the stack as local variables are pushed and popped.",
      activeComponents: ['REGISTERS', 'STACK'],
      activeLines: opts.lineMapping.thread,
      action: () => ({ bp: '0xFF00', sp: '0xFEF8' })
    },
    {
      id: 11,
      title: "12. The Brain Wakes Up",
      topic: "CPU & Control Unit (CU)",
      description: "Now it's time to run code! The CPU is the brain of the computer. The Control Unit (CU) acts as the conductor of the orchestra, preparing to fetch the very first binary instruction of your program.",
      activeComponents: ['CPU', 'CU'],
      activeLines: opts.lineMapping.cpuStart,
      action: () => ({ activeLines: opts.lineMapping.cpuStart })
    },
    {
      id: 12,
      title: "13. The Fast Lane",
      topic: "Cache & Registers",
      description: "Fetching instructions directly from RAM is too slow for modern CPUs. The CPU pre-fetches chunks of code into its 'Cache'. The absolute fastest memory are 'Registers', which hold data currently being processed.",
      activeComponents: ['CACHE', 'REGISTERS', 'RAM'],
      dataFlow: { from: 'RAM', to: 'CACHE', label: 'Pre-load' },
      activeLines: opts.lineMapping.cpuStart,
      action: () => ({})
    },
    {
      id: 13,
      title: "14. Phase 1: Fetch",
      topic: "Fetch Cycle",
      description: "The CPU's infinite core loop begins. The Control Unit reaches out to the Cache and 'Fetches' the next 1s and 0s representing your binary instruction.",
      activeComponents: ['CU', 'CACHE'],
      dataFlow: { from: 'CACHE', to: 'CU', label: 'Fetch' },
      activeLines: opts.lineMapping.cpuStart,
      action: () => ({})
    },
    {
      id: 14,
      title: "15. Phase 2: Decode",
      topic: "Decode Cycle",
      description: "The Control Unit 'Decodes' the binary instruction. It translates the raw 1s and 0s into electrical signals, discovering that this specific instruction is a mathematical Addition!",
      activeComponents: ['CU'],
      activeLines: opts.lineMapping.cpuStart,
      action: () => ({})
    },
    {
      id: 15,
      title: "16. Phase 3: Execute",
      topic: "Execute Cycle & ALU",
      description: "The Control Unit routes the signals to the Arithmetic Logic Unit (ALU). The ALU physically crunches the numbers using logic gates and computes the final result of the addition.",
      activeComponents: ['CU', 'ALU'],
      dataFlow: { from: 'CU', to: 'ALU', label: 'Signals' },
      activeLines: opts.lineMapping.cpuStart,
      action: () => ({})
    },
    {
      id: 16,
      title: "17. Storing Results",
      topic: "Registers & SP",
      description: "The ALU finishes its calculation and saves the answer into a general-purpose Register. As the resulting local variable is pushed onto the Stack, the Stack Pointer (SP) moves down to a new memory address.",
      activeComponents: ['ALU', 'REGISTERS'],
      dataFlow: { from: 'ALU', to: 'REGISTERS', label: 'Save' },
      activeLines: opts.lineMapping.cpuStart,
      action: () => ({ sp: '0xFEE0' })
    },
    {
      id: 17,
      title: "18. Dynamic Data",
      topic: "Heap Allocation",
      description: "Your code requests a large, dynamic block of data. The compiler/runtime determines it's too big to safely fit on the local Stack, so it requests a permanent block of memory for it over on the Heap.",
      activeComponents: ['HEAP', 'USER_SPACE'],
      activeLines: opts.lineMapping.heapAlloc,
      action: () => ({ activeLines: opts.lineMapping.heapAlloc })
    },
    {
      id: 18,
      title: "19. Hitting a Wall",
      topic: "User Space Limit",
      description: "Your code reaches a Print statement. However, because your app is trapped in User Space, it has absolutely no hardware privileges and cannot directly communicate with the monitor to print the text!",
      activeComponents: ['USER_SPACE'],
      activeLines: opts.lineMapping.sysCall,
      action: () => ({ activeLines: opts.lineMapping.sysCall })
    },
    {
      id: 19,
      title: "20. Asking for Permission",
      topic: "System Call",
      description: "To print the text, the app must make a 'System Call'. It intentionally interrupts the CPU, politely asking the OS Kernel to print the text on its behalf. The CPU elevates its privileges and switches into Kernel Mode.",
      activeComponents: ['USER_SPACE', 'KERNEL', 'CPU'],
      dataFlow: { from: 'USER_SPACE', to: 'KERNEL', label: 'Syscall (Write)' },
      activeLines: opts.lineMapping.sysCall,
      action: () => ({ isInKernelMode: true })
    },
    {
      id: 20,
      title: "21. Task Switching",
      topic: `${opts.threadName} Context Switch`,
      description: `System Calls take a long time to complete. Rather than letting the execution sit idle, the runtime instantly pauses your blocked ${opts.threadName} and swaps in a different one to keep things busy.`,
      activeComponents: ['GOROUTINE', 'OS_THREAD', 'REGISTERS'],
      activeLines: opts.lineMapping.contextSwitch,
      action: () => ({ activeGoroutines: 2, sp: '0xDD00', bp: '0xDD50', activeLines: opts.lineMapping.contextSwitch })
    },
    {
      id: 21,
      title: "22. The OS Intervenes",
      topic: "OS Context Switch: Save",
      description: "Eventually, the OS Scheduler decides that your entire OS Thread has consumed its fair share of CPU time. It forces an OS 'Context Switch', pausing the thread and saving all active CPU Registers into your app's PCB.",
      activeComponents: ['SCHEDULER', 'PCB', 'REGISTERS'],
      dataFlow: { from: 'REGISTERS', to: 'PCB', label: 'Save State' },
      activeLines: opts.lineMapping.contextSwitch,
      action: () => ({ activeLines: opts.lineMapping.contextSwitch })
    },
    {
      id: 22,
      title: "23. Loading the Next Game",
      topic: "OS Context Switch: Load",
      description: "The OS Scheduler selects a totally different app (maybe your web browser) that is waiting to run. It grabs that app's PCB, loads its saved state back into the CPU Registers, and resumes it exactly where it left off.",
      activeComponents: ['SCHEDULER', 'PCB', 'REGISTERS'],
      dataFlow: { from: 'PCB', to: 'REGISTERS', label: 'Load State' },
      activeLines: opts.lineMapping.contextSwitch,
      action: () => ({})
    },
    {
      id: 23,
      title: "24. Cleaning Up the Mess",
      topic: opts.hasGC ? "Garbage Collection (GC)" : "Manual Memory Management",
      description: opts.hasGC 
        ? "While our app was running, the Heap accumulated 'garbage'—memory that is no longer being used. The Garbage Collector (GC) periodically scans the Heap concurrently, freeing up unused blocks."
        : "Because this language does not have a Garbage Collector, the developer must manually call free() or delete to clean up the Heap. Otherwise, the app would suffer from severe memory leaks!",
      activeComponents: opts.hasGC ? ['GC', 'HEAP'] : ['HEAP'],
      activeLines: opts.lineMapping.heapAlloc,
      action: () => ({ activeLines: opts.lineMapping.heapAlloc })
    },
    {
      id: 24,
      title: "25. The Grand Illusion",
      topic: "Concurrency & Parallelism",
      description: "By executing these cycles billions of times per second and context-switching instantly, the OS creates the illusion of 'Concurrency'. When multiple cores do this simultaneously, we achieve true 'Parallelism'.",
      activeComponents: ['SCHEDULER', 'CPU', 'RAM', 'GOROUTINE'],
      activeLines: [],
      action: () => ({ isInKernelMode: false, activeLines: [] })
    }
  ];
}

const cppCode: CodeLine[] = [
  { line: 1, text: "#include <iostream>" },
  { line: 2, text: "#include <thread>" },
  { line: 3, text: "" },
  { line: 4, text: "int complexCalc() {" },
  { line: 5, text: "    int sum = 0;" },
  { line: 6, text: "    for(int i=0; i<1000; i++) sum += i;" },
  { line: 7, text: "    return sum;" },
  { line: 8, text: "}" },
  { line: 9, text: "" },
  { line: 10, text: "int main() {" },
  { line: 11, text: "    // 1. Heap Allocation" },
  { line: 12, text: "    char* data = new char[1024];" },
  { line: 13, text: "    std::cout << sizeof(data) << '\\n';" },
  { line: 14, text: "" },
  { line: 15, text: "    // 2. Thread Spawning" },
  { line: 16, text: "    std::thread t([]() {" },
  { line: 17, text: "        // 3. Math & Registers" },
  { line: 18, text: "        int res = complexCalc();" },
  { line: 19, text: "" },
  { line: 20, text: "        // 4. System Call" },
  { line: 21, text: "        std::cout << res << '\\n';" },
  { line: 22, text: "    });" },
  { line: 23, text: "" },
  { line: 24, text: "    // 5. OS Context Switch" },
  { line: 25, text: "    std::this_thread::sleep_for(std::chrono::seconds(1));" },
  { line: 26, text: "    " },
  { line: 27, text: "    delete[] data; // Manual cleanup" },
  { line: 28, text: "    t.join();" },
  { line: 29, text: "    return 0;" },
  { line: 30, text: "}" }
];

const goCode: CodeLine[] = [
  { line: 1, text: "package main" },
  { line: 2, text: "" },
  { line: 3, text: "import (" },
  { line: 4, text: '    "fmt"' },
  { line: 5, text: '    "time"' },
  { line: 6, text: ")" },
  { line: 7, text: "" },
  { line: 8, text: "func complexCalc() int {" },
  { line: 9, text: "    sum := 0" },
  { line: 10, text: "    for i:=0; i<1000; i++ {" },
  { line: 11, text: "        sum += i" },
  { line: 12, text: "    }" },
  { line: 13, text: "    return sum" },
  { line: 14, text: "}" },
  { line: 15, text: "" },
  { line: 16, text: "func main() {" },
  { line: 17, text: "    // 1. Heap Allocation" },
  { line: 18, text: "    data := make([]byte, 1024)" },
  { line: 19, text: '    fmt.Println(len(data))' },
  { line: 20, text: "" },
  { line: 21, text: "    // 2. Goroutine Spawning" },
  { line: 22, text: "    go func() {" },
  { line: 23, text: "        // 3. Math & Registers" },
  { line: 24, text: "        res := complexCalc()" },
  { line: 25, text: "" },
  { line: 26, text: "        // 4. System Call" },
  { line: 27, text: '        fmt.Println(res)' },
  { line: 28, text: "    }()" },
  { line: 29, text: "" },
  { line: 30, text: "    // 5. OS Context Switch" },
  { line: 31, text: "    time.Sleep(1 * time.Second)" },
  { line: 32, text: "}" }
];

const jsCode: CodeLine[] = [
  { line: 1, text: "const fs = require('fs');" },
  { line: 2, text: "" },
  { line: 3, text: "function complexCalc() {" },
  { line: 4, text: "    let sum = 0;" },
  { line: 5, text: "    for(let i=0; i<1000; i++) sum += i;" },
  { line: 6, text: "    return sum;" },
  { line: 7, text: "}" },
  { line: 8, text: "" },
  { line: 9, text: "function main() {" },
  { line: 10, text: "    // 1. Heap Allocation" },
  { line: 11, text: "    const data = new Uint8Array(1024);" },
  { line: 12, text: "    console.log(data.length);" },
  { line: 13, text: "" },
  { line: 14, text: "    // 2. Async Web API (Event Loop)" },
  { line: 15, text: "    setTimeout(() => {" },
  { line: 16, text: "        // 3. Math & Registers" },
  { line: 17, text: "        const res = complexCalc();" },
  { line: 18, text: "" },
  { line: 19, text: "        // 4. System Call" },
  { line: 20, text: "        console.log(res);" },
  { line: 21, text: "    }, 0);" },
  { line: 22, text: "" },
  { line: 23, text: "    // 5. Context Switch / Yield" },
  { line: 24, text: "    // JS engine yields to Event Loop here" },
  { line: 25, text: "}" },
  { line: 26, text: "" },
  { line: 27, text: "main();" }
];

const pythonCode: CodeLine[] = [
  { line: 1, text: "import time" },
  { line: 2, text: "import threading" },
  { line: 3, text: "" },
  { line: 4, text: "def complex_calc():" },
  { line: 5, text: "    total = 0" },
  { line: 6, text: "    for i in range(1000):" },
  { line: 7, text: "        total += i" },
  { line: 8, text: "    return total" },
  { line: 9, text: "" },
  { line: 10, text: "def main():" },
  { line: 11, text: "    # 1. Heap Allocation" },
  { line: 12, text: "    data = bytearray(1024)" },
  { line: 13, text: "    print(len(data))" },
  { line: 14, text: "" },
  { line: 15, text: "    # 2. Thread Spawning" },
  { line: 16, text: "    def worker():" },
  { line: 17, text: "        # 3. Math & Registers" },
  { line: 18, text: "        res = complex_calc()" },
  { line: 19, text: "        # 4. System Call" },
  { line: 20, text: "        print(res)" },
  { line: 21, text: "" },
  { line: 22, text: "    t = threading.Thread(target=worker)" },
  { line: 23, text: "    t.start()" },
  { line: 24, text: "" },
  { line: 25, text: "    # 5. OS Context Switch" },
  { line: 26, text: "    time.sleep(1)" },
  { line: 27, text: "" },
  { line: 28, text: "if __name__ == '__main__':" },
  { line: 29, text: "    main()" }
];

const javaCode: CodeLine[] = [
  { line: 1, text: "public class Main {" },
  { line: 2, text: "    static int complexCalc() {" },
  { line: 3, text: "        int sum = 0;" },
  { line: 4, text: "        for(int i=0; i<1000; i++) sum += i;" },
  { line: 5, text: "        return sum;" },
  { line: 6, text: "    }" },
  { line: 7, text: "" },
  { line: 8, text: "    public static void main(String[] args) throws Exception {" },
  { line: 9, text: "        // 1. Heap Allocation" },
  { line: 10, text: "        byte[] data = new byte[1024];" },
  { line: 11, text: "        System.out.println(data.length);" },
  { line: 12, text: "" },
  { line: 13, text: "        // 2. Thread Spawning" },
  { line: 14, text: "        Thread t = new Thread(() -> {" },
  { line: 15, text: "            // 3. Math & Registers" },
  { line: 16, text: "            int res = complexCalc();" },
  { line: 17, text: "" },
  { line: 18, text: "            // 4. System Call" },
  { line: 19, text: "            System.out.println(res);" },
  { line: 20, text: "        });" },
  { line: 21, text: "        t.start();" },
  { line: 22, text: "" },
  { line: 23, text: "        // 5. OS Context Switch" },
  { line: 24, text: "        Thread.sleep(1000);" },
  { line: 25, text: "    }" },
  { line: 26, text: "}" }
];

const rustCode: CodeLine[] = [
  { line: 1, text: "use std::thread;" },
  { line: 2, text: "use std::time::Duration;" },
  { line: 3, text: "" },
  { line: 4, text: "fn complex_calc() -> i32 {" },
  { line: 5, text: "    let mut sum = 0;" },
  { line: 6, text: "    for i in 0..1000 { sum += i; }" },
  { line: 7, text: "    sum" },
  { line: 8, text: "}" },
  { line: 9, text: "" },
  { line: 10, text: "fn main() {" },
  { line: 11, text: "    // 1. Heap Allocation" },
  { line: 12, text: "    let data = vec![0u8; 1024];" },
  { line: 13, text: "    println!(\"{}\", data.len());" },
  { line: 14, text: "" },
  { line: 15, text: "    // 2. Thread Spawning" },
  { line: 16, text: "    let handle = thread::spawn(|| {" },
  { line: 17, text: "        // 3. Math & Registers" },
  { line: 18, text: "        let res = complex_calc();" },
  { line: 19, text: "" },
  { line: 20, text: "        // 4. System Call" },
  { line: 21, text: "        println!(\"{}\", res);" },
  { line: 22, text: "    });" },
  { line: 23, text: "" },
  { line: 24, text: "    // 5. OS Context Switch" },
  { line: 25, text: "    thread::sleep(Duration::from_secs(1));" },
  { line: 26, text: "    handle.join().unwrap();" },
  { line: 27, text: "    // Memory freed here automatically by Drop" },
  { line: 28, text: "}" }
];

export const allScenarios: Record<string, ScenarioDefinition> = {
  "Go": {
    language: "Go",
    fileName: "main.go",
    code: goCode,
    steps: generateScenario({
      language: "Go",
      fileName: "main.go",
      compilerName: "Go Compiler",
      isInterpreted: false,
      threadName: "Goroutine",
      hasGC: true,
      code: goCode,
      lineMapping: { start: [1, 3], exec: [16], thread: [22], cpuStart: [24], heapAlloc: [18], sysCall: [27], contextSwitch: [31] }
    })
  }
};
