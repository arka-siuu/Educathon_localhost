'use server';

/**
 * @fileOverview Analyzes student responses and engagement levels to identify effective teaching strategies.
 *
 * - analyzeStudentResponse - A function that handles the analysis of student responses.
 * - AnalyzeStudentResponseInput - The input type for the analyzeStudentResponse function.
 * - AnalyzeStudentResponseOutput - The return type for the analyzeStudentResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentResponseInputSchema = z.object({
  studentResponses: z
    .string()
    .describe('Student responses to a lesson or activity.'),
  lessonContent: z.string().describe('The content of the lesson or activity.'),
  teacherActions: z
    .string()
    .describe('Description of teacher actions during the lesson.'),
});
export type AnalyzeStudentResponseInput = z.infer<
  typeof AnalyzeStudentResponseInputSchema
>;

const AnalyzeStudentResponseOutputSchema = z.object({
  effectiveStrategies: z
    .string()
    .describe(
      'A summary of effective teaching strategies identified from student responses and engagement levels.'
    ),
  areasForImprovement: z
    .string()
    .describe(
      'Areas where teaching strategies could be improved to enhance student engagement and understanding.'
    ),
  studentEngagementLevel: z
    .string()
    .describe('Overall student engagement level based on the responses.'),
});
export type AnalyzeStudentResponseOutput = z.infer<
  typeof AnalyzeStudentResponseOutputSchema
>;

export async function analyzeStudentResponse(
  input: AnalyzeStudentResponseInput
): Promise<AnalyzeStudentResponseOutput> {
  return analyzeStudentResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentResponsePrompt',
  input: {schema: AnalyzeStudentResponseInputSchema},
  output: {schema: AnalyzeStudentResponseOutputSchema},
  prompt: `You are an expert in educational pedagogy. Analyze the student responses and engagement levels provided to identify effective teaching strategies, areas for improvement, and the overall student engagement level.

  Lesson Content: {{{lessonContent}}}
  Teacher Actions: {{{teacherActions}}}
  Student Responses: {{{studentResponses}}}

  Based on this information, provide a summary of effective strategies, areas for improvement, and the student engagement level.
  Format your repsonse:
  Effective Strategies:
  <summary of effective strategies>

  Areas for Improvement:
  <areas for improvement>

  Student Engagement Level:
  <overall student engagement level>
  `,
});

const analyzeStudentResponseFlow = ai.defineFlow(
  {
    name: 'analyzeStudentResponseFlow',
    inputSchema: AnalyzeStudentResponseInputSchema,
    outputSchema: AnalyzeStudentResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
