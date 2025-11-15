
'use server';

import {
  analyzeStudentResponse,
  type AnalyzeStudentResponseInput,
  type AnalyzeStudentResponseOutput,
} from '@/ai/flows/analyze-student-response';
import {
  generateSummaryMessage,
  type GenerateSummaryMessageInput,
  type GenerateSummaryMessageOutput,
} from '@/ai/flows/generate-summary-message';
import {
  generateEngagementTips,
  type GenerateEngagementTipsInput,
  type GenerateEngagementTipsOutput,
} from '@/ai/flows/generate-engagement-tips';

export async function analyzeStudentResponseAction(
  input: AnalyzeStudentResponseInput
): Promise<AnalyzeStudentResponseOutput> {
  return await analyzeStudentResponse(input);
}

export async function generateSummaryMessageAction(
  input: GenerateSummaryMessageInput
): Promise<GenerateSummaryMessageOutput> {
  return await generateSummaryMessage(input);
}

export async function generateEngagementTipsAction(
  input: GenerateEngagementTipsInput
): Promise<GenerateEngagementTipsOutput> {
  return await generateEngagementTips(input);
}
