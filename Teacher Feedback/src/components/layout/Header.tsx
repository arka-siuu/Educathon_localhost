import { BookOpenCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="mb-8 text-center md:mb-12">
      <div className="inline-flex items-center gap-2 mb-4">
        <BookOpenCheck className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-headline">
          EduAI Insights
        </h1>
      </div>
      <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
        Dear Teacher, you're doing amazing! Here’s how AI has helped, what
        students are responding to best, and ideas to make your classes even
        more magical.
      </p>
    </header>
  );
}
