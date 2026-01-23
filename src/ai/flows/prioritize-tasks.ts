'use server';

/**
 * @fileOverview This file defines a Genkit flow for prioritizing tasks based on deadlines, subject weightage, and difficulty.
 *
 * - prioritizeTasks - A function that prioritizes tasks based on the provided input.
 * - Task - Represents a single task with its details.
 * - PrioritizationInput - The input type for the prioritizeTasks function.
 * - PrioritizationOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSchema = z.object({
  name: z.string().describe('The name of the task.'),
  deadline: z.string().describe('The deadline of the task (e.g., YYYY-MM-DD).'),
  subject: z.string().describe('The subject the task belongs to.'),
  weightage: z.number().describe('The weightage of the task in percentage (0-100).'),
  difficulty: z.string().describe('The difficulty level of the subject (e.g., Easy, Medium, Hard).'),
});

export type Task = z.infer<typeof TaskSchema>;

const PrioritizationInputSchema = z.object({
  tasks: z.array(TaskSchema).describe('An array of tasks to prioritize.'),
});

export type PrioritizationInput = z.infer<typeof PrioritizationInputSchema>;

const PrioritizationOutputSchema = z.object({
  prioritizedTasks: z.array(z.string()).describe('An array of task names in prioritized order.'),
  reasoning: z.string().describe('The AI reasoning behind the prioritization.'),
});

export type PrioritizationOutput = z.infer<typeof PrioritizationOutputSchema>;

export async function prioritizeTasks(input: PrioritizationInput): Promise<PrioritizationOutput> {
  return prioritizeTasksFlow(input);
}

const prioritizeTasksPrompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizationInputSchema},
  output: {schema: PrioritizationOutputSchema},
  prompt: `You are an AI assistant designed to help students prioritize their tasks.

  Given the following tasks with their deadlines, subject weightage, and difficulty level, provide a prioritized list of tasks and explain your reasoning.

  Tasks:
  {{#each tasks}}
  - Name: {{name}}, Deadline: {{deadline}}, Subject: {{subject}}, Weightage: {{weightage}}%, Difficulty: {{difficulty}}
  {{/each}}

  Prioritized Tasks: (List task names in order of priority)
  Reasoning: (Explain why you prioritized the tasks in this order, considering deadlines, weightage, and difficulty)
  `,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizationInputSchema,
    outputSchema: PrioritizationOutputSchema,
  },
  async input => {
    const {output} = await prioritizeTasksPrompt(input);
    return output!;
  }
);
