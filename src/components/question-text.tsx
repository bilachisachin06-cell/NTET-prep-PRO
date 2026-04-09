
'use client';

import { cn } from '@/lib/utils';

interface QuestionTextProps {
  text: string;
  className?: string;
}

/**
 * Standard question renderer that preserves the original formatting 
 * and line breaks provided in the exam data.
 */
export function QuestionText({ text, className }: QuestionTextProps) {
  return (
    <p className={cn("text-lg md:text-2xl font-bold leading-relaxed whitespace-pre-wrap", className)}>
      {text}
    </p>
  );
}
