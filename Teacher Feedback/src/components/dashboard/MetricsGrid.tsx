import { Users, Target, Smile } from 'lucide-react';
import { MetricCard } from './MetricCard';

export function MetricsGrid() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">At a Glance</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={Users}
          title="Participation Rate"
          value="85%"
          description="+5% from last week"
        />
        <MetricCard
          icon={Target}
          title="Understanding Score"
          value="92%"
          description="Based on recent quizzes"
        />
        <MetricCard
          icon={Smile}
          title="Feedback Sentiment"
          value="Positive"
          description="From 25 student comments"
        />
      </div>
    </div>
  );
}
