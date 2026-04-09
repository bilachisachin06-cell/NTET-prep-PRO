import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookCopy,
  NotebookText,
  ClipboardCheck,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DailyDose } from '@/components/daily-dose';

const features = [
  {
    title: 'Syllabus',
    description: 'Explore the complete NTET syllabus and exam structure.',
    href: '/syllabus',
    icon: <BookCopy className="w-8 h-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'syllabus-card'),
  },
  {
    title: 'Study Material',
    description: 'Access detailed high-yield notes and theoretical dossiers.',
    href: '/notes',
    icon: <NotebookText className="w-8 h-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'notes-card'),
  },
  {
    title: 'Smart Practice',
    description: 'Active recall tools: Flashcards, Sequence Master, and Trap Library.',
    href: '/smart-practice',
    icon: <Zap className="w-8 h-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'practice-card'),
  },
  {
    title: 'Mock Tests & PYPs',
    description: 'Prepare with full-length exams in Practice or Test mode.',
    href: '/tests',
    icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'tests-card'),
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pt-4 md:pt-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
          Welcome to NTET Prep Pro
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Your all-in-one platform to ace the National Teachers Eligibility Test.
          Start your high-yield preparation journey today!
        </p>
      </header>

      <DailyDose />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50"
          >
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">{feature.icon}</div>
              <div className="flex-1">
                <CardTitle className="text-xl font-headline">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm font-medium">{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {feature.image && (
                <div className="relative aspect-video w-full mb-4 rounded-lg overflow-hidden border">
                  <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={feature.image.imageHint}
                  />
                </div>
              )}
              <Button asChild className="w-full text-lg h-12 font-bold" variant="outline">
                <Link href={feature.href}>
                  Go to {feature.title} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
