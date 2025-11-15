import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from 'lucide-react';

type SummaryCardProps = {
  summary: string;
};

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-headline">
          <Quote className="w-6 h-6 text-primary" />
          Your Impact Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-lg italic text-foreground border-l-4 border-primary pl-4">
          {summary}
        </blockquote>
      </CardContent>
    </Card>
  );
}
