
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTestById, getMcqById } from '@/lib/data';
import type { MCQ } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RotateCcw, 
  LayoutDashboard, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { QuestionText } from '@/components/question-text';

export default function TestResultPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const test = useMemo(() => getTestById(testId), [testId]);
  const [result, setResult] = useState<any | null>(null);

  const testQuestions = useMemo(() => {
    if (!test) return [];
    return test.mcqs.map(id => getMcqById(id)).filter((q): q is MCQ => !!q);
  }, [test]);

  useEffect(() => {
    const resultData = localStorage.getItem(`testResult-${testId}`);
    if (resultData) {
      try {
        setResult(JSON.parse(resultData));
      } catch (e) {
        console.error("Failed to parse result data", e);
        router.push('/tests');
      }
    } else {
      router.push('/tests');
    }
  }, [testId, router]);

  if (!result || !test) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Compiling Result Data...</p>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const isQualified = percentage >= 50;

  const formatTime = (seconds: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20 pt-4 md:pt-8">
      <header className="flex flex-col gap-4 items-center text-center">
        <div className={cn(
          "p-5 rounded-3xl border shadow-sm transition-all duration-500",
          isQualified ? "bg-green-500/10 border-green-500/20" : "bg-destructive/10 border-destructive/20"
        )}>
          <Award className={cn("w-14 h-14", isQualified ? "text-green-600" : "text-destructive")} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
            Test Performance Review
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span className="text-lg font-medium">{test.title}</span>
          </div>
        </div>
      </header>

      <Card className="border-none shadow-2xl overflow-hidden bg-card transition-all hover:shadow-primary/5">
        <div className={cn(
          "h-2 w-full",
          isQualified ? "bg-green-500" : "bg-destructive"
        )} />
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-headline">Score Analysis</CardTitle>
          <CardDescription>
            Result generated on {result.completedAt ? new Date(result.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown Date'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8 pt-4">
          <div className="relative flex flex-col items-center">
             <div className={cn(
               "text-8xl font-black mb-2 tracking-tighter",
               isQualified ? "text-green-600" : "text-destructive"
             )}>{percentage}%</div>
             <Badge variant={isQualified ? "default" : "destructive"} className="px-6 py-1.5 text-sm uppercase tracking-[0.2em] font-black rounded-full shadow-lg">
               {isQualified ? "Qualified" : "Not Qualified"}
             </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
             <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 text-center flex flex-col items-center gap-2 group transition-all hover:bg-green-500/5">
                <CheckCircle className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-3xl font-black text-foreground">{result.score}</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Correct Answers</p>
             </div>
             <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 text-center flex flex-col items-center gap-2 group transition-all hover:bg-destructive/5">
                <XCircle className="w-6 h-6 text-destructive group-hover:scale-110 transition-transform" />
                <span className="text-3xl font-black text-foreground">{result.totalQuestions - result.score}</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Wrong Answers</p>
             </div>
             <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 text-center flex flex-col items-center gap-2 group transition-all hover:bg-blue-500/5">
                <Clock className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-3xl font-black text-foreground truncate max-w-full">{formatTime(result.timeTaken)}</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Time Taken</p>
             </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center gap-4 pt-6 pb-8 border-t bg-muted/10">
            <Button asChild size="lg" className="px-8 shadow-xl hover:scale-105 transition-transform h-14 text-lg font-bold">
                <Link href={`/tests/${test.id}`}>
                  <RotateCcw className="mr-2 h-5 w-5" /> Retake This Exam
                </Link>
            </Button>
             <Button asChild variant="outline" size="lg" className="px-8 h-14 text-lg font-bold">
                <Link href="/tests">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back to All Tests
                </Link>
            </Button>
        </CardFooter>
      </Card>

      <section className="space-y-8 mt-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-headline tracking-tight text-foreground">Question-wise Review</h2>
          </div>
          <Badge variant="outline" className="font-mono">{testQuestions.length} Questions</Badge>
        </div>

        <div className="grid gap-6">
          {testQuestions.map((q, index) => {
            const userAnswer = result.userAnswers ? result.userAnswers[q.id] : undefined;
            const isCorrect = userAnswer === q.correctAnswerIndex;
            const isUnanswered = userAnswer === undefined;
            
            return (
              <Card key={q.id} className={cn(
                "border shadow-sm overflow-hidden transition-all",
                isCorrect ? "border-green-200 dark:border-green-900/50" : "border-red-200 dark:border-red-900/50"
              )}>
                <div className={cn(
                  "px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-between",
                  isCorrect ? "bg-green-500/10 text-green-700 dark:bg-green-950/50" : "bg-destructive/10 text-destructive dark:bg-red-950/50"
                )}>
                  <span className="flex items-center gap-2">
                    <span className="bg-foreground/10 px-2 py-0.5 rounded-md">Q {index + 1}</span>
                    {q.syllabusPointId}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <><CheckCircle2 className="w-3 h-3" /> Correct</>
                    ) : isUnanswered ? (
                      <><AlertCircle className="w-3 h-3" /> Skipped</>
                    ) : (
                      <><XCircle className="w-3 h-3" /> Incorrect</>
                    )}
                  </div>
                </div>
                
                <CardHeader className="pb-4 pt-6">
                  <QuestionText text={q.question} />
                </CardHeader>
                
                <CardContent className="space-y-6 pb-8">
                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map((option, i) => {
                      const isUserSelection = userAnswer === i;
                      const isCorrectOption = q.correctAnswerIndex === i;
                      
                      return (
                        <div key={i} className={cn(
                          "p-4 rounded-xl border text-sm flex items-center gap-4 transition-all relative",
                          isCorrectOption 
                            ? "bg-green-500/5 border-green-500 text-green-900 dark:text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                            : isUserSelection && !isCorrect 
                            ? "bg-destructive/5 border-destructive text-destructive dark:text-red-100" 
                            : "bg-background border-border text-muted-foreground opacity-70"
                        )}>
                          <div className={cn(
                            "w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 text-xs font-black transition-colors",
                            isCorrectOption ? "bg-green-500 border-green-500 text-white" : 
                            isUserSelection ? "bg-destructive border-destructive text-white" : 
                            "border-border bg-muted/20"
                          )}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className={cn("flex-1 font-medium", isCorrectOption && "font-bold")}>{option}</span>
                          
                          {isCorrectOption && (
                            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter">
                              <CheckCircle2 className="w-3 h-3" /> Correct Answer
                            </div>
                          )}
                          {isUserSelection && !isCorrect && (
                            <div className="flex items-center gap-1.5 bg-destructive/10 text-destructive px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter">
                              <XCircle className="w-3 h-3" /> Your Choice
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2 overflow-hidden rounded-2xl border border-primary/10 bg-primary/5">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest border-b border-primary/10">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Academic Rationale & Explanation
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-foreground/80 font-medium italic leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <footer className="mt-12 flex flex-col items-center gap-6 border-t pt-12 pb-8">
        <p className="text-sm text-muted-foreground italic">You have reached the end of the review. Ready to try again?</p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full px-10 shadow-lg h-14 font-bold">
            <Link href={`/tests/${test.id}`}>
              <RotateCcw className="mr-2 h-5 w-5" /> Retake Exam
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-10 h-14 font-bold">
            <Link href="/">
              <LayoutDashboard className="mr-2 h-5 w-5" /> Dashboard
            </Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
