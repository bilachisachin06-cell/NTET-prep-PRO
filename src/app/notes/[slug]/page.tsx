
'use client';

import { getNoteBySyllabusId, getSyllabusPointById } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Bookmark, Crown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Separator } from '@/components/ui/separator';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { TestPaywall } from '@/components/test-paywall';
import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';
import { useState, useEffect } from 'react';

export default function NoteDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
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

  const note = getNoteBySyllabusId(slug);
  const syllabusPoint = getSyllabusPointById(slug);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-3xl mx-auto py-12 pt-4 md:pt-8">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-96 w-full mt-8" />
      </div>
    );
  }

  if (!note || !syllabusPoint) {
    notFound();
  }

  // The Unit-wise notes (syl-1 to syl-8) are part of the detailed curriculum
  const restrictedIds = ['syl-1', 'syl-2', 'syl-3', 'syl-4', 'syl-5', 'syl-6', 'syl-7', 'syl-8'];
  const isRestricted = restrictedIds.includes(slug);
  
  // Admin/Special access check
  const hasFullAccess = user?.email === 'bilachisachin06@gmail.com';

  const isPro = hasFullAccess || (userData?.subscriptionStatus === 'pro' && (
    !userData.subscriptionExpiresAt || new Date(userData.subscriptionExpiresAt) > new Date()
  ));

  if (isRestricted && !isPro) {
    return (
      <div className="flex flex-col gap-4 pt-4 md:pt-8">
        <header className="flex flex-col gap-2">
          <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
            <Link href="/notes">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Material
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
            {syllabusPoint.title}
          </h1>
          <div className="flex items-center gap-2 text-primary">
            <Crown className="w-4 h-4" />
            <span className="text-sm font-medium">This unit is part of the PRO Study Material</span>
          </div>
        </header>
        <TestPaywall />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 pt-4 md:pt-8">
      <header className="flex flex-col gap-4">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground hover:text-primary">
          <Link href="/notes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Material
          </Link>
        </Button>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Bookmark className="w-3 h-3 fill-current" />
            Unit {slug.split('-')[1]} Notes
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
            {syllabusPoint.title}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl leading-relaxed">
            {syllabusPoint.description}
          </p>
        </div>
      </header>

      <Separator className="my-2" />

      <Card className="border-none shadow-sm overflow-hidden bg-card/50">
        <CardHeader className="bg-primary/5 border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-xl md:text-3xl text-primary">
            <BookOpen className="w-6 h-6" />
            Detailed Unit Content
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-10">
          <div className="max-w-none text-foreground/90 leading-relaxed text-lg md:text-xl space-y-8">
            <ReactMarkdown
              components={{
                h3: ({node, ...props}) => (
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6 border-l-4 border-primary pl-4 py-1" {...props} />
                ),
                strong: ({node, ...props}) => (
                  <strong className="font-bold text-primary" {...props} />
                ),
                p: ({node, ...props}) => (
                  <p className="mb-8 last:mb-0" {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul className="list-none space-y-4 mb-8 pl-2" {...props} />
                ),
                li: ({node, ...props}) => (
                  <li className="flex items-start gap-4" {...props}>
                    <span className="mt-3 w-2 h-2 rounded-full bg-primary/60 shrink-0" />
                    <span className="flex-1">{props.children}</span>
                  </li>
                ),
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 flex justify-center">
        <Button asChild variant="outline" size="lg" className="gap-2 text-lg">
          <Link href="/tests">
            Practice MCQs for this unit <Bookmark className="w-5 h-5" />
          </Link>
        </Button>
      </footer>
    </div>
  );
}
