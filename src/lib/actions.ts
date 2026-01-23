"use server";

import { prioritizeTasks, type PrioritizationInput, type PrioritizationOutput } from "@/ai/flows/prioritize-tasks";
import { reduceStress, type ReduceStressInput, type ReduceStressOutput } from "@/ai/flows/reduce-stress";

export async function getTaskPriority(input: PrioritizationInput): Promise<PrioritizationOutput> {
  // Here you could add validation or user-specific logic before calling the AI flow.
  try {
    const result = await prioritizeTasks(input);
    return result;
  } catch (error) {
    console.error("Error in getTaskPriority:", error);
    // It's good practice to return a structured error
    return {
        prioritizedTasks: [],
        reasoning: "An error occurred while prioritizing tasks. Please try again later."
    }
  }
}

export async function getStressReductionSuggestions(input: ReduceStressInput): Promise<ReduceStressOutput> {
  // Here you could add validation or user-specific logic.
  try {
    const result = await reduceStress(input);
    return result;
  } catch (error) {
    console.error("Error in getStressReductionSuggestions:", error);
    return {
        stressScore: 0,
        suggestions: [],
    }
  }
}
