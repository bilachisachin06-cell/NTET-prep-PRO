import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, NotebookTabs, ClipboardList, GraduationCap, Target, ShieldCheck, Heart, Users, Landmark, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const pillars = [
    {
      title: 'Syllabus-Wise Practice MCQs',
      description: 'Targeted question banks organized by specific subject domains, allowing for granular study and mastery of individual topics.',
      icon: <ClipboardList className="w-6 h-6 text-primary" />,
    },
    {
      title: 'High-Yield Short Notes',
      description: 'Expertly curated summaries designed for rapid revision, focusing on the most critical concepts and frequently tested data points.',
      icon: <NotebookTabs className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Previous Year Papers (PYP)',
      description: 'Direct access to historical exam questions to help candidates understand paper patterns, weightage, and time-management demands.',
      icon: <BookOpen className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Full-Length Mock Tests',
      description: 'A simulated examination environment that provides real-time analytics, helping users identify knowledge gaps before the actual test day.',
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    },
  ];

  const contributors = [
    'Dr. Shilpa C. Mathapati',
    'Dr. M. C. Hiremath',
    'Dr. Nidhi',
    'Hareesh N. H.',
    'Akarsh J. K.',
    'Prasanna V. C.',
    'Divya Betadur',
    'Dr. M. V. Kouthal',
    'Dr. Sanjay',
    'Dr. Prashanth G. K.',
    'Naveen H.',
    'Dr. Vinod J. B.',
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12 pt-4 md:pt-8">
      <header className="flex flex-col gap-2">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline text-center md:text-left">
          About NTET Prep Pro
        </h1>
        <p className="text-muted-foreground text-lg text-center md:text-left">
          Your specialized digital ecosystem for NTET preparation.
        </p>
      </header>

      <Card className="border-none shadow-sm bg-muted/30">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">The Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-foreground/90">
            NTET Prep Pro is a specialized digital ecosystem built to bridge the gap between Ayush expertise and professional teaching certification. Designed for aspirants of the National Teachers Eligibility Test (NTET), the platform provides a structured, high-yield environment for rigorous exam preparation.
          </p>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            Our Academic Pillars
          </h2>
          <p className="text-muted-foreground">
            Built around four core preparation modules for comprehensive mastery.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="transition-all hover:shadow-md hover:border-primary/30 group">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {pillar.icon}
                </div>
                <CardTitle className="text-lg leading-tight">{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Target className="w-32 h-32" />
        </div>
        <CardHeader className="flex flex-row items-center gap-3">
          <GraduationCap className="w-8 h-8" />
          <CardTitle className="text-2xl font-headline">Our Vision</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl md:text-2xl font-medium leading-relaxed italic opacity-95">
            "We believe that the future of education depends on the caliber of its faculty. NTET Prep Pro is committed to elevating these standards by providing modern, data-driven tools that empower the next generation of academic leaders."
          </p>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-8 pt-8 border-t mt-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            Dedications & Acknowledgments
          </h2>
          <p className="text-muted-foreground">
            Honoring the support and contributions that made this platform possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-primary shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center gap-3">
              <Heart className="w-5 h-5 text-primary fill-primary/20" />
              <CardTitle className="text-xl font-headline">Dedications</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-foreground/90 leading-relaxed italic">
                "This project is dedicated to my parents, whose unwavering support, guidance, and blessings have been the foundation of my journey and the inspiration behind this endeavor."
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center gap-3">
              <Landmark className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl font-headline">Special Acknowledgments</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-foreground/90 leading-relaxed">
                We extend our heartfelt gratitude to the management and all the staff of Sri Vijay Mahantesh Ayurvedic Medical College, Ilkal. Your constant encouragement and professional environment have provided the necessary impetus to bring this vision to life.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 border-b bg-muted/10 pb-4">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-headline">Our Contributors</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6">
              We offer our deepest thanks to the following individuals for their invaluable contributions to the growth and excellence of this platform:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-4">
              {contributors.map((name) => (
                <div key={name} className="flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:scale-125 transition-transform" />
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors">{name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col items-center gap-4 pt-8 border-t mt-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          Get in Touch
        </h2>
        <p className="text-muted-foreground max-w-lg">
          For technical support, feedback, or inquiries regarding our study material, please contact us.
        </p>
        <Button asChild variant="outline" className="gap-2 h-12 px-6 font-bold">
          <a href="mailto:sugamayurveda45@gmail.com">
            <Mail className="w-5 h-5 text-primary" /> sugamayurveda45@gmail.com
          </a>
        </Button>
      </section>
    </div>
  );
}
