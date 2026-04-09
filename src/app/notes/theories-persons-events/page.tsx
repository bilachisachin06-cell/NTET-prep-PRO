'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { TestPaywall } from '@/components/test-paywall';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, ChevronDown, Users, FlaskConical, Box, Wrench, Lightbulb, Zap, Quote } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Section {
  label: string;
  content?: string[];
  prose?: string;
  bloom?: boolean;
  seq?: string[];
  seqColor?: string[];
  stages?: any[];
  compare?: string[][];
  compareHead?: string[];
  trap?: string;
  mem?: string;
  quote?: string;
}

interface DossierCard {
  id: string;
  type: 'person' | 'theory' | 'model' | 'tool' | 'event';
  hy: boolean;
  name: string;
  sub: string;
  icon: any;
  iconClass: string;
  bio?: Record<string, string>;
  what: string;
  sections: Section[];
}

const DOSSIER_DATA: DossierCard[] = [
  {
    id: "bloom", type: "person", hy: true,
    name: "Benjamin S. Bloom", sub: "Educational psychologist · USA · 1913–1999",
    icon: Users, iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    bio: { Born: "1913, Lansford, Pennsylvania, USA", Died: "1999", Field: "Educational Psychology", "Key work": "Taxonomy of Educational Objectives (1956)", Institution: "University of Chicago" },
    what: "Bloom was an American educational psychologist who believed that almost all students can learn to a high level if given enough time and appropriate instruction — a concept he called 'Mastery Learning'. He is best known for creating a hierarchical classification of educational objectives.",
    sections: [
      {
        label: "Why he matters for NTET",
        content: [
          "<b>Created Bloom's Taxonomy (1956)</b> — the most widely used framework for writing learning objectives",
          "Classified learning into <b>3 domains</b>: Cognitive (thinking), Affective (feelings/attitudes), Psychomotor (physical skills)",
          "His taxonomy provides the basis for writing CLOs, PLOs, and test items in CBCS",
          "Mastery Learning concept supports inclusive education — every student CAN learn"
        ]
      },
      { label: "Bloom's Cognitive Domain — 6 Levels", bloom: true },
      {
        label: "Affective Domain (with Krathwohl & Masia, 1964)",
        seq: ["Receiving", "Responding", "Valuing", "Organisation", "Characterization"],
        seqColor: ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-purple-500", "bg-rose-500"]
      },
      {
        label: "Revised Taxonomy",
        content: [
          "Revised by <b>Lorin Anderson</b> (Bloom's former student) in 2001",
          "Changed nouns to <b>action verbs</b> (e.g. Knowledge → Remember, Synthesis → Create)",
          "Moved <b>Synthesis to the top</b> as 'Create' — now the highest cognitive level",
          "Named: <b>'A Taxonomy for Teaching, Learning and Assessment'</b>"
        ]
      },
      { label: "Exam Trap", trap: "The revised taxonomy is by Lorin Anderson, NOT Bloom himself. Bloom created the original 1956 version." }
    ]
  },
  {
    id: "vygotsky", type: "person", hy: true,
    name: "Lev Semyonovich Vygotsky", sub: "Psychologist · Soviet Union · 1896–1934",
    icon: Users, iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    bio: { Born: "1896, Orsha, Russian Empire", Died: "1934 (aged 37)", Field: "Developmental & Educational Psychology", "Key concept": "Zone of Proximal Development (ZPD)", "Key work": "Mind in Society (1978)" },
    what: "Vygotsky was a Soviet psychologist who believed that social interaction is the primary driver of cognitive development. He argued that children learn best through collaboration with more knowledgeable others — and that language plays a central role in shaping thought.",
    sections: [
      {
        label: "Core Ideas",
        content: [
          "<b>Sociocultural Theory</b> — learning is fundamentally social, not individual",
          "<b>Zone of Proximal Development (ZPD)</b> — the gap between what a child can do alone vs. with guidance from a skilled partner",
          "<b>Scaffolding</b> — temporary, adjustable support provided by teacher/peer; removed as the learner gains competence",
          "<b>Interpsychological → Intrapsychological</b> — learning first occurs between people (social), then gets internalised (within the mind)",
          "<b>Private speech (self-talk)</b> — children talking to themselves is a THINKING TOOL, not egocentric behaviour",
          "<b>Language shapes thought</b> — language is not just communication; it is the primary tool of thinking"
        ]
      },
      {
        label: "ZPD Explained Simply",
        prose: "Think of ZPD as the 'learning sweet spot'. If a task is too easy, there is no growth. If too hard, the learner gives up. ZPD is the space in between — challenging enough to grow, manageable with help. The teacher/peer provides scaffolding within this zone."
      },
      {
        label: "Teaching Implications",
        content: [
          "Use <b>collaborative and peer learning</b> — Vygotsky's biggest classroom implication",
          "Provide <b>scaffolding</b> — hints, prompts, worked examples — then gradually remove support",
          "Encourage <b>think-alouds</b> — private speech supports problem-solving",
          "Group students so a more capable peer can support others (peer tutoring)"
        ]
      },
      { label: "Exam Trap", trap: "Direction is ALWAYS Inter → Intra (social first, then internal). PYQs reverse this — 'intrapsychological to interpsychological' is always WRONG. Also: self-speech is NOT egocentric behaviour." }
    ]
  },
  {
    id: "piaget", type: "person", hy: true,
    name: "Jean Piaget", sub: "Psychologist & Epistemologist · Switzerland · 1896–1980",
    icon: Users, iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    bio: { Born: "1896, Neuchâtel, Switzerland", Died: "1980", Field: "Developmental Psychology / Epistemology", "Key theory": "Cognitive Development Theory", "Key concept": "Schema, Assimilation, Accommodation" },
    what: "Piaget was a Swiss psychologist who believed children are not just small adults — they think in fundamentally different ways. He proposed that cognitive development occurs in four universal, fixed stages, each building on the previous one. He also co-developed Schema Theory with Frederic Bartlett.",
    sections: [
      {
        label: "4 Stages of Cognitive Development",
        stages: [
          { n: "1", name: "Sensorimotor", age: "0–2 years", desc: "Learns through senses and movement. Develops object permanence.", cls: "bg-blue-100 dark:bg-blue-900/30 border-blue-200" },
          { n: "2", name: "Preoperational", age: "2–7 years", desc: "Uses symbols/language. Egocentric. Cannot conserve.", cls: "bg-green-100 dark:bg-green-900/30 border-green-200" },
          { n: "3", name: "Concrete Operational", age: "7–11 years", desc: "Logical thinking about concrete objects. Conservation achieved.", cls: "bg-amber-100 dark:bg-amber-900/30 border-amber-200" },
          { n: "4", name: "Formal Operational", age: "12+ years", desc: "Abstract, hypothetical, and deductive reasoning.", cls: "bg-purple-100 dark:bg-purple-900/30 border-purple-200" }
        ]
      },
      {
        label: "Key Concepts",
        content: [
          "<b>Schema</b> — mental framework or blueprint for understanding the world",
          "<b>Assimilation</b> — fitting new information into an existing schema",
          "<b>Accommodation</b> — changing/creating a schema to fit new information",
          "<b>Equilibration</b> — the balance between assimilation and accommodation",
          "Child moves through stages in an <b>established (fixed) pattern</b> — cannot skip stages",
          "Development is driven by the <b>individual child</b> (contrast with Vygotsky — social)",
          "Schema Theory co-associated with <b>Frederic Bartlett</b>"
        ]
      },
      {
        label: "Piaget vs Vygotsky",
        compare: [
          ["Focus", "Individual child", "Social interaction"],
          ["Driver of learning", "Child's own exploration", "Guidance from others"],
          ["Language", "Follows thought", "Shapes thought"],
          ["ZPD concept", "Not present", "Central concept"],
          ["Role of teacher", "Facilitator of discovery", "Active scaffold provider"]
        ],
        compareHead: ["Aspect", "Piaget", "Vygotsky"]
      },
      { label: "Exam Trap", trap: "Age ranges are directly tested: 7–11 = Concrete Operational (NOT Formal). 12+ = Formal Operational. The child moves in an ESTABLISHED pattern — never randomly." }
    ]
  },
  {
    id: "bronfenbrenner", type: "person", hy: true,
    name: "Urie Bronfenbrenner", sub: "Developmental Psychologist · USA · 1917–2005",
    icon: Users, iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    bio: { Born: "1917, Moscow (raised in USA)", Died: "2005", Field: "Developmental Psychology", "Key theory": "Ecological Systems Theory / Bioecological Model" },
    what: "Bronfenbrenner proposed that child development cannot be understood in isolation — it is shaped by multiple nested environmental systems, from the immediate family to the broader cultural and historical context. This is called the Ecological Systems Theory.",
    sections: [
      {
        label: "The 5 Systems (Smallest to Largest)",
        content: [
          "<b>Microsystem</b> — direct, immediate environment (family, school, peers, neighbourhood)",
          "<b>Mesosystem</b> — connections/interactions between microsystems (e.g. how parent-teacher relationship affects child)",
          "<b>Exosystem</b> — environments the child doesn't directly interact with but that affect them (parent's workplace, local government policies)",
          "<b>Macrosystem</b> — broad cultural values, laws, customs, ideologies of society",
          "<b>Chronosystem</b> — the TIME dimension; life transitions and historical events (e.g. growing up before mobile phones = Chronosystem)"
        ]
      },
      {
        label: "Simple Analogy",
        prose: "Think of it like nested Russian dolls. The child is at the centre. Each surrounding layer is a system that affects development — from the family (Micro) outward to culture and time (Chrono)."
      },
      {
        label: "Key Points for NTET",
        content: [
          "Theory is <b>Ecological / Bioecological</b> — NOT structural (this is a direct PYQ option)",
          "Context is very important in student learning",
          "Social contexts are seen as <b>ecosystems</b>",
          "Parenting style influences learning (Macrosystem/Microsystem)",
          "Growing up before mobiles = <b>Chronosystem</b> example (PYQ Q53, 2025)"
        ]
      },
      { label: "Exam Trap", trap: "'Bronfenbrenner's theory is a structural theory of learning' is FALSE — it is ECOLOGICAL. Chronosystem is about TIME, not technology." }
    ]
  },
  {
    id: "knowles", type: "person", hy: true,
    name: "Malcolm Knowles", sub: "Adult Educator · USA · 1913–1997",
    icon: Users, iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    bio: { Born: "1913, Livingston, Montana, USA", Died: "1997", Field: "Adult Education / Andragogy", "Key contribution": "Introduced and popularised the term 'Andragogy' in the USA" },
    what: "Malcolm Knowles is the father of modern Andragogy — the science and art of helping adults learn. He distinguished adult learning from child learning (pedagogy) and identified key characteristics and hypotheses about how adults learn best.",
    sections: [
      {
        label: "Knowles' 6 Assumptions about Adult Learners",
        content: [
          "<b>Self-concept</b> — Adults are self-directed, not dependent on teacher",
          "<b>Experience</b> — Adults bring rich prior experience that is a resource for learning",
          "<b>Readiness to learn</b> — Adults learn when they need to for real-life roles",
          "<b>Orientation to learning</b> — Adults are problem-centred, not subject-centred",
          "<b>Motivation to learn</b> — Adults are internally motivated (not external rewards)",
          "<b>Need to know</b> — Adults need to understand WHY they must learn something before learning it"
        ]
      },
      {
        label: "Knowles' Hypotheses (PYQ Q21, 2025)",
        content: [
          "Adults approach learning through <b>problem-solving</b>",
          "Adults learn things of <b>immediate importance</b>",
          "Adults <b>learn by experience</b>",
          "Adults <b>understand why</b> they must learn",
          "NOT included: 'Adults approach learning as judgmental' — this is the WRONG option in PYQs"
        ]
      },
      {
        label: "Other Key Andragogy Theorists",
        content: [
          "<b>Stephen Lieb</b> — described critical elements of adult learning including <b>motivation and reinforcement</b>",
          "<b>Liegans Paul</b> — described responsibilities of adult trainers: <b>Facilitator and Harmonizer</b>",
          "<b>Hall D.M.</b> — described guidelines for adult trainers",
          "<b>Legans</b> — listed characteristics of adult trainers (respect, engagement, practical application — NOT fear/force)",
          "<b>Alexander Kapp</b> (German) — first coined the term 'Andragogy' in 1833 (Knowles popularised it)"
        ]
      },
      { label: "Exam Trap", trap: "Alexander Kapp coined 'Andragogy' in 1833. Knowles popularised it in the USA. Andragogy is LEARNER-centred, NOT subject-centred. 'Judgmental approach' is never a Knowles hypothesis." }
    ]
  },
  {
    id: "constructivism", type: "theory", hy: true,
    name: "Constructivism", sub: "Learning Theory — Piaget, Vygotsky, Bruner",
    icon: FlaskConical, iconClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    bio: { "Origin": "Late 20th century", "Key thinkers": "Piaget, Vygotsky, Bruner, Dewey", "Approach": "Child/Learner-centred" },
    what: "Constructivism is the theory that learners do not passively receive knowledge — they actively BUILD (construct) their own understanding based on prior experience and social interaction. It underpins most modern educational approaches.",
    sections: [
      {
        label: "Core Principles",
        content: [
          "Learning is an <b>active process</b> — not passive reception",
          "Learners <b>construct new knowledge</b> from existing knowledge (schemas)",
          "Learning is most effective when it is <b>contextual and meaningful</b>",
          "Social interaction plays a crucial role (Vygotsky's version = Social Constructivism)",
          "The teacher is a <b>facilitator/guide</b>, not a transmitter"
        ]
      },
      {
        label: "Types of Constructivism",
        content: [
          "<b>Cognitive Constructivism (Piaget)</b> — individual builds knowledge through experience and maturation",
          "<b>Social Constructivism (Vygotsky)</b> — knowledge is built through social interaction and language",
          "<b>Radical Constructivism</b> — reality is entirely constructed by the knower"
        ]
      },
      {
        label: "In the Classroom",
        content: [
          "Constructivist teaching approach = <b>child-centred pedagogy</b>",
          "<b>Assessment for learning</b> aligns with constructivism — learner builds own understanding",
          "Methods: inquiry-based learning, problem-based learning, collaborative learning, discovery learning",
          "Opposite of 'banking model' (Freire's term for traditional rote teaching)"
        ]
      },
      { label: "Exam Trap", trap: "Constructivist teaching approach = child-centred. Inquiry-based learning = constructivist. 'Assessment for learning' = constructivist perspective (PYQ Q61, 2025)." }
    ]
  },
  {
    id: "behaviourism", type: "theory", hy: true,
    name: "Behaviourism", sub: "Learning Theory — Watson, Pavlov, Skinner, Thorndike",
    icon: FlaskConical, iconClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    bio: { "Origin": "Early 20th century", "Key thinkers": "Pavlov, Watson, Thorndike, Skinner", "Focus": "Observable behaviour, S-R bonds" },
    what: "Behaviourism holds that all learning is a change in observable behaviour, caused by environmental stimuli. Internal mental processes are irrelevant — only what can be observed and measured matters. It was the dominant learning theory from the 1900s to 1950s.",
    sections: [
      {
        label: "Key Theories within Behaviourism",
        content: [
          "<b>Classical Conditioning (Pavlov)</b> — learning by association between stimuli",
          "<b>Trial and Error / Connectionism (Thorndike)</b> — learning through S-R bond formation",
          "<b>Operant Conditioning (Skinner)</b> — learning through reinforcement and punishment of voluntary behaviour",
          "All share the core idea: <b>stimulus → response</b>"
        ]
      },
      {
        label: "Laws of Learning (Thorndike)",
        content: [
          "<b>Law of Readiness</b> — learner must be ready",
          "<b>Law of Exercise</b> — practice strengthens bonds",
          "<b>Law of Effect</b> — satisfying consequences strengthen bonds"
        ]
      },
      {
        label: "Compare — Learning Theory to Technology",
        compare: [
          ["Behaviourism", "Teaching Machine (Skinner)"],
          ["Cognitivism", "ARPANET / PLATO"],
          ["Constructivism", "Interactive Multimedia"],
          ["Connectivism", "MOOC / Social Networking"]
        ],
        compareHead: ["Theory", "Associated Technology"]
      }
    ]
  },
  {
    id: "blooms-taxonomy-full", type: "model", hy: true,
    name: "Bloom's Taxonomy (Full Detail)", sub: "Cognitive, Affective & Psychomotor Domains",
    icon: Box, iconClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    bio: { "Created": "1956 by Bloom et al.", "Revised": "2001 by Lorin Anderson", "Domains": "Cognitive, Affective, Psychomotor" },
    what: "Bloom's Taxonomy is a hierarchical framework for classifying educational objectives across three domains: thinking (cognitive), feelings (affective), and physical skills (psychomotor).",
    sections: [
      {
        label: "Cognitive Domain — Full Level Details",
        content: [
          "<b>1. Remember</b> — Recall, recognise, list, define, name (lowest level)",
          "<b>2. Understand</b> — Explain, classify, summarise, give examples",
          "<b>3. Apply</b> — Use, solve, demonstrate, represent graphically",
          "<b>4. Analyse</b> — Compare, differentiate, examine, break down",
          "<b>5. Evaluate</b> — Judge, justify, critique, argue",
          "<b>6. Create</b> — Design, produce, devise, construct (highest level)"
        ]
      },
      {
        label: "Affective Domain — Level Details",
        content: [
          "<b>1. Receiving</b> — Passive attention, awareness, willingness to hear",
          "<b>2. Responding</b> — Active participation; completes tasks, responds to questions",
          "<b>3. Valuing</b> — Attaches worth/importance to a value or idea",
          "<b>4. Organisation</b> — Prioritises one value over another; begins to build value system",
          "<b>5. Characterization</b> — Values completely internalised; defines the person's character"
        ]
      },
      {
        label: "Psychomotor Domain (Dave 1970) — Level Details",
        content: [
          "<b>1. Imitation</b> — Observes and copies; trial and error",
          "<b>2. Manipulation</b> — Performs from instructions; less dependent on watching",
          "<b>3. Precision</b> — Accurate, smooth, and proportioned performance",
          "<b>4. Articulation</b> — Adapts and combines skills; coordinates multiple tasks",
          "<b>5. Naturalization</b> — Automatic, expert-level; requires little conscious thought"
        ]
      },
      { label: "Exam Trap", trap: "'Application in new situation' = Create/Synthesis level. In the revised taxonomy, CREATE is highest (not Synthesis). Lorin Anderson revised it — NOT Bloom." }
    ]
  },
  {
    id: "5e-model", type: "model", hy: true,
    name: "5-E Instructional Model", sub: "Bybee et al. — Science Education",
    icon: Box, iconClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    bio: { "Developed by": "Roger Bybee & BSCS team", "Context": "Science/Inquiry-based teaching", "Purpose": "Constructivist lesson design" },
    what: "The 5-E model is an inquiry-based instructional design framework. Each phase begins with 'E' — guiding students through a constructivist learning cycle.",
    sections: [
      {
        label: "The 5 Phases in Order",
        seq: ["Engage", "Explore", "Explain", "Elaborate", "Evaluate"],
        seqColor: ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-amber-500", "bg-rose-500"]
      },
      {
        label: "What each phase involves",
        content: [
          "<b>Engage</b> — Hook students' interest; activate prior knowledge; pose a question",
          "<b>Explore</b> — Students investigate; hands-on inquiry; work in groups",
          "<b>Explain</b> — Teacher introduces vocabulary, concepts, and explanations",
          "<b>Elaborate</b> — Students apply concepts to new situations; deepen understanding",
          "<b>Evaluate</b> — Assess student understanding; self-assessment and teacher assessment"
        ]
      },
      { label: "Mnemonic", mem: "Every Explorer Explains Elaborate Events" }
    ]
  },
  {
    id: "swayam", type: "tool", hy: true,
    name: "SWAYAM & MOOCs", sub: "India's National MOOC Platform",
    icon: Wrench, iconClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    bio: { "Full form": "Study Webs of Active Learning for Young Aspiring Minds", "Launched": "2017, Government of India", "Platform": "Free online courses" },
    what: "SWAYAM is India's national MOOC platform. It uses a 4-quadrant approach to deliver content and aims to bridge the digital divide.",
    sections: [
      {
        label: "4-Quadrant Approach (SWAYAM)",
        content: [
          "<b>Quadrant 1</b> — E-Content: Video lectures, animations",
          "<b>Quadrant 2</b> — E-Assessment: Quizzes, assignments with feedback",
          "<b>Quadrant 3</b> — Discussion Forum: Peer and expert interaction",
          "<b>Quadrant 4</b> — Web resources, reference material, case studies"
        ]
      },
      { label: "Exam Trap", trap: "DBMS is NOT a quadrant of SWAYAM. The 4th quadrant is web resources/references." }
    ]
  }
];

export default function TheoriesPersonsEventsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'person' | 'theory' | 'model' | 'tool' | 'event'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userRef);

  const filteredData = useMemo(() => {
    return DOSSIER_DATA.filter(card => {
      const filterMatch = activeFilter === 'all' || card.type === activeFilter;
      const search = searchTerm.toLowerCase();
      const searchMatch = !search || 
        card.name.toLowerCase().includes(search) || 
        card.sub.toLowerCase().includes(search) || 
        card.what.toLowerCase().includes(search);
      return filterMatch && searchMatch;
    });
  }, [activeFilter, searchTerm]);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto py-12 pt-4 md:pt-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full mt-8" />
      </div>
    );
  }

  const hasFullAccess = user?.email === 'bilachisachin06@gmail.com';
  const isPro = hasFullAccess || (userData?.subscriptionStatus === 'pro' && (
    !userData.subscriptionExpiresAt || new Date(userData.subscriptionExpiresAt) > new Date()
  ));

  if (!isPro) {
    return (
      <div className="flex flex-col gap-4 pt-4 md:pt-8">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary">
          <Link href="/notes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Material
          </Link>
        </Button>
        <TestPaywall />
      </div>
    );
  }

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-4 md:pt-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-primary">
        <Link href="/notes">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Material
        </Link>
      </Button>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
          Theories, Persons & Events
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          High-yield dossiers on essential theorists, theories, and pedagogical tools.
        </p>
      </header>

      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur py-4 flex flex-col gap-4 border-b -mx-4 px-4 md:px-0 md:mx-0">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search dossier... (e.g. Piaget, Bloom, ZPD)" 
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['all', 'person', 'theory', 'model', 'tool', 'event'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap uppercase tracking-wider",
                activeFilter === f 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              )}
            >
              {f === 'all' ? 'All' : f + 's'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium text-lg">No matches found in the dossier.</p>
          </div>
        ) : (
          filteredData.map((card) => {
            const isOpen = expandedCards[card.id];
            const Icon = card.icon;

            return (
              <Card key={card.id} className={cn(
                "transition-all duration-300 overflow-hidden",
                isOpen ? "ring-2 ring-primary/20 shadow-lg" : "hover:border-primary/30"
              )}>
                <button 
                  className="w-full text-left p-6 flex items-start gap-4"
                  onClick={() => toggleCard(card.id)}
                >
                  <div className={cn("p-3 rounded-xl shrink-0", card.iconClass)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-xl text-foreground truncate">{card.name}</h3>
                      {card.hy && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 uppercase text-[10px] font-black">
                          High Yield
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium truncate">{card.sub}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="uppercase text-[9px] font-bold tracking-widest">{card.type}</Badge>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0",
                    isOpen && "rotate-180"
                  )} />
                </button>

                {isOpen && (
                  <CardContent className="pt-0 pb-8 px-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="h-px bg-border" />
                    
                    {card.bio && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(card.bio).map(([k, v]) => (
                          <div key={k} className="bg-muted/30 p-3 rounded-lg border border-border/50">
                            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{k}</div>
                            <div className="text-sm font-semibold mt-1">{v}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Overview</h4>
                      <p className="text-lg leading-relaxed text-foreground/90">{card.what}</p>
                    </div>

                    <div className="space-y-8">
                      {card.sections.map((sec, idx) => (
                        <div key={idx} className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{sec.label}</h4>
                          
                          {sec.content && (
                            <ul className="space-y-3 pl-1">
                              {sec.content.map((p, pIdx) => (
                                <li key={pIdx} className="flex gap-3 text-base md:text-lg leading-relaxed">
                                  <span className="text-primary font-bold shrink-0 mt-1.5">•</span>
                                  <span dangerouslySetInnerHTML={{ __html: p }} />
                                </li>
                              ))}
                            </ul>
                          )}

                          {sec.prose && <p className="text-lg italic text-foreground/80 leading-relaxed">{sec.prose}</p>}

                          {sec.stages && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              {sec.stages.map((s, sIdx) => (
                                <div key={sIdx} className={cn("p-4 rounded-xl border-2", s.cls)}>
                                  <div className="text-[10px] font-black uppercase opacity-60">Stage {s.n}</div>
                                  <div className="text-lg font-black my-1">{s.name}</div>
                                  <div className="text-xs font-bold opacity-70 mb-2">{s.age}</div>
                                  <div className="text-sm leading-relaxed">{s.desc}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {sec.bloom && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                              {[
                                { n: 6, name: 'Create', verb: 'Design, Produce, Devise', cls: 'bg-rose-100 dark:bg-rose-900/30 border-rose-200 text-rose-900 dark:text-rose-100' },
                                { n: 5, name: 'Evaluate', verb: 'Judge, Justify, Critique', cls: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 text-purple-900 dark:text-purple-100' },
                                { n: 4, name: 'Analyse', verb: 'Compare, Differentiate, Examine', cls: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 text-amber-900 dark:text-amber-100' },
                                { n: 3, name: 'Apply', verb: 'Use, Solve, Demonstrate', cls: 'bg-green-100 dark:bg-green-900/30 border-green-200 text-green-900 dark:text-green-100' },
                                { n: 2, name: 'Understand', verb: 'Explain, Classify, Summarise', cls: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 text-blue-900 dark:text-blue-100' },
                                { n: 1, name: 'Remember', verb: 'Recall, Recognise, List', cls: 'bg-teal-100 dark:bg-teal-900/30 border-teal-200 text-teal-900 dark:text-teal-100' }
                              ].map((l) => (
                                <div key={l.n} className={cn("p-4 rounded-xl border-2", l.cls)}>
                                  <div className="text-[10px] font-black uppercase opacity-60">Level {l.n}</div>
                                  <div className="text-lg font-black my-1">{l.name}</div>
                                  <div className="text-sm leading-relaxed">{l.verb}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {sec.seq && (
                            <div className="flex flex-wrap items-center gap-3">
                              {sec.seq.map((s, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-3">
                                  {sIdx > 0 && <span className="text-muted-foreground/40 font-bold">→</span>}
                                  <span className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm",
                                    sec.seqColor ? sec.seqColor[sIdx] : "bg-primary"
                                  )}>
                                    {s}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {sec.compare && (
                            <div className="overflow-x-auto rounded-xl border border-border mt-4">
                              <table className="w-full text-sm">
                                <thead className="bg-muted">
                                  <tr>
                                    {sec.compareHead?.map((h, hIdx) => (
                                      <th key={hIdx} className="p-3 text-left font-bold border-b border-border">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {sec.compare.map((row, rIdx) => (
                                    <tr key={rIdx} className="border-b border-border last:border-none">
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className={cn("p-3 align-top", cIdx === 0 && "font-bold bg-muted/20")}>{cell}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {sec.trap && (
                            <div className="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 p-5 rounded-r-xl space-y-2">
                              <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400 font-black text-xs uppercase tracking-widest">
                                <Zap className="w-4 h-4 fill-current" />
                                Exam Trap Alert
                              </div>
                              <p className="text-lg font-medium leading-relaxed italic text-rose-900 dark:text-rose-200">
                                {sec.trap}
                              </p>
                            </div>
                          )}

                          {sec.mem && (
                            <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-5 rounded-r-xl space-y-2">
                              <div className="flex items-center gap-3 text-green-700 dark:text-green-400 font-black text-xs uppercase tracking-widest">
                                <Lightbulb className="w-4 h-4 fill-current" />
                                Mnemonic Shortcut
                              </div>
                              <p className="text-lg font-bold leading-relaxed text-green-900 dark:text-green-200">
                                {sec.mem}
                              </p>
                            </div>
                          )}

                          {sec.quote && (
                            <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-xl space-y-2">
                              <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-widest">
                                <Quote className="w-4 h-4 fill-current" />
                                Academic Quote
                              </div>
                              <p className="text-lg font-medium italic leading-relaxed text-foreground/80">
                                {sec.quote}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
