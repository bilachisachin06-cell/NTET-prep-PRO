import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ArrowLeft, Lock, Database, EyeOff, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-12 pt-4 md:pt-8">
      <header className="flex flex-col gap-2">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">
          Last Updated: March 2024
        </p>
      </header>

      <Card className="border-none shadow-sm bg-muted/30">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Our Commitment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">
            NTET Prep Pro is built with a "Privacy First" approach. We believe that your focus should be entirely on your preparation without worrying about your data security. This platform does not sell, trade, or misuse your information.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-primary" />
              Data Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We do not collect sensitive personal identification information. Your account is used solely to provide personalized progress tracking and save your test performance.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Data Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Your Mock Test scores and practice progress are securely stored. This data is used only to provide you with performance analytics and historical progress reports.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Content Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            To maintain the academic integrity of our curated notes and question banks, we employ technical measures to prevent unauthorized copying and distribution of our proprietary content.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We use industry-standard encryption and secure authentication via Firebase to ensure your account and progress data remain protected.
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4 pt-4 border-t mt-4">
        <h2 className="text-2xl font-bold font-headline">Contact Us</h2>
        <p className="text-muted-foreground">
          If you have any questions regarding this Privacy Policy or the handling of data within NTET Prep Pro, please reach out to us at <a href="mailto:sugamayurveda45@gmail.com" className="text-primary hover:underline inline-flex items-center gap-1"><Mail className="w-3 h-3" /> sugamayurveda45@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}
