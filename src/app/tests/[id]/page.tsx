
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { getTestById, getMcqById } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { MCQ } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock, ArrowLeft, Loader2, BookOpen, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { QuestionText } from '@/components/question-text';

export default function TestTakingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const testId = params.id as string;
  const mode = searchParams.get('mode') === 'practice' ? 'practice' : 'test';
  
  const { user } = useUser();
  const db = useFirestore();
  
  const test = useMemo(() => getTestById(testId), [testId]);
  
  const questions = useMemo(() => {
    if (!test) return [];
    return test.mcqs.map(id => getMcqById(id)).filter((q): q is MCQ => !!q);
  }, [test]);

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [answeredInPractice, setAnsweredInPractice] = useState<{ [key: string]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (test && questions.length > 0 && mode === 'test') {
      const calculatedDuration = test.duration;
      setTimeLeft(Math.floor(calculatedDuration * 60));
    }
  }, [test, questions, mode]);

  const handleSubmit = () => {
    if (isSubmitting || !test || !user) return;
    setIsSubmitting(true);

    let score = 0;
    questions.forEach(q => {
        if(userAnswers[q.id] === q.correctAnswerIndex) {
            score++;
        }
    });

    const result = {
        testId: test.id,
        userId: user.uid,
        score,
        totalQuestions: questions.length,
        userAnswers,
        timeTaken: mode === 'test' ? (test.duration * 60) - (timeLeft || 0) : 0,
        completedAt: new Date().toISOString(),
        type: test.type,
        mode: mode
    };

    const testRef = doc(db, 'users', user.uid, 'testSessions', test.id);
    setDoc(testRef, result)
      .then(() => {
        localStorage.setItem(`testResult-${test.id}`, JSON.stringify(result));
        router.push(`/tests/${test.id}/results`);
      })
      .catch(async (err) => {
        setIsSubmitting(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: testRef.path,
          operation: 'create',
          requestResourceData: result
        }));
      });
  };

  useEffect(() => {
    if (!mounted || !test || isSubmitting || timeLeft === null || mode === 'practice') return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, mounted, test, isSubmitting, mode]);

  if (!test) return notFound();
  if (!mounted) return (
    <div className="flex flex-col gap-4 items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">Loading session...</p>
    </div>
  );

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    if (mode === 'practice' && answeredInPractice[questionId]) return;
    
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    
    if (mode === 'practice') {
      setAnsweredInPractice(prev => ({ ...prev, [questionId]: true }));
    }
  };

  return (
    <div className="flex flex-col gap-8 relative pb-20">
      {/* Sticky Header */}
      <div className="sticky top-14 z-[50] bg-background border-b -mx-4 md:-mx-8 px-4 md:px-8 shadow-sm py-4 transition-all">
        <div className="max-w-5xl mx-auto flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1 overflow-hidden">
                <div className="hidden sm:block">
                    <h1 className="text-base font-bold tracking-tight text-foreground font-headline truncate max-w-[150px] md:max-w-xs">
                    {test.title} <span className="text-xs text-primary uppercase ml-2">({mode})</span>
                    </h1>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-tighter">
                      {Object.keys(userAnswers).length} / {questions.length} Attempted
                    </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 h-7 text-xs text-muted-foreground hover:text-primary">
                  <Link href="/tests">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Exit
                  </Link>
                </Button>
            </div>

            {mode === 'test' ? (
              <div className={cn(
                  "flex flex-col items-center gap-1 px-8 py-2 rounded-xl border-2 transition-all shadow-inner", 
                  (timeLeft !== null && timeLeft < 300) 
                      ? 'text-destructive bg-destructive/5 border-destructive/20 animate-pulse' 
                      : 'text-primary bg-primary/5 border-primary/10'
              )}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Remaining Time</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-xl md:text-2xl font-mono font-bold tabular-nums">
                      {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                    </span>
                  </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-6 py-3 bg-primary/5 border border-primary/10 rounded-xl">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-sm font-black text-primary uppercase tracking-widest">Practice Mode</span>
              </div>
            )}

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="default" size="lg" className="md:px-8 shadow-md font-bold" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Test'}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Finish Attempt?</AlertDialogTitle>
                    <AlertDialogDescription>
                    You have answered {Object.keys(userAnswers).length} out of {questions.length} questions. Are you sure you want to finish?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pt-6">
        {questions.map((q, index) => {
          const isAnswered = mode === 'practice' && answeredInPractice[q.id];
          const selectedOption = userAnswers[q.id];
          const isCorrect = selectedOption === q.correctAnswerIndex;

          return (
            <Card key={q.id} className="scroll-mt-40 transition-all hover:border-primary/20 border-2">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-[0.2em]">Question {index+1}</span>
                      {selectedOption !== undefined && (
                        <span className={cn(
                          "text-xs font-black flex items-center gap-2 uppercase tracking-widest",
                          isAnswered ? (isCorrect ? 'text-green-600' : 'text-destructive') : 'text-primary'
                        )}>
                          <div className={cn("w-2 h-2 rounded-full animate-pulse", isAnswered ? (isCorrect ? 'bg-green-600' : 'bg-destructive') : 'bg-primary')} /> 
                          {isAnswered ? (isCorrect ? 'Correct' : 'Incorrect') : 'Answered'}
                        </span>
                      )}
                    </div>
                    <QuestionText text={q.question} />
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup 
                      value={selectedOption?.toString()}
                      onValueChange={(val) => handleAnswerChange(q.id, parseInt(val))}
                      disabled={isAnswered}
                      className="gap-3"
                    >
                        {q.options.map((option, i) => {
                            const isUserSelection = selectedOption === i;
                            const isCorrectOption = q.correctAnswerIndex === i;
                            
                            return (
                              <Label 
                                key={i} 
                                className={cn(
                                  "flex items-center p-5 border-2 rounded-xl cursor-pointer hover:bg-muted/50 transition-all group",
                                  isUserSelection && "bg-primary/5 border-primary shadow-sm ring-2 ring-primary/10",
                                  isAnswered && isCorrectOption && "bg-green-100 dark:bg-green-900/30 border-green-500",
                                  isAnswered && isUserSelection && !isCorrectOption && "bg-red-100 dark:bg-red-900/30 border-red-500"
                                )}
                              >
                                  <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} className="mr-4 h-5 w-5" />
                                  <span className="text-base md:text-xl font-medium leading-relaxed">{option}</span>
                              </Label>
                            );
                        })}
                    </RadioGroup>
                </CardContent>
                {isAnswered && (
                  <CardFooter className="flex flex-col items-stretch pt-0 pb-8 border-t-2 bg-muted/5">
                    <div className="mt-6 space-y-6">
                      <Alert variant={isCorrect ? 'default' : 'destructive'} className={cn("border-2 p-6", isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950/50' : 'border-red-500 bg-red-50 dark:bg-red-950/50')}>
                        {isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                        <AlertTitle className="font-black text-xl mb-2">{isCorrect ? 'Correct Answer!' : 'Incorrect Choice'}</AlertTitle>
                        <AlertDescription className="text-lg md:text-xl leading-relaxed">
                          The correct answer is: <strong className="underline underline-offset-4">{q.options[q.correctAnswerIndex]}</strong>
                        </AlertDescription>
                      </Alert>
                      <div className="p-6 bg-background rounded-xl border-2 border-primary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-sm font-black text-primary uppercase tracking-[0.2em]">
                          <Info className="w-5 h-5" />
                          Academic Rationale
                        </div>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                )}
            </Card>
          );
        })}
      </div>
      
      <div className="mt-16 flex flex-col items-center gap-6">
        <p className="text-lg text-muted-foreground italic font-medium">End of Question Paper</p>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="lg" className="w-full max-w-md shadow-2xl h-16 text-xl font-black rounded-2xl" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : 'Finish & View Results'}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Submit Final Attempt?</AlertDialogTitle>
                <AlertDialogDescription>
                Once submitted, your performance will be saved to your progress profile.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Go Back</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting} className="font-bold">
                    Submit Now
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
