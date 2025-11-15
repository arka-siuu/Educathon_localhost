import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

type EngagementTipsProps = {
  tips: string;
};

function parseTips(tipsString: string): string[] {
  if (!tipsString) return [];
  return tipsString
    .split('\n')
    .map((line) => line.trim())
    .map((line) => line.replace(/^[-*]\s*|^\d+\.\s*/, ''))
    .filter((line) => line.length > 2);
}

export function EngagementTips({ tips }: EngagementTipsProps) {
  const tipsList = parseTips(tips);
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-headline">
          <Lightbulb className="w-6 h-6 text-primary" />
          AI Engagement Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tipsList.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 mt-1 text-accent shrink-0" />
              <span className="text-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
