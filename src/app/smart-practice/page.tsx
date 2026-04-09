'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, Brain, Search, ChevronDown, CheckCircle2, 
  XCircle, Info, Lightbulb, ArrowRight, RotateCcw,
  Layers, AlertTriangle, ArrowLeft, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  FC_CATS, FC_CARDS, SEQ_DATA, 
  TRAP_DATA, MT_UNITS, MT_QUESTIONS 
} from '@/lib/smart-practice-data';
import Link from 'next/link';
import { RazorpaySmartPracticeButton } from '@/components/razorpay-smart-practice-button';

export default function SmartPracticePage() {
  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userRef);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto py-12 pt-4 md:pt-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full mt-8" />
      </div>
    );
  }

  const hasFullAccess = user?.email === 'bilachisachin06@gmail.com';
  // Check specifically for Smart Practice access, independent of general PRO status
  const isUnlocked = hasFullAccess || userData?.hasSmartPracticeAccess === true;

  if (!isUnlocked) {
    return (
      <div className="flex flex-col gap-4 pt-4 md:pt-8">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
            Smart Practice Hub
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">This module requires separate one-time access</span>
          </div>
        </div>
        <RazorpaySmartPracticeButton />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-4 md:pt-8">
      <header className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-headline">
            Smart Practice Hub
          </h1>
          <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-1.5 text-sm font-bold uppercase tracking-widest gap-2">
            <CheckCircle2 className="w-4 h-4" /> Unlocked
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg md:text-xl mt-2 max-w-3xl">
          High-intensity active recall tools. Master sequences, dodge traps, and test your speed.
        </p>
      </header>

      <Tabs defaultValue="flashcards" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted/50 rounded-xl border border-border">
          <TabsTrigger value="flashcards" className="py-3 font-bold gap-2">
            <Zap className="w-4 h-4" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="sequences" className="py-3 font-bold gap-2">
            <Layers className="w-4 h-4" /> Sequences
          </TabsTrigger>
          <TabsTrigger value="traps" className="py-3 font-bold gap-2">
            <AlertTriangle className="w-4 h-4" /> Traps
          </TabsTrigger>
          <TabsTrigger value="minitests" className="py-3 font-bold gap-2">
            <Brain className="w-4 h-4" /> Mini Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards">
          <FlashcardSection />
        </TabsContent>
        <TabsContent value="sequences">
          <SequenceSection />
        </TabsContent>
        <TabsContent value="traps">
          <TrapSection />
        </TabsContent>
        <TabsContent value="minitests">
          <MiniTestSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FlashcardSection() {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [currentIndex, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const cards = useMemo(() => (activeCat ? FC_CARDS[activeCat] : []), [activeCat]);

  if (!activeCat) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FC_CATS.map(c => (
          <Card key={c.id} className="cursor-pointer hover:border-primary transition-all group" onClick={() => setActiveCat(c.id)}>
            <CardHeader>
              <div className="text-3xl mb-2">{c.icon}</div>
              <CardTitle className="text-lg group-hover:text-primary">{c.name}</CardTitle>
              <CardDescription>{FC_CARDS[c.id]?.length || 0} cards</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const progress = Math.round((currentIndex / cards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center px-1">
        <Button variant="ghost" size="sm" onClick={() => { setActiveCat(null); setCurrentIdx(0); }}>
          ← Back to Categories
        </Button>
        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>

      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <Card 
        className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 cursor-pointer relative overflow-hidden transition-all hover:border-primary/50 border-2"
        onClick={() => !showAnswer && setShowAnswer(true)}
      >
        {!showAnswer ? (
          <>
            <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em] font-black text-[10px]">Question</Badge>
            <h3 className="text-2xl md:text-3xl font-bold leading-relaxed">{cards[currentIndex]?.q}</h3>
            <p className="mt-8 text-muted-foreground text-sm flex items-center gap-2 animate-pulse">
              <Zap className="w-4 h-4" /> Tap to reveal answer
            </p>
          </>
        ) : (
          <div className="w-full h-full animate-in fade-in duration-500 text-left">
            <Badge variant="secondary" className="mb-4 uppercase tracking-[0.2em] font-black text-[10px] bg-green-100 text-green-700">Correct Answer</Badge>
            <div className="text-xl md:text-2xl leading-relaxed space-y-4">
              <div dangerouslySetInnerHTML={{ __html: cards[currentIndex]?.a || "" }} />
            </div>
          </div>
        )}
      </Card>

      {showAnswer && (
        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-300">
          <Button variant="outline" className="h-14 text-lg font-bold border-red-200 hover:bg-red-50 text-red-600" onClick={() => { setShowAnswer(false); setCurrentIdx(i => (i + 1) % cards.length); }}>
            <RotateCcw className="mr-2" /> Hard
          </Button>
          <Button variant="default" className="h-14 text-lg font-bold bg-green-600 hover:bg-green-700" onClick={() => { setShowAnswer(false); setCurrentIdx(i => (i + 1) % cards.length); }}>
            <CheckCircle2 className="mr-2" /> Easy
          </Button>
        </div>
      )}
    </div>
  );
}

function SequenceSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => (filter === 'all' ? SEQ_DATA : SEQ_DATA.filter(s => s.cat === filter)), [filter]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'bloom', 'theories', 'teaching', 'assessment', 'andragogy', 'communication'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap uppercase tracking-widest transition-all",
              filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map(s => (
          <Card key={s.id} className="overflow-hidden">
            <div 
              className="p-6 cursor-pointer flex justify-between items-center"
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
            >
              <div>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-xs text-muted-foreground uppercase font-black tracking-tighter mt-1">{s.subtitle}</p>
              </div>
              <ChevronDown className={cn("transition-transform", expanded === s.id && "rotate-180")} />
            </div>
            {expanded === s.id && (
              <CardContent className="pt-0 space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="h-px bg-border" />
                <div className="flex flex-wrap items-center gap-3">
                  {s.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {i > 0 && <span className="text-muted-foreground font-bold">→</span>}
                      <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed italic">{s.explain}</p>
                {s.trap && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase mb-1">
                      <AlertTriangle className="w-3 h-3" /> Exam Trap
                    </div>
                    <p className="text-red-900 text-sm font-medium">{s.trap}</p>
                  </div>
                )}
                {s.mnemonic && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <div className="flex items-center gap-2 text-green-700 font-black text-xs uppercase mb-1">
                      <Lightbulb className="w-3 h-3" /> Mnemonic
                    </div>
                    <p className="text-green-900 text-sm font-bold">{s.mnemonic}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function TrapSection() {
  const [search, setSearch] = useState('');
  const filtered = TRAP_DATA.filter(t => 
    t.wrong.toLowerCase().includes(search.toLowerCase()) || 
    t.correct.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search for tricks and traps (e.g. Vygotsky, oral)..." 
          className="pl-10 h-12 text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((t, i) => (
          <Card key={i} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase text-red-500 tracking-widest">Common Error</p>
                  <p className="text-lg font-bold text-foreground/90">{t.wrong}</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase text-green-500 tracking-widest">Correct Fact</p>
                  <p className="text-lg font-medium text-foreground/80 leading-relaxed">{t.correct}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 mt-2 font-bold uppercase tracking-tighter">
                Rule: {t.rule}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MiniTestSection() {
  const [activeUnit, setActiveUnit] = useState<string | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleStartTest = (unitId: string) => {
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setShowResult(false);
    setActiveUnit(unitId);
  };

  if (showResult) {
    const total = MT_QUESTIONS[activeUnit!]?.length || 0;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <Card className="max-w-xl mx-auto text-center p-8 space-y-6 border-2">
        <div className="space-y-2">
          <CardTitle className="text-4xl font-black">{pct}%</CardTitle>
          <p className="text-muted-foreground text-lg uppercase tracking-widest font-bold">Session Result</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-2xl font-bold text-green-600">{score}</p>
            <p className="text-[10px] uppercase font-black text-green-700">Correct</p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-2xl font-bold text-red-600">{total - score}</p>
            <p className="text-[10px] uppercase font-black text-green-700">Wrong</p>
          </div>
        </div>
        <Button className="w-full h-14 text-lg font-bold" onClick={() => setActiveUnit(null)}>
          Choose Another Unit
        </Button>
      </Card>
    );
  }

  if (activeUnit) {
    const questions = MT_QUESTIONS[activeUnit] || [];
    const q = questions[qIdx];
    
    if (questions.length === 0) {
      return (
        <Card className="max-w-xl mx-auto text-center p-8">
          <CardHeader>
            <CardTitle>No questions found</CardTitle>
            <CardDescription>We're currently populating data for this unit.</CardDescription>
          </CardHeader>
          <Button onClick={() => setActiveUnit(null)}>Go Back</Button>
        </Card>
      );
    }

    const isLast = qIdx === questions.length - 1;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Question {qIdx + 1} of {questions.length}</span>
          <Button variant="ghost" size="sm" onClick={() => setActiveUnit(null)}>Exit</Button>
        </div>
        <Card className="border-2">
          <CardHeader>
            <h3 className="text-2xl font-bold leading-relaxed">{q.q}</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {q.opts.map((o: string, i: number) => (
              <button
                key={i}
                disabled={answered}
                onClick={() => { setSelected(i); setAnswered(true); if(i === q.ans) setScore(s => s+1); }}
                className={cn(
                  "w-full p-5 text-left rounded-xl border-2 transition-all font-medium text-lg flex gap-4 items-center",
                  !answered && "hover:border-primary/50 hover:bg-muted/50",
                  answered && i === q.ans && "border-green-500 bg-green-50 text-green-900 shadow-sm",
                  answered && selected === i && i !== q.ans && "border-red-500 bg-red-50 text-red-900",
                  !answered && "border-border"
                )}
              >
                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-sm shrink-0">{String.fromCharCode(65 + i)}</span>
                {o}
              </button>
            ))}
          </CardContent>
          {answered && (
            <CardContent className="pt-0 space-y-4 animate-in fade-in duration-500">
              <div className="bg-primary/5 p-6 rounded-xl border-2 border-primary/10">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase mb-2">
                  <Info className="w-4 h-4" /> Academic Rationale
                </div>
                <div className="text-lg leading-relaxed text-muted-foreground italic">
                  <div dangerouslySetInnerHTML={{ __html: q.correct || "" }} />
                </div>
                {q.rule && (
                  <Badge variant="outline" className="mt-4 border-primary/20 text-primary font-bold uppercase tracking-tighter">
                    Rule: {q.rule}
                  </Badge>
                )}
              </div>
              <Button 
                className="w-full h-14 text-lg font-bold" 
                onClick={() => {
                  if (isLast) setShowResult(true);
                  else { setQIdx(i => i + 1); setSelected(null); setAnswered(false); }
                }}
              >
                {isLast ? "Finish Test" : "Next Question"} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {MT_UNITS.map(u => (
        <Card key={u.id} className="cursor-pointer hover:border-primary transition-all group" onClick={() => handleStartTest(u.id)}>
          <CardHeader>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{u.num}</p>
            <CardTitle className="text-lg group-hover:text-primary">{u.name}</CardTitle>
            <CardDescription>{MT_QUESTIONS[u.id]?.length || 0} questions · Immediate feedback</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
