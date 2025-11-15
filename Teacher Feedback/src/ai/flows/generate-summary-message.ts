'use server';

/**
 * @fileOverview AI flow to generate a summary statement highlighting impactful teacher actions.
 *
 * - generateSummaryMessage - A function that generates a summary statement for teachers.
 * - GenerateSummaryMessageInput - The input type for the generateSummaryMessage function.
 * - GenerateSummaryMessageOutput - The return type for the generateSummaryMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSummaryMessageInputSchema = z.object({
  studentResponseInsights: z
    .string()
    .describe('Insights on student response to lessons.'),
  engagementTips: z
    .string()
    .describe('AI-generated tips provided to improve engagement.'),
  participationRate: z.number().describe('Participation rate in the class.'),
  understandingMetrics: z.string().describe('Metrics on student understanding.'),
  feedbackAnalysis: z.string().describe('Analysis of student feedback.'),
});
export type GenerateSummaryMessageInput = z.infer<
  typeof GenerateSummaryMessageInputSchema
>;

const GenerateSummaryMessageOutputSchema = z.object({
  summaryMessage: z.string().describe('A summary statement for the teacher.'),
});
export type GenerateSummaryMessageOutput = z.infer<
  typeof GenerateSummaryMessageOutputSchema
>;

export async function generateSummaryMessage(
  input: GenerateSummaryMessageInput
): Promise<GenerateSummaryMessageOutput> {
  return generateSummaryMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSummaryMessagePrompt',
  input: {schema: GenerateSummaryMessageInputSchema},
  output: {schema: GenerateSummaryMessageOutputSchema},
  prompt: `You are a helpful AI assistant designed to provide positive and encouraging feedback to teachers based on classroom data.

  Generate a concise and appreciative summary statement (one or two sentences maximum) that highlights the teacher's impactful actions and the positive outcomes observed in the classroom.

  Use the following information to generate the summary:

  Student Response Insights: {{{studentResponseInsights}}}
  Engagement Tips Provided: {{{engagementTips}}}
  Participation Rate: {{{participationRate}}}
  Understanding Metrics: {{{understandingMetrics}}}
  Feedback Analysis: {{{feedbackAnalysis}}}
  `,
});

const generateSummaryMessageFlow = ai.defineFlow(
  {
    name: 'generateSummaryMessageFlow',
    inputSchema: GenerateSummaryMessageInputSchema,
    outputSchema: GenerateSummaryMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
