'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, Mail, Lock, User, Loader2, Sparkles, ArrowRight, ArrowLeft, Info, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'auth' | 'forgot-password'>('auth');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user && view === 'auth') {
      router.replace('/');
    }
  }, [user, router, view]);

  if (user && view === 'auth') {
    return null;
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Recovery email sent",
        description: "If an account exists for this email, you will receive a reset link shortly.",
      });
      setView('auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Recovery failed",
        description: error.message || "Could not process your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>, type: 'login' | 'signup') => {
    e.preventDefault();
    
    if (type === 'signup' && !agreedToTerms) {
      toast({
        variant: "destructive",
        title: "Agreement Required",
        description: "Please agree to the Terms and Privacy Policy to continue.",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      if (type === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        const userRef = doc(db, 'users', userCredential.user.uid);
        const userData = {
          email,
          fullName: name,
          subscriptionStatus: 'free',
          createdAt: new Date().toISOString(),
          currentSessionId: sessionId
        };

        setDoc(userRef, userData).catch(async (err) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userData
          }));
        });

        toast({ title: "Account created!", description: `Welcome to NTET Prep Pro, ${name}.` });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        const userRef = doc(db, 'users', userCredential.user.uid);
        const updateData = { currentSessionId: sessionId };

        setDoc(userRef, updateData, { merge: true }).catch(async (err) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: updateData
          }));
        });

        toast({ title: "Welcome back!", description: "You have successfully logged in." });
      }
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please verify your email and password. Note: Your email is used as your username.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.15),transparent),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.1),transparent)] p-4 md:p-8">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="p-5 bg-primary/15 rounded-3xl border-2 border-primary/20 shadow-lg relative overflow-hidden group">
            <GraduationCap className="w-14 h-14 text-primary relative z-10 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              NTET Prep Pro
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/5 rounded-full border border-red-500/10 shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-600">powered by SUGAM ವಿಜ್ಞಾನ</span>
            </div>
          </div>
        </header>

        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-sm overflow-hidden ring-1 ring-border/50">
          {view === 'auth' ? (
            <>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-none h-14 bg-muted/30">
                  <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:shadow-none font-bold text-base transition-all">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:shadow-none font-bold text-base transition-all">Sign Up</TabsTrigger>
                </TabsList>
                
                <CardContent className="pt-8 px-8">
                  <TabsContent value="login">
                    <form onSubmit={(e) => handleAuth(e, 'login')} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email-login" className="font-bold text-muted-foreground ml-1">Email / Username</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                          <Input id="email-login" name="email" type="email" placeholder="name@example.com" className="pl-10 h-12 bg-muted/20 border-2 focus:border-primary transition-all" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                          <Label htmlFor="password-login" className="font-bold text-muted-foreground">Password</Label>
                          <button 
                            type="button" 
                            onClick={() => setView('forgot-password')}
                            className="text-xs text-primary hover:underline font-bold"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                          <Input id="password-login" name="password" type="password" placeholder="••••••••" className="pl-10 h-12 bg-muted/20 border-2 focus:border-primary transition-all" required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-12 text-lg font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In to Dashboard"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={(e) => handleAuth(e, 'signup')} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name-signup" className="font-bold text-muted-foreground ml-1">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                          <Input id="name-signup" name="name" type="text" placeholder="John Doe" className="pl-10 h-12 bg-muted/20 border-2 focus:border-primary transition-all" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-signup" className="font-bold text-muted-foreground ml-1">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                          <Input id="email-signup" name="email" type="email" placeholder="name@example.com" className="pl-10 h-12 bg-muted/20 border-2 focus:border-primary transition-all" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-signup" className="font-bold text-muted-foreground ml-1">Create Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                          <Input id="password-signup" name="password" type="password" placeholder="••••••••" className="pl-10 h-12 bg-muted/20 border-2 focus:border-primary transition-all" required />
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 pt-2">
                        <Checkbox 
                          id="terms" 
                          checked={agreedToTerms} 
                          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} 
                          className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms"
                            className="text-xs font-semibold text-muted-foreground leading-snug cursor-pointer"
                          >
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:underline underline-offset-2" target="_blank">
                              Terms and Conditions
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:underline underline-offset-2" target="_blank">
                              Privacy Policy
                            </Link>.
                          </label>
                        </div>
                      </div>

                      <Button type="submit" className="w-full h-12 text-lg font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95" disabled={isLoading || !agreedToTerms}>
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Pro Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </CardContent>
              </Tabs>
              
              <div className="px-8 pb-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 py-1 rounded-full border text-[10px] font-black text-muted-foreground tracking-widest">or access</span>
                  </div>
                </div>
              </div>

              <CardFooter className="flex flex-col space-y-5 pb-8 pt-4 px-8">
                <Button asChild variant="ghost" className="w-full h-12 text-primary font-bold hover:bg-primary/5 group" disabled={isLoading}>
                  <Link href="/">
                    Continue as Guest <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <div className="flex items-start gap-3 bg-muted/40 p-4 rounded-2xl border border-border/50 group">
                  <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                    Access high-yield NTET notes and mock tests instantly. Your privacy is secured with industry-standard encryption.
                  </p>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="p-8 space-y-6">
              <div className="space-y-2 text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-black">Account Recovery</CardTitle>
                <CardDescription className="text-sm font-medium">
                  Enter your email address and we'll send you a secure link to reset your password.
                </CardDescription>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email-reset" className="font-bold text-muted-foreground ml-1">Registered Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                    <Input id="email-reset" name="email" type="email" placeholder="name@example.com" className="pl-10 h-12 bg-muted/20 border-2" required />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-lg font-black shadow-lg" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Reset Link"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full h-12 text-muted-foreground font-bold"
                  onClick={() => setView('auth')}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Button>
              </form>
            </div>
          )}
        </Card>

        <footer className="text-center space-y-4 pt-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-50">
            © 2024 NTET Prep Pro · Secure Environment
          </p>
        </footer>
      </div>
    </div>
  );
}
