
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Trophy, Clock, Target, History, ArrowLeft, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTestById } from '@/lib/data';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ProgressPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sessionsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'users', user.uid, 'testSessions'),
      orderBy('completedAt', 'desc')
    );
  }, [db, user?.uid]);

  const { data: sessions, isLoading } = useCollection(sessionsQuery);

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col gap-8 py-8 pt-4 md:pt-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-6 pt-4 md:pt-8">
        <div className="p-6 bg-muted rounded-full">
          <BarChart3 className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold font-headline">No Data Yet</h2>
          <p className="text-muted-foreground">
            Complete a Mock Test or Previous Year Paper to start tracking your performance analytics.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/tests">Go to Tests</Link>
        </Button>
      </div>
    );
  }

  // Calculate Stats with safety checks
  const totalTests = sessions.length;
  const avgScore = totalTests > 0 
    ? (sessions.reduce((acc, curr) => acc + (curr.score / (curr.totalQuestions || 1)), 0) / totalTests) 
    : 0;
  const bestScore = Math.max(...sessions.map(s => (s.score / (s.totalQuestions || 1))));
  const totalTime = sessions.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0);

  // Prepare chart data (reverse to chronological order)
  const chartData = [...sessions].reverse().map(s => ({
    name: getTestById(s.testId)?.title || 'Test',
    score: Math.round((s.score / (s.totalQuestions || 1)) * 100),
    date: format(new Date(s.completedAt), 'MMM dd')
  }));

  return (
    <div className="flex flex-col gap-8 pb-12 pt-4 md:pt-8">
      <header className="flex flex-col gap-2">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
          My Learning Progress
        </h1>
        <p className="text-muted-foreground">
          Track your performance across Mock Tests and Previous Year Papers.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-wider text-primary">Average Score</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              {Math.round(avgScore * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={avgScore * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-accent/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-wider text-accent">Highest Score</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-accent" />
              {Math.round(bestScore * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Personal best across {totalTests} attempts</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Study Time</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-muted-foreground" />
              {Math.floor(totalTime / 60)}m
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total time spent in active exam sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-headline">
              <TrendingUp className="w-5 h-5 text-primary" />
              Performance Trend
            </CardTitle>
            <CardDescription>Visualizing your improvement over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12}} unit="%" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value}%`, 'Score']}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "white" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-headline">
              <History className="w-5 h-5 text-primary" />
              Recent Attempts
            </CardTitle>
            <CardDescription>A summary of your latest exam sessions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2">
            {sessions.slice(0, 5).map((session) => {
              const test = getTestById(session.testId);
              const percentage = Math.round((session.score / (session.totalQuestions || 1)) * 100);
              return (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold truncate max-w-[180px]">{test?.title || 'Unknown Test'}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                      {format(new Date(session.completedAt), 'MMM dd, yyyy • HH:mm')}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      "text-sm font-bold",
                      percentage >= 50 ? "text-green-600" : "text-destructive"
                    )}>
                      {percentage}%
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase">
                      {percentage >= 50 ? (
                        <><CheckCircle2 className="w-2.5 h-2.5" /> Qualified</>
                      ) : 'Attempted'}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
