
'use client';

import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { getTests, getMcqById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, FileText, ArrowLeft, Crown, CheckCircle2, PlayCircle, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { TestPaywall } from '@/components/test-paywall';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TestsPage() {
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

  const sessionsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'users', user.uid, 'testSessions');
  }, [db, user?.uid]);

  const { data: sessionData } = useCollection(sessionsQuery);

  const allTests = getTests();
  const mockTests = allTests.filter((test) => test.type === 'mock');
  const pypTests = allTests.filter((test) => test.type === 'pyp');

  if (!mounted || isUserLoading) {
    return (
      <div className="flex flex-col gap-8 pt-4 md:pt-8">
        <header className="flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-64" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const hasFullAccess = user?.email === 'bilachisachin06@gmail.com';
  const isPro = hasFullAccess || (userData?.subscriptionStatus === 'pro' && (
    !userData.subscriptionExpiresAt || new Date(userData.subscriptionExpiresAt) > new Date()
  ));

  if (!isPro) {
    return (
      <div className="flex flex-col gap-4 pt-4 md:pt-8">
        <header className="flex flex-col gap-2">
          <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
            Mock Tests & PYPs
          </h1>
        </header>
        <TestPaywall />
      </div>
    );
  }

  const TestCard = ({ test }: { test: ReturnType<typeof getTests>[0] }) => {
    const questionCount = test.mcqs.filter(id => !!getMcqById(id)).length;
    const previousResult = sessionData?.find(s => s.testId === test.id);
    
    return (
        <Card className="flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 relative overflow-hidden">
        {previousResult && (
          <div className="absolute top-0 right-0 p-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1">
              <CheckCircle2 className="w-3 h-3" /> Attempted
            </Badge>
          </div>
        )}
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg pr-12">
                <FileText className="w-5 h-5 text-primary shrink-0"/>
                {test.title}
            </CardTitle>
            <CardDescription>
            {test.type === 'pyp' ? `Previous Year Paper from ${test.year}` : 'Full Syllabus Mock Test'}
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
            <div className="flex flex-col gap-3">
              <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4"/>
                      <span>{test.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4"/>
                      <span>{questionCount} Qs</span>
                  </div>
              </div>
              {previousResult && (
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">Last Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-primary">{previousResult.score}</span>
                    <span className="text-xs text-muted-foreground">/ {previousResult.totalQuestions}</span>
                    <span className="text-xs font-medium ml-auto text-muted-foreground italic">
                      {Math.round((previousResult.score / previousResult.totalQuestions) * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
        </CardContent>
        <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant={previousResult ? "outline" : "default"}>
                  Select Mode <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-headline">Choose Attempt Mode</DialogTitle>
                  <DialogDescription className="text-base">
                    Select how you want to attempt "{test.title}".
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Button asChild variant="outline" className="h-auto justify-start items-center gap-4 p-5 hover:border-primary hover:bg-primary/5 transition-all group whitespace-normal text-left">
                    <Link href={`/tests/${test.id}?mode=practice`} className="flex w-full">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 shrink-0 self-start">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-bold text-lg leading-none">Practice Mode</span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          See answers and academic rationales immediately after each question.
                        </span>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto justify-start items-center gap-4 p-5 hover:border-primary hover:bg-primary/5 transition-all group whitespace-normal text-left">
                    <Link href={`/tests/${test.id}?mode=test`} className="flex w-full">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 shrink-0 self-start">
                        <PlayCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-bold text-lg leading-none">Test Mode</span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          Timed exam environment. View results and detailed analytics only after final submission.
                        </span>
                      </div>
                    </Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
        </CardFooter>
        </Card>
    );
  }

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
            Mock Tests & PYPs
          </h1>
          <div className="flex gap-2">
            {hasFullAccess && (
              <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                ADMIN ACCESS
              </div>
            )}
            <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 flex items-center gap-1">
              <Crown className="w-3 h-3" /> PRO ACCESS
            </div>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Prepare for the exam day with our premium mock tests and previous year question papers. Choose between Practice or Test mode.
        </p>
      </header>

      <Tabs defaultValue="mock">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="mock">Mock Tests</TabsTrigger>
          <TabsTrigger value="pyp">Previous Year Papers</TabsTrigger>
        </TabsList>
        <TabsContent value="mock">
            {mockTests.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {mockTests.map((test) => <TestCard key={test.id} test={test}/>)}
                 </div>
            ) : (
                <p className="mt-6 text-muted-foreground">No mock tests available yet.</p>
            )}
        </TabsContent>
        <TabsContent value="pyp">
             {pypTests.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {pypTests.map((test) => <TestCard key={test.id} test={test}/>)}
                 </div>
            ) : (
                <p className="mt-6 text-muted-foreground">No previous year papers available yet.</p>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
