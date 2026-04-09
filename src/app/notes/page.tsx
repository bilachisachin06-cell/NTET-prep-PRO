'use client';

import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ArrowLeft, 
  Crown, 
  BookMarked, 
  Zap, 
  Users2, 
  Brain, 
  ClipboardCheck, 
  TrendingUp 
} from 'lucide-react';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function NotesPage() {
  const { user: currentUser, isUserLoading } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const userRef = useMemoFirebase(() => {
    if (!db || !currentUser?.uid) return null;
    return doc(db, 'users', currentUser.uid);
  }, [db, currentUser?.uid]);

  const { data: userData, isLoading: isDataLoading } = useDoc(userRef);

  if (!mounted || isUserLoading || isDataLoading) {
    return (
      <div className="flex flex-col gap-8 pt-4 md:pt-8">
        <header className="flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-64" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  const hasFullAccess = currentUser?.email === 'bilachisachin06@gmail.com';
  const isPro = hasFullAccess || (userData?.subscriptionStatus === 'pro' && (
    !userData.subscriptionExpiresAt || new Date(userData.subscriptionExpiresAt) > new Date()
  ));

  const roadmapSteps = [
    { label: "1. Master Guide", desc: "Detailed concepts", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "2. Dossier", desc: "Key persons & theories", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "3. Quick Revision", desc: "High-yield points", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "4. Smart Practice", desc: "Active recall Hub", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "5. PYPs & Mocks", desc: "Final simulation", color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="flex flex-col gap-8 pt-4 md:pt-8">
      <header className="flex flex-col gap-2">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
            Study Material
          </h1>
          {hasFullAccess && (
            <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
              ADMIN ACCESS
            </div>
          )}
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Your path to success begins here. Follow the recommended sequence for maximum retention.
        </p>
      </header>

      {/* Preparation Roadmap */}
      <section className="bg-card border-2 border-primary/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Recommended Success Path
          </h2>
          <span className="text-[10px] font-bold text-muted-foreground italic">Follow these steps in order</span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {roadmapSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-2 relative group">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border-2 transition-transform group-hover:scale-110",
                  step.bg, step.color, "border-white dark:border-muted"
                )}>
                  {idx + 1}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-black uppercase tracking-tight text-foreground">
                    {step.label.split('. ')[1]}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-medium italic">
                    {step.desc}
                  </span>
                </div>
                {idx < 4 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(50%+30px)] w-[calc(100%-60px)] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Master Guide Card (STEP 1 - PRO) */}
        <Card className="border-2 border-primary shadow-lg bg-primary/5 overflow-hidden relative group scale-105 z-10">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <BookMarked className="w-24 h-24 text-primary" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1">
                <Crown className="w-2 h-2" /> STEP 1: PRO
              </span>
            </div>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              Master Guide
            </CardTitle>
            <CardDescription className="text-sm font-medium text-foreground/80 line-clamp-2">
              Start here for detailed coverage of all 8 modules for comprehensive pedagogical preparation.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full shadow-sm" variant={isPro ? "default" : "outline"}>
              <Link href="/notes/detailed">
                {isPro ? "Open Master Guide" : "Upgrade to Unlock"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Theories & Persons Dossier Card (STEP 2 - PRO) */}
        <Card className="border-2 border-indigo-500/20 shadow-lg bg-indigo-500/5 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <Users2 className="w-24 h-24 text-indigo-500" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                <Crown className="w-2 h-2 inline-block mr-1" /> STEP 2: PRO
              </span>
            </div>
            <CardTitle className="text-2xl text-indigo-600 flex items-center gap-2">
              Theories & Persons
            </CardTitle>
            <CardDescription className="text-sm font-medium text-foreground/80 line-clamp-2">
              Detailed interactive dossiers on Bloom, Vygotsky, Piaget, and all major learning theories.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-sm">
              <Link href="/notes/theories-persons">
                {isPro ? "Open Dossier" : "Upgrade to Unlock"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Revision Notes Card (STEP 3 - FREE) */}
        <Card className="border-2 border-accent/20 shadow-lg bg-accent/5 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <Zap className="w-24 h-24 text-accent" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1">
                STEP 3: FREE ACCESS
              </span>
            </div>
            <CardTitle className="text-2xl text-accent flex items-center gap-2">
              Quick Revision
            </CardTitle>
            <CardDescription className="text-sm font-medium text-foreground/80 line-clamp-2">
              Scan high-yield points, exam traps, and mnemonics for last-minute preparation.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full shadow-sm" variant="default" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              <Link href="/notes/quick-revision">
                Open Revision <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Smart Practice Bridge Card (STEP 4) */}
        <Card className="border-2 border-emerald-500/20 shadow-lg bg-emerald-500/5 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <Brain className="w-24 h-24 text-emerald-500" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                STEP 4: SMART HUB
              </span>
            </div>
            <CardTitle className="text-2xl text-emerald-600 flex items-center gap-2">
              Active Recall
            </CardTitle>
            <CardDescription className="text-sm font-medium text-foreground/80 line-clamp-2">
              Master sequences and flashcards in the Smart Practice Hub.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm">
              <Link href="/smart-practice">
                Go to Practice Hub <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Mock Test Bridge Card (STEP 5) */}
        <Card className="border-2 border-rose-500/20 shadow-lg bg-rose-500/5 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <ClipboardCheck className="w-24 h-24 text-rose-500" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                STEP 5: SIMULATION
              </span>
            </div>
            <CardTitle className="text-2xl text-rose-600 flex items-center gap-2">
              Mocks & PYPs
            </CardTitle>
            <CardDescription className="text-sm font-medium text-foreground/80 line-clamp-2">
              Test your knowledge with full-length exams and previous papers.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full bg-rose-600 hover:bg-rose-700 text-white border-none shadow-sm">
              <Link href="/tests">
                Go to Tests <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
