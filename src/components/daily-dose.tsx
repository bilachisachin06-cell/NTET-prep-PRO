
'use client';

import { useState, useEffect } from 'react';
import { allMcqs } from '@/lib/data';
import type { MCQ } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Info, Sparkles, ArrowRight, Brain, Zap, RotateCcw, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuestionText } from '@/components/question-text';

export function DailyDose() {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('lastDailyDoseDate');
    if (lastDate === today) {
      setIsCompletedToday(true);
    }
  }, []);

  const handleStart = () => {
    const randomQuestions = [...allMcqs]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    
    setQuestions(randomQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
    setIsOpen(true);
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('lastDailyDoseDate', today);
      setIsCompletedToday(true);
    }
  };

  if (!mounted) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full">
      <Card className={cn(
        "overflow-hidden border-2 transition-all duration-300",
        isCompletedToday ? "border-green-500/20 bg-green-500/5" : "border-primary/20 bg-primary/5 shadow-md"
      )}>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-2xl shrink-0",
                isCompletedToday ? "bg-green-500/10 text-green-600" : "bg-primary text-primary-foreground shadow-lg"
              )}>
                {isCompletedToday ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight font-headline">
                  {isCompletedToday ? "Daily Dose Completed!" : "Daily Dose Challenge"}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {isCompletedToday 
                    ? "Great consistency! You've sharpened your skills for today." 
                    : "Boost your retention with 5 random high-yield MCQs."}
                </p>
              </div>
            </div>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className={cn(
                    "font-bold h-12 px-8 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95",
                    isCompletedToday ? "bg-muted text-muted-foreground hover:bg-muted/80" : "animate-pulse"
                  )}
                  onClick={handleStart}
                >
                  {isCompletedToday ? (
                    <><RotateCcw className="mr-2 h-4 w-4" /> Retake Quiz</>
                  ) : (
                    <><PlayCircle className="mr-2 h-5 w-5" /> Start Today's Quiz</>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
                <div className="bg-primary p-6 text-primary-foreground relative shrink-0">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Brain className="w-24 h-24" />
                  </div>
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-none uppercase text-[10px] font-black tracking-widest">
                        Daily Dose
                      </Badge>
                    </div>
                    <DialogTitle className="text-2xl font-headline font-bold text-white">Today's Quick 5</DialogTitle>
                    <DialogDescription className="text-primary-foreground/80 font-medium">
                      Keep your preparation sharp with these 5 high-yield questions.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="p-6 bg-card overflow-y-auto flex-1">
                  {!showResult && currentQ ? (
                    <div className="space-y-6 pb-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span>Question {currentIndex + 1} of 5</span>
                        <span className="text-primary">Score: {score}</span>
                      </div>

                      <div className="space-y-4">
                        <QuestionText text={currentQ.question} />
                        <div className="grid gap-2">
                          {currentQ.options.map((option, i) => {
                            const isSelected = selectedOption === i;
                            const isCorrect = i === currentQ.correctAnswerIndex;
                            
                            return (
                              <button
                                key={i}
                                disabled={isAnswered}
                                onClick={() => handleAnswer(i)}
                                className={cn(
                                  "w-full p-4 text-left rounded-xl border-2 transition-all flex items-center gap-3",
                                  !isAnswered && "hover:border-primary/50 hover:bg-muted/50 border-border",
                                  isAnswered && isCorrect && "bg-green-500/10 border-green-500 text-green-900 dark:text-green-100",
                                  isAnswered && isSelected && !isCorrect && "bg-destructive/10 border-destructive text-destructive dark:text-red-100",
                                  isAnswered && !isSelected && !isCorrect && "opacity-40 grayscale border-border"
                                )}
                              >
                                <span className={cn(
                                  "w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0",
                                  isAnswered && isCorrect ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                                )}>{String.fromCharCode(65 + i)}</span>
                                <span className="text-sm font-semibold leading-tight">{option}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {isAnswered && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 shadow-inner">
                            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase mb-1.5 tracking-wider">
                              <Info className="w-3.5 h-3.5" /> Academic Rationale
                            </div>
                            <p className="text-sm italic text-muted-foreground leading-relaxed">
                              {currentQ.explanation}
                            </p>
                          </div>
                          <Button className="w-full h-12 text-base font-bold shadow-lg" onClick={handleNext}>
                            {currentIndex === 4 ? "Finish Daily Dose" : "Next Question"} <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-6">
                      <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black tracking-tight text-foreground">{score}/5</h3>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Daily Dose Completed!</p>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        Great job! Consistency is the secret to mastering the NTET curriculum. See you tomorrow!
                      </p>
                      <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl" onClick={() => setIsOpen(false)}>
                        Return to Dashboard
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
