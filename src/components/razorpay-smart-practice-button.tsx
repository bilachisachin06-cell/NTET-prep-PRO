'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Crown, Zap, CheckCircle2, ShieldCheck, Wallet } from 'lucide-react';

export function RazorpaySmartPracticeButton() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current && !formRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.setAttribute('data-payment_button_id', 'pl_SaDtsZ3c2xZwYz');
      script.async = true;
      formRef.current.appendChild(script);
    }
  }, []);

  return (
    <Card className="max-w-2xl mx-auto border-2 border-primary/20 shadow-2xl overflow-hidden relative mt-4">
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <Zap className="w-24 h-24 text-primary" />
      </div>
      <div className="bg-primary h-2 w-full" />
      
      <CardHeader className="text-center pt-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline font-bold text-foreground">Unlock Smart Practice</CardTitle>
        <p className="text-muted-foreground mt-2">One-time payment for lifetime access to active recall tools</p>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "100+ High-Yield Flashcards",
            "22 Master Sequences",
            "50+ Common Exam Traps",
            "8 Unit-wise Mini Tests",
            "Independent of Pro Subscription",
            "Lifetime Practice Access"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground/80">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-2xl border-2 border-dashed border-primary/20">
          <div className="flex flex-col items-center gap-1 mb-6">
            <span className="text-4xl font-black text-foreground">₹99</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Single Payment</span>
          </div>
          
          <div className="flex items-center gap-2 mb-6 text-primary font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Secure Payment Gateway
          </div>
          
          <form ref={formRef} className="min-h-[50px]"></form>
          
          <p className="mt-6 text-[10px] text-muted-foreground text-center italic max-w-sm">
            Note: This purchase is separate from the general PRO subscription. Access is granted to this specific account.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/20 border-t py-4 justify-center">
        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
          Powered by Razorpay & Sugam ವಿಜ್ಞಾನ
        </p>
      </CardFooter>
    </Card>
  );
}
