import { Header } from '@/components/layout/Header';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { EngagementTips } from '@/components/dashboard/EngagementTips';
import { ResponseAnalysis } from '@/components/dashboard/ResponseAnalysis';
import {
  generateSummaryMessageAction,
  generateEngagementTipsAction,
} from '@/app/actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-32 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

async function DashboardContent() {
  const summaryData = await generateSummaryMessageAction({
    studentResponseInsights:
      'Students are highly engaged with interactive elements but less so with long readings.',
    engagementTips:
      'Incorporate more group activities. Use visual aids for complex topics.',
    participationRate: 85,
    understandingMetrics: '92% average on recent quizzes.',
    feedbackAnalysis:
      'Generally positive, with requests for more hands-on examples.',
  });

  const tipsData = await generateEngagementTipsAction({
    studentResponses:
      'Students showed excitement during the group project on photosynthesis, with many asking follow-up questions.',
    participationMetrics: '85% of students contributed to the class discussion this week.',
    understandingFeedback:
      'Quiz scores indicate a strong grasp of core concepts, especially photosynthesis.',
  });

  return (
    <div className="space-y-8">
      <SummaryCard summary={summaryData.summaryMessage} />
      <MetricsGrid />
      <EngagementTips tips={tipsData.engagementTips} />
      <ResponseAnalysis />
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
