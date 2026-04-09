import { Heart, Coffee, Rocket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SupportCard() {
  return (
    <Card className="bg-primary text-primary-foreground overflow-hidden relative border-none shadow-xl mt-8">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Heart className="w-32 h-32" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Heart className="w-6 h-6 fill-current" />
          Support NTET Prep Pro
        </CardTitle>
        <CardDescription className="text-primary-foreground/90 text-lg leading-relaxed max-w-3xl">
          This app is completely free for all NTET aspirants. If it helped your preparation, consider supporting development.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Button asChild variant="secondary" size="lg" className="font-bold gap-2 shadow-sm hover:scale-105 transition-transform">
          <a href="https://razorpay.me/@NTETprepPRO" target="_blank" rel="noopener noreferrer">
            <Coffee className="w-4 h-4" />
            Keep App Free (₹49)
          </a>
        </Button>
        <Button asChild variant="secondary" size="lg" className="font-bold gap-2 shadow-sm hover:scale-105 transition-transform">
          <a href="https://razorpay.me/@NTETprepPRO" target="_blank" rel="noopener noreferrer">
            <Rocket className="w-4 h-4" />
            Support Dev (₹99)
          </a>
        </Button>
        <Button asChild variant="secondary" size="lg" className="font-bold gap-2 shadow-sm hover:scale-105 transition-transform">
          <a href="https://razorpay.me/@NTETprepPRO" target="_blank" rel="noopener noreferrer">
            <Heart className="w-4 h-4 fill-current" />
            Help Updates (₹199)
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
