
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { AnalyzeStudentResponseOutput } from '@/ai/flows/analyze-student-response';
import { analyzeStudentResponseAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  BrainCircuit,
  TrendingUp,
  BarChart,
} from 'lucide-react';

const formSchema = z.object({
  lessonContent: z
    .string()
    .min(20, { message: 'Please provide more details about the lesson content.' })
    .max(2000),
  teacherActions: z
    .string()
    .min(20, { message: 'Please describe your actions during the lesson.' })
    .max(2000),
  studentResponses: z
    .string()
    .min(20, { message: 'Please provide some examples of student responses.' })
    .max(2000),
});

function LoadingSkeletons() {
  return (
    <div className="grid gap-4 mt-8 md:grid-cols-1 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function ResultDisplay({ result }: { result: AnalyzeStudentResponseOutput }) {
  return (
    <div className="grid gap-4 mt-8 md:grid-cols-1 lg:grid-cols-3 animate-in fade-in-50">
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <BrainCircuit /> Effective Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{result.effectiveStrategies}</p>
        </CardContent>
      </Card>
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <TrendingUp /> Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{result.areasForImprovement}</p>
        </CardContent>
      </Card>
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <BarChart /> Engagement Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground font-semibold text-lg">
            {result.studentEngagementLevel}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResponseAnalysis() {
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeStudentResponseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonContent: '',
      teacherActions: '',
      studentResponses: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeStudentResponseAction(values);
      setAnalysisResult(result);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-headline">
          <Sparkles className="w-6 h-6 text-primary" />
          Analyze Your Lesson
        </CardTitle>
        <CardDescription>
          Enter details about a recent lesson to get AI-powered feedback on
          teaching strategies and student engagement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="lessonContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Today's lesson was on the water cycle, including evaporation, condensation, and precipitation..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherActions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher Actions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I started with a short video, then used a diagram on the board and asked students to work in groups..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentResponses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Responses</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Many students were excited about the group activity. A few seemed confused about the term 'transpiration'..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Feedback'
              )}
            </Button>
          </form>
        </Form>

        {isLoading && <LoadingSkeletons />}

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && <ResultDisplay result={analysisResult} />}
      </CardContent>
    </Card>
  );
}
