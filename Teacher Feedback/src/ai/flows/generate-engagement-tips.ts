'use server';

/**
 * @fileOverview A flow that provides AI-driven personalized tips to enhance classroom engagement.
 *
 * - generateEngagementTips - A function that returns AI-driven personalized tips to enhance classroom engagement.
 * - GenerateEngagementTipsInput - The input type for the generateEngagementTips function.
 * - GenerateEngagementTipsOutput - The return type for the generateEngagementTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEngagementTipsInputSchema = z.object({
  studentResponses: z
    .string()
    .describe('A summary of student responses to recent lessons.'),
  participationMetrics: z
    .string()
    .describe('Metrics on student participation in class.'),
  understandingFeedback: z
    .string()
    .describe('Feedback on student understanding of the material.'),
});
export type GenerateEngagementTipsInput = z.infer<
  typeof GenerateEngagementTipsInputSchema
>;

const GenerateEngagementTipsOutputSchema = z.object({
  engagementTips: z
    .string()
    .describe('AI-driven personalized tips to enhance classroom engagement.'),
  summaryMessage: z
    .string()
    .describe(
      'An AI-generated summary statement that highlights impactful teacher actions.'
    ),
});
export type GenerateEngagementTipsOutput = z.infer<
  typeof GenerateEngagementTipsOutputSchema
>;

export async function generateEngagementTips(
  input: GenerateEngagementTipsInput
): Promise<GenerateEngagementTipsOutput> {
  return generateEngagementTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEngagementTipsPrompt',
  input: {schema: GenerateEngagementTipsInputSchema},
  output: {schema: GenerateEngagementTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide teachers with personalized tips to enhance classroom engagement and a summary of their actions.

  Analyze the provided student responses, participation metrics, and understanding feedback to identify areas for improvement and highlight effective teaching strategies.

  Provide concrete, actionable engagement tips that the teacher can implement in their classroom.

  Compose a summary message that emphasizes the teacher's positive impact and suggests further steps based on the analysis.

  Student Responses: {{{studentResponses}}}
  Participation Metrics: {{{participationMetrics}}}
  Understanding Feedback: {{{understandingFeedback}}}

  Engagement Tips:
  {{engagementTips}}

  Summary Message:
  {{summaryMessage}}`,
});

const generateEngagementTipsFlow = ai.defineFlow(
  {
    name: 'generateEngagementTipsFlow',
    inputSchema: GenerateEngagementTipsInputSchema,
    outputSchema: GenerateEngagementTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
