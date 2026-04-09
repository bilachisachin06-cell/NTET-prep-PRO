'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Lock, GraduationCap, ArrowRight, BookCopy, LayoutDashboard, MonitorX } from 'lucide-react';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const PROTECTED_PATHS = ['/practice', '/tests'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isSessionInvalid, setIsSessionInvalid] = useState(false);
  const authorizedSessionId = useRef<string | null>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData, isLoading: isDataLoading } = useDoc(userRef);

  // Session enforcement logic
  useEffect(() => {
    // Only enforce session tracking for logged in users NOT on the auth page
    if (userData && user && pathname !== '/auth') {
      const serverSessionId = userData.currentSessionId;
      
      // If we haven't "pinned" a session ID for this tab yet, do it now
      if (!authorizedSessionId.current && serverSessionId) {
        authorizedSessionId.current = serverSessionId;
      } 
      // If we have a pinned ID and the server ID changed, someone else logged in
      else if (authorizedSessionId.current && serverSessionId && serverSessionId !== authorizedSessionId.current) {
        setIsSessionInvalid(true);
        signOut(auth).then(() => {
          toast({
            variant: "destructive",
            title: "Logged Out",
            description: "You have been logged out because a new sign-in was detected on another device."
          });
        });
      }
    }
    
    // Reset session tracking if user logs out normally or via invalidation
    if (!user) {
      authorizedSessionId.current = null;
      setIsSessionInvalid(false);
    }
  }, [userData, user, pathname, auth, toast]);

  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  // Loading state
  if (isUserLoading || (user && isDataLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4 bg-background">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-64 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  // Session Invalid Screen - Never show on auth page to allow re-login
  if (isSessionInvalid && pathname !== '/auth') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-2xl bg-card overflow-hidden">
          <div className="bg-destructive h-2 w-full" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <MonitorX className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-headline font-bold">Active Session Detected</CardTitle>
            <p className="text-muted-foreground mt-2">You were signed out from this device</p>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-foreground/80">
              Your account is currently being used on another device. To protect your subscription and data, we only allow one active session at a time.
            </p>
            <Button asChild className="w-full h-12 text-lg font-bold" variant="default">
              <Link href="/auth">
                Sign In Again <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 border-t bg-muted/20 pt-4 pb-6">
            <p className="text-[10px] text-muted-foreground">Session conflict resolved automatically.</p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If unauthenticated and trying to access protected content
  if (!user && isProtected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-2xl bg-card overflow-hidden">
          <div className="bg-primary h-2 w-full" />
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline font-bold">Account Required</CardTitle>
            <p className="text-muted-foreground mt-2">Please sign up or log in to access full content.</p>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full h-12 text-lg font-bold">
                <Link href="/auth">
                  Login / Sign Up <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/syllabus">
                    <BookCopy className="mr-2 h-4 w-4" /> Syllabus
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 border-t bg-muted/20 pt-4 pb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-600">powered by SUGAM ವಿಜ್ಞಾನ</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <div className="contents">{children}</div>;
}
