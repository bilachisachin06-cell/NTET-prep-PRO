import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, Target, User, Sparkles, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-12 pt-4 md:pt-8">
      <header className="flex flex-col gap-6 items-center text-center md:items-start md:text-left md:flex-row md:gap-8">
        <div className="flex flex-col gap-4 w-full">
          <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="p-6 bg-primary/10 rounded-2xl shadow-sm border border-primary/5">
              <User className="w-16 h-16 text-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
                Dr. Sachin G. Bilachi
              </h1>
              <p className="text-xl font-medium text-primary">
                Ayurveda Physician | Assistant Professor
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full w-fit mx-auto md:mx-0">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Creator of NTET Prep Pro</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed text-foreground/90">
            Dr. Sachin G. Bilachi is an Ayurveda physician and academician dedicated to supporting students preparing for teaching and eligibility examinations. NTET Prep Pro was created with the aim of providing simple, focused, and accessible preparation resources for NTET aspirants.
          </p>
          <p className="text-lg leading-relaxed text-foreground/90 mt-4">
            With experience in academic teaching and student mentoring, the platform reflects a commitment to helping learners practice key concepts, revise efficiently, and build confidence for competitive examinations.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 border-b bg-muted/10 pb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Academic Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-tight mb-1">Schooling</h4>
              <p className="text-foreground font-medium">JAWAHAR NAVODAYA VIDYALAYA, HAVERI</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-tight mb-1">Undergraduate (BAMS)</h4>
              <p className="text-foreground font-medium">Ayurveda Mahavidyalaya Hubli</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-tight mb-1">Postgraduate (MD Ayurveda)</h4>
              <p className="text-foreground font-medium">SDM College of Ayurveda Hassan</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 border-b bg-muted/10 pb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <h4 className="text-sm font-bold text-primary uppercase tracking-tight mb-2">Support Email</h4>
            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
              <a href="mailto:sugamayurveda45@gmail.com" className="text-foreground font-semibold leading-snug text-lg hover:text-primary transition-colors truncate block">
                sugamayurveda45@gmail.com
              </a>
            </div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-tight mb-2 mt-4">Professional Affiliation</h4>
            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
              <p className="text-foreground font-semibold leading-snug">
                Assistant Professor at Sri Vijay Mahantesh Ayurvedic Medical College Ilkal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Target className="w-32 h-32" />
        </div>
        <CardHeader className="flex flex-row items-center gap-3">
          <Target className="w-6 h-6" />
          <CardTitle className="text-xl">Vision</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl md:text-2xl font-medium leading-relaxed italic opacity-95">
            "To create accessible learning tools that help aspiring teachers and academicians prepare effectively for competitive examinations."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
