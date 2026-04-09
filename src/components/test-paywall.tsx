
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle2, ArrowRight, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const RAZORPAY_KEY = "rzp_live_SVA7BdRQHqm8oK";

const PLANS = [
  {
    id: 'plan_SVAEBaLwTerI1n',
    name: '1 Month Pro',
    price: 299,
    duration: 1,
    description: 'Perfect for quick revision'
  },
  {
    id: 'plan_SV7WbMHRK2oj9I',
    name: '3 Months Pro',
    price: 399,
    duration: 3,
    description: 'Best for comprehensive prep',
    popular: true
  }
];

export function TestPaywall() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Account required",
        description: "Please log in to purchase a plan."
      });
      return;
    }

    if (!(window as any).Razorpay) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Razorpay failed to load. Please check your internet connection and reload the page."
      });
      return;
    }

    setIsProcessing(true);

    const options = {
      key: RAZORPAY_KEY,
      amount: selectedPlan.price * 100,
      currency: "INR",
      name: "NTET Prep Pro",
      description: `Upgrade to ${selectedPlan.name}`,
      handler: function (response: any) {
        const userRef = doc(db, 'users', user.uid);
        const expiryDate = addMonths(new Date(), selectedPlan.duration);
        const updateData = {
          subscriptionStatus: 'pro',
          subscriptionExpiresAt: expiryDate.toISOString(),
          lastTransactionId: response.razorpay_payment_id,
          updatedAt: new Date().toISOString()
        };

        setDoc(userRef, updateData, { merge: true })
          .then(() => {
            toast({
              title: "Upgrade Successful!",
              description: `Welcome to PRO! Access granted until ${expiryDate.toLocaleDateString()}.`,
            });
            // Brief delay to allow Firestore sync before reload
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          })
          .catch(async (serverError) => {
            setIsProcessing(false);
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'update',
              requestResourceData: updateData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      },
      prefill: {
        name: user.displayName || "",
        email: user.email || ""
      },
      theme: {
        color: "#64B5F6"
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Gateway Error",
        description: "Could not open payment window. Please try again."
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto py-8">
      <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Crown className="w-24 h-24 text-primary" />
        </div>
        <div className="bg-primary h-2 w-full" />
        
        <CardHeader className="text-center pt-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold">PRO Preparation Access</CardTitle>
          <p className="text-muted-foreground mt-2">Unlock all premium MCQ units, Full-length Tests & Previous Papers</p>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 gap-4 py-2">
            {[
              "Unlimited access to all Practice MCQ Units",
              "Access to all Full-Length Mock Tests",
              "Exclusive Previous Year Question Papers",
              "Detailed Performance Analytics & Insights",
              "Priority updates for upcoming examinations",
              "Ad-free focused learning experience"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground/90 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                disabled={isProcessing}
                className={cn(
                  "relative p-6 rounded-xl border-2 transition-all text-left",
                  selectedPlan.id === plan.id 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                    Best Value
                  </span>
                )}
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{plan.name}</h4>
                    <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-xs text-muted-foreground">one-time</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8">
          <Button 
            size="lg" 
            className="w-full h-14 text-xl font-bold gap-2 shadow-lg hover:scale-[1.02] transition-transform"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="animate-spin w-6 h-6" /> : (
              <>Upgrade to Pro Now <ArrowRight className="w-6 h-6" /></>
            )}
          </Button>
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-muted/30 rounded-lg border border-border/50">
            <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] text-center text-muted-foreground leading-tight">
              Payments are secured by Razorpay. Your PRO access will be activated instantly on this account.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
