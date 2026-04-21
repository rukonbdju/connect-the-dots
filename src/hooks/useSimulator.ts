import { useState, useCallback, useEffect } from 'react';
import { SimulatorState, Language, StoryStep, CodeLine } from '../types/simulator';
import { allScenarios } from '../data/scenarios';

export function useSimulator(language: Language) {
  const scenarioDef = allScenarios[language] || allScenarios['C/C++'];
  const SCENARIO: StoryStep[] = scenarioDef.steps;
  
  const getInitialState = (scenarioSteps: StoryStep[]): SimulatorState => ({
    currentStep: 0,
    activeComponents: scenarioSteps[0].activeComponents,
    dataFlow: null,
    history: [scenarioSteps[0].title],
    isRunning: false,
    hasProcess: false,
    hasVirtualMemory: false,
    isInKernelMode: false,
    activeGoroutines: 0,
    sp: '0x0000',
    bp: '0x0000',
    activeLines: scenarioSteps[0].activeLines || []
  });

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [stateStack, setStateStack] = useState<SimulatorState[]>([getInitialState(SCENARIO)]);

  if (language !== currentLanguage) {
    setCurrentLanguage(language);
    setStateStack([getInitialState(scenarioDef.steps)]);
  }

  const currentState = stateStack[stateStack.length - 1];

  const applyStep = useCallback((stepIndex: number, prevState: SimulatorState) => {
    const stepDef = SCENARIO[stepIndex];
    const updates = stepDef.action(prevState);
    
    return {
      ...prevState,
      ...updates,
      currentStep: stepIndex,
      activeComponents: stepDef.activeComponents,
      activeLines: stepDef.activeLines || prevState.activeLines || [],
      dataFlow: stepDef.dataFlow || null,
      history: [`[${stepDef.topic}] ${stepDef.title}`, ...prevState.history].slice(0, 10)
    };
  }, [SCENARIO]);

  const stepForward = useCallback(() => {
    setStateStack(prevStack => {
      const current = prevStack[prevStack.length - 1];
      if (current.currentStep >= SCENARIO.length - 1) return prevStack;
      
      const nextIndex = current.currentStep + 1;
      const nextState = applyStep(nextIndex, current);
      
      if (nextIndex === SCENARIO.length - 1) {
         nextState.isRunning = false;
      }

      return [...prevStack, nextState];
    });
  }, [applyStep, SCENARIO.length]);

  const stepBackward = useCallback(() => {
    setStateStack(prevStack => {
      if (prevStack.length <= 1) return prevStack;
      
      const newStack = [...prevStack];
      newStack.pop();
      newStack[newStack.length - 1].isRunning = false; 

      return newStack;
    });
  }, []);

  const reset = useCallback(() => {
    setStateStack([getInitialState(SCENARIO)]);
  }, [SCENARIO]);

  const toggleRun = useCallback(() => {
    setStateStack(prevStack => {
      const newStack = [...prevStack];
      const current = { ...newStack[newStack.length - 1] };
      
      if (current.currentStep >= SCENARIO.length - 1) {
         const freshState = { ...getInitialState(SCENARIO), isRunning: true };
         return [freshState];
      }

      current.isRunning = !current.isRunning;
      newStack[newStack.length - 1] = current;
      return newStack;
    });
  }, [SCENARIO]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentState.isRunning && currentState.currentStep < SCENARIO.length - 1) {
      interval = setInterval(stepForward, 4000); // 4s per step so user can read
    }
    return () => clearInterval(interval);
  }, [currentState.isRunning, currentState.currentStep, stepForward, SCENARIO.length]);

  return {
    state: currentState,
    scenario: SCENARIO,
    fileName: scenarioDef.fileName,
    codeFiles: scenarioDef.code,
    stepForward,
    stepBackward,
    reset,
    toggleRun,
    currentStepDef: SCENARIO[currentState.currentStep]
  };
}
