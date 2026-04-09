import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getSyllabus } from '@/lib/data';
import { Info, ArrowLeft, NotebookText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SyllabusPage() {
  const syllabus = getSyllabus();
  const updates = syllabus.find(item => item.id === 'updates');

  return (
    <div className="flex flex-col gap-8 pt-4 md:pt-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground hover:text-primary">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-fit border-primary/20 text-primary hover:bg-primary/5 text-lg">
            <Link href="/notes">
              <NotebookText className="mr-2 h-5 w-5" /> Go to Study Material
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-headline">
          NTET Syllabus & Information
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl leading-relaxed">
          Here is the detailed information bulletin for the National Teachers
          Eligibility Test. Expand each section to see the details.
        </p>
      </header>

      {updates && updates.subpoints && updates.subpoints.length > 0 && (
         <Alert className="bg-primary/5 border-primary/20 p-6">
          <Info className="h-6 w-6 text-primary" />
          <AlertTitle className="text-primary font-bold text-xl mb-2">{updates.subpoints[0].title}</AlertTitle>
          <AlertDescription className="text-foreground/90 text-lg leading-relaxed">
            {updates.subpoints[0].description}
          </AlertDescription>
        </Alert>
      )}


      <Accordion type="single" collapsible className="w-full space-y-2">
        {syllabus.map((point) => (
          <AccordionItem key={point.id} value={point.id} className="border-2 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="text-xl md:text-2xl font-bold hover:no-underline text-left py-6">
              {point.title}
            </AccordionTrigger>
            <AccordionContent className="text-lg md:text-xl pb-8">
              <p className="text-muted-foreground mb-6 leading-relaxed">{point.description}</p>
              {point.subpoints && point.subpoints.length > 0 && (
                <div className="space-y-8 pl-2 border-l-2 border-primary/10 ml-1">
                  {point.subpoints.map((subpoint) => {
                    const isModule = point.id === 'syllabus-overview';
                    const moduleIdx = isModule ? subpoint.id.split('-')[1] : null;

                    return (
                      <div key={subpoint.id} className="space-y-2">
                        {isModule && moduleIdx ? (
                          <Link 
                            href={`/notes/detailed?m=${moduleIdx}`}
                            className="group block"
                          >
                            <strong className="font-bold text-foreground text-xl flex items-center gap-2 group-hover:text-primary transition-colors">
                              {subpoint.title}
                              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </strong>
                            <span className="text-[10px] uppercase font-black tracking-widest text-primary/60 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to read detailed notes
                            </span>
                          </Link>
                        ) : (
                          <strong className="font-bold text-foreground text-xl block">
                            {subpoint.title}
                          </strong>
                        )}
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {subpoint.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
