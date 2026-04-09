'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Search, 
  ChevronDown, 
  Users, 
  FlaskConical, 
  Layers, 
  Wrench, 
  Lightbulb, 
  Zap, 
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { TestPaywall } from '@/components/test-paywall';
import { Skeleton } from '@/components/ui/skeleton';

type CardType = 'person' | 'theory' | 'model' | 'tool' | 'concept';

interface DossierItem {
  id: string;
  type: CardType;
  tag: 'High Yield' | 'Key Topic';
  title: string;
  subtitle: string;
  description: string;
  bio?: Record<string, string>;
  overview: string;
  points: string[];
  examTrap?: string;
  mnemonic?: string;
  sequence?: string[];
  tables?: {
    headers: string[];
    rows: string[][];
  }[];
}

const DOSSIER_DATA: DossierItem[] = [
  // SECTION 1 — PERSONS (14 cards)
  {
    id: "bloom", type: "person", tag: "High Yield", title: "Benjamin S. Bloom", subtitle: "Educational psychologist · USA · 1913–1999",
    description: "Creator of the most widely used framework for writing learning objectives and proposed Mastery Learning.",
    bio: { Born: "1913 USA", Died: "1999", Institution: "University of Chicago" },
    overview: "Bloom believed almost all students can learn to a high level if given enough time and appropriate instruction.",
    points: [
      "Created Bloom's Taxonomy (1956) — 3 domains: Cognitive, Affective, Psychomotor",
      "Proposed Mastery Learning — all students can learn to high level with enough time",
      "Revised by Lorin Anderson (2001) — renamed 'A Taxonomy for Teaching, Learning and Assessment' — changed nouns to verbs, moved Synthesis to CREATE at top"
    ],
    sequence: ["Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"],
    examTrap: "Anderson revised it, NOT Bloom. Create is now highest. Recall = Remember level. Application in new situation = Create/Synthesis level.",
  },
  {
    id: "vygotsky", type: "person", tag: "High Yield", title: "Lev Vygotsky", subtitle: "Psychologist · Soviet Union · 1896–1934",
    description: "Believed social interaction is the primary driver of cognitive development.",
    bio: { Born: "1896 Soviet Union", Died: "1934 aged 37", Field: "Developmental Psychology" },
    overview: "Vygotsky believed social interaction is the PRIMARY driver of cognitive development.",
    points: [
      "Sociocultural Theory — learning is fundamentally social, not individual",
      "Zone of Proximal Development (ZPD) — gap between what learner can do alone vs. with guidance",
      "Scaffolding — temporary adjustable support within ZPD, removed as learner grows",
      "Direction is ALWAYS Interpsychological → Intrapsychological (social first, then internal)",
      "Private speech = thinking tool, NOT egocentric behaviour",
      "Language shapes thought — primary tool of thinking"
    ],
    examTrap: "Direction is ALWAYS Inter → Intra. 'Intra to inter' is always WRONG. Self-speech is NOT egocentric.",
  },
  {
    id: "piaget", type: "person", tag: "High Yield", title: "Jean Piaget", subtitle: "Psychologist · Switzerland · 1896–1980",
    description: "Proposed 4 universal, fixed stages of cognitive development and the concept of schemas.",
    bio: { Born: "1896 Switzerland", Died: "1980", Field: "Developmental Psychology" },
    overview: "Piaget believed children are not just small adults — they think in fundamentally different ways.",
    points: [
      "4 stages in fixed established order — cannot skip stages",
      "Sensorimotor (0–2): senses and movement, object permanence",
      "Preoperational (2–7): symbolic/language use, egocentric, cannot conserve",
      "Concrete Operational (7–11): logical thinking about concrete objects, conservation achieved",
      "Formal Operational (12+): abstract, hypothetical, deductive reasoning"
    ],
    tables: [
      {
        headers: ["Concept", "Definition"],
        rows: [
          ["Schema", "Mental framework for understanding world"],
          ["Assimilation", "Fit new info into existing schema"],
          ["Accommodation", "Change schema to fit new info"],
          ["Equilibration", "Balance between assimilation and accommodation"]
        ]
      }
    ],
    examTrap: "7–11 = Concrete Operational NOT Formal. 12+ = Formal Operational. Stages are in FIXED order.",
  },
  {
    id: "bronfenbrenner", type: "person", tag: "High Yield", title: "Urie Bronfenbrenner", subtitle: "Developmental Psychologist · USA · 1917–2005",
    description: "Proposed the Ecological Systems Theory, explaining how environment affects development.",
    bio: { Born: "1917 Moscow", Died: "2005", Origin: "Raised USA" },
    overview: "Ecological Systems Theory — development shaped by nested environmental systems.",
    points: [
      "Microsystem: direct environment (family, school, peers)",
      "Mesosystem: connections between microsystems (parent-teacher relationship)",
      "Exosystem: indirect environment (parent's workplace)",
      "Macrosystem: broad cultural values, laws, customs",
      "Chronosystem: TIME dimension — life transitions and historical events"
    ],
    examTrap: "Theory is ECOLOGICAL not structural. 'Structural theory of learning' is FALSE. Chronosystem = TIME not technology.",
  },
  {
    id: "knowles", type: "person", tag: "High Yield", title: "Malcolm Knowles", subtitle: "Adult Educator · USA · 1913–1997",
    description: "Father of modern Andragogy. Defined the specific ways adults learn differently from children.",
    bio: { Born: "1913 USA", Died: "1997", Contribution: "Father of Andragogy" },
    overview: "Alexander Kapp first coined 'Andragogy' in 1833; Knowles popularised it.",
    points: [
      "6 Assumptions: Self-concept (self-directed), Experience (rich resource), Readiness (real-life roles), Orientation (problem-centered), Motivation (internal), Need to know (understand WHY)",
      "Knowles' Hypotheses: problem-solving, immediate importance, learning by experience, understanding why — NOT 'judgmental approach'",
      "Stephen Lieb → critical elements: motivation and reinforcement",
      "Liegans Paul → responsibilities: Facilitator and Harmonizer",
      "Hall D.M. → guidelines for adult trainers",
      "Legans → characteristics: respect, engagement, practical application — NOT fear/force"
    ],
    examTrap: "Kapp coined 'Andragogy', Knowles popularised it. Andragogy = LEARNER-centered NOT subject-centered. 'Judgmental approach' is never a Knowles hypothesis.",
  },
  {
    id: "gardner", type: "person", tag: "Key Topic", title: "Howard Gardner", subtitle: "Psychologist · USA · 1943–present",
    description: "Challenged the single-IQ concept with his Theory of Multiple Intelligences.",
    bio: { Born: "1943 USA", Institution: "Harvard University" },
    overview: "Theory of Multiple Intelligences (1983) — intelligence is NOT a single fixed ability.",
    points: [
      "8 intelligences: Linguistic, Logical-Mathematical, Spatial, Musical, Bodily-Kinesthetic, Interpersonal, Intrapersonal, Naturalist",
      "Native intelligences tested in PYQ: Interpersonal and Naturalist",
      "Conversational proficiency, Innovative, Pragmatic are NOT Gardner's intelligences"
    ],
    examTrap: "PYQ answer = Interpersonal and Naturalist. Conversational proficiency and Innovative are distractors.",
  },
  {
    id: "thorndike", type: "person", tag: "High Yield", title: "Edward L. Thorndike", subtitle: "Psychologist · USA · 1874–1949",
    description: "Pioneer of Connectionism and Trial and Error learning.",
    bio: { Born: "1874 USA", Died: "1949", Theory: "Connectionism" },
    overview: "Studied cats escaping puzzle boxes.",
    points: [
      "Theory name: CONNECTIONISM (also called Trial and Error Learning)",
      "Law of Readiness — learner must be mentally ready",
      "Law of Exercise — practice strengthens connections",
      "Law of Effect — satisfying consequences strengthen bonds; discomfort weakens them (basis of reinforcement)"
    ],
    examTrap: "Thorndike = Connectionism. Classical Conditioning = Pavlov. Operant Conditioning = Skinner. Experiential Learning = Carl Rogers. Do NOT confuse these four.",
  },
  {
    id: "pavlov", type: "person", tag: "High Yield", title: "Ivan Pavlov", subtitle: "Physiologist · Russia · 1849–1936",
    description: "Discovered Classical Conditioning. Nobel Prize winner in 1904.",
    bio: { Born: "1849 Russia", Died: "1936", Award: "Nobel Prize 1904" },
    overview: "Classical Conditioning — learning by association.",
    points: [
      "UCS (food) → UCR (salivation) | CS (bell) → CR (salivation to bell alone)",
      "Foundation of behaviourist learning theory"
    ],
    examTrap: "Classical Conditioning = Pavlov ONLY. Do not assign to Skinner or Thorndike.",
  },
  {
    id: "skinner", type: "person", tag: "High Yield", title: "B.F. Skinner", subtitle: "Psychologist · USA · 1904–1990",
    description: "Developed Operant Conditioning and invented the Teaching Machine.",
    bio: { Born: "1904 USA", Died: "1990", Contribution: "Teaching Machine" },
    overview: "Operant Conditioning — behaviour shaped by consequences.",
    points: [
      "Positive Reinforcement: add reward to increase behaviour",
      "Negative Reinforcement: remove unpleasant stimulus to increase behaviour",
      "Punishment: decrease behaviour through consequences",
      "Invented Teaching Machine — forerunner of modern e-learning",
      "Programmed Instruction sequence: Initial Behavior → Small Steps → Active Participation → Immediate Feedback → Terminal Behavior"
    ],
    examTrap: "Operant = Skinner. Classical = Pavlov. Skinner invented the teaching machine AND programmed instruction.",
  },
  {
    id: "maslow", type: "person", tag: "High Yield", title: "Abraham Maslow", subtitle: "Psychologist · USA · 1908–1970",
    description: "Proposed the Hierarchy of Needs to explain human motivation.",
    bio: { Born: "1908 USA", Died: "1970", Theory: "Hierarchy of Needs" },
    overview: "Lower needs must be met before higher ones.",
    points: [
      "Level 1 Physiological: food, water, shelter (most basic)",
      "Level 2 Safety: security, stability",
      "Level 3 Belongingness & Love: friendship, social connection",
      "Level 4 Esteem: respect, recognition",
      "Level 5 Self-Actualisation: achieving full potential (highest)"
    ],
    mnemonic: "Please Stop Being Eaten Slowly",
    examTrap: "Don't confuse \"Psychological needs\" (= Physiological in Maslow's terms) with Esteem. Sequence must be exact.",
  },
  {
    id: "rorschach", type: "person", tag: "Key Topic", title: "Hermann Rorschach", subtitle: "Psychiatrist · Switzerland · 1884–1922",
    description: "Developed the Inkblot Test for projective personality assessment.",
    bio: { Born: "1884 Switzerland", Died: "1922", Test: "Inkblot Test" },
    overview: "Created the Inkblot Test — projective personality assessment.",
    points: [
      "Inkblot Test created by Hermann Rorschach",
      "TAT (Thematic Apperception Test) = Morgan and Murray",
      "16PF = Raymond Cattell",
      "Picture Frustration Study = Saul Rosenzweig"
    ],
    examTrap: "Inkblot Test = Hermann Rorschach. TAT = Morgan & Murray NOT Rorschach.",
  },
  {
    id: "eysenck", type: "person", tag: "Key Topic", title: "H.J. Eysenck", subtitle: "Psychologist · Germany/UK · 1916–1997",
    description: "Defined self-concept in educational psychology.",
    bio: { Born: "1916 Germany", Died: "1997 UK", Theory: "Personality Dimensions" },
    overview: "Defined self-concept: 'The totality of attitudes, judgement and values of an individual relating to his behavior, abilities and qualities'.",
    points: [
      "Known for Eysenck Personality Questionnaire (EPQ)",
      "Dimensions: Introversion–Extraversion, Neuroticism–Stability, Psychoticism"
    ],
    examTrap: "PYQ directly asks who defined self-concept this way — answer is H.J. Eysenck.",
  },
  {
    id: "freire", type: "person", tag: "Key Topic", title: "Paulo Freire & Henry Giroux", subtitle: "Critical Pedagogy · Brazil/USA",
    description: "Founders of Critical Pedagogy, challenging the 'Banking Model' of education.",
    bio: { Freire: "1921 Brazil", Giroux: "1943 USA", Theory: "Critical Pedagogy" },
    overview: "Father of Critical Pedagogy.",
    points: [
      "Banking Model of Education — teacher deposits knowledge into passive students — Freire CRITICISED this",
      "Praxis = reflection + action to transform the world",
      "Henry Giroux extended Freire's ideas; coined 'border pedagogy'",
      "Critical Pedagogy thinkers in NTET = Paulo Freire AND Henry Giroux"
    ],
    examTrap: "Loughran = reflective teaching NOT critical pedagogy. Alexander Kapp = coined Andragogy NOT critical pedagogy.",
  },
  {
    id: "fleming", type: "person", tag: "High Yield", title: "Neil Fleming", subtitle: "Educator · New Zealand · 1939–2022",
    description: "Created the widely used VARK model of learning preferences.",
    bio: { Born: "1939 NZ", Died: "2022", Model: "VARK" },
    overview: "Created VARK model in 1987.",
    points: [
      "Visual (V): graphs, charts, maps, diagrams — NOT photographs or videos",
      "Auditory (A): lectures, discussions, podcasts, debate",
      "Reading/Writing (R): notes, lists, textbooks, essays",
      "Kinesthetic (K): hands-on, simulation, labs, clinical practice",
      "Most learners are multimodal — use more than one mode"
    ],
    examTrap: "VARK = Fleming NOT Bandura/Piaget/Kahn. Visual = charts/graphs NOT videos. Kinesthetic = simulation/hands-on NOT reading.",
  },

  // SECTION 2 — THEORIES (5 cards)
  {
    id: "constructivism", type: "theory", tag: "High Yield", title: "Constructivism", subtitle: "Learning Theory",
    description: "Learners actively build knowledge through experience and social interaction.",
    overview: "Learners do not passively receive knowledge — they actively BUILD (construct) their own understanding.",
    points: [
      "Learning is an active process, not passive reception",
      "Learners construct new knowledge from existing knowledge (schemas)",
      "Teacher acts as a facilitator, not a transmitter",
      "Assessment FOR learning aligns with constructivism"
    ],
    examTrap: "Constructivist approach = child-centered. 'Assessment for learning' = constructivist perspective.",
  },
  {
    id: "behaviourism", type: "theory", tag: "High Yield", title: "Behaviourism", subtitle: "Learning Theory",
    description: "Learning is a change in observable behavior caused by environmental stimuli.",
    overview: "Internal mental processes are irrelevant.",
    points: [
      "Classical Conditioning (Pavlov): Association between stimuli",
      "Operant Conditioning (Skinner): Behaviour shaped by consequences",
      "Trial and Error (Thorndike): Connectionism"
    ],
    tables: [
      {
        headers: ["Theory", "Technology"],
        rows: [
          ["Behaviourism", "Teaching Machine (Skinner)"],
          ["Cognitivism", "ARPANET / PLATO"],
          ["Constructivism", "Interactive Multimedia"],
          ["Connectivism", "MOOC / Social Networking"]
        ]
      }
    ]
  },
  {
    id: "andragogy-theory", type: "theory", tag: "High Yield", title: "Andragogy", subtitle: "Adult Learning",
    description: "The art and science of helping adults learn.",
    overview: "Andragogy vs Pedagogy — different assumptions about learners.",
    points: [
      "Self-concept: Adults are self-directed",
      "Experience: A rich resource for learning",
      "Readiness: Tied to real-life developmental tasks",
      "Orientation: Problem-centered, not subject-centered"
    ],
    examTrap: "Kapp coined it, Knowles popularised it. Andragogy = LEARNER-centered.",
  },
  {
    id: "schema-theory", type: "theory", tag: "Key Topic", title: "Schema Theory", subtitle: "Mental Frameworks",
    description: "The mind organizes knowledge into mental frameworks called schemas.",
    overview: "Co-associated with Frederic Bartlett AND Jean Piaget.",
    points: [
      "Schema: Mental blueprint for understanding",
      "Assimilation: Fit new info into existing schema",
      "Accommodation: Change schema to fit new info",
      "Equilibration: Balance between both"
    ],
    examTrap: "Schema Theory = BOTH Frederic Bartlett AND Jean Piaget.",
  },
  {
    id: "connectivism", type: "theory", tag: "Key Topic", title: "Connectivism", subtitle: "Digital Age Learning",
    description: "Learning occurs through connections in a network.",
    overview: "Proposed by George Siemens.",
    points: [
      "Knowledge is distributed across a network",
      "Nurturing and maintaining connections is essential",
      "Associated with MOOCs and Social Networking"
    ]
  },

  // SECTION 3 — MODELS (4 cards)
  {
    id: "blooms-model", type: "model", tag: "High Yield", title: "Bloom's Taxonomy", subtitle: "Domains of Learning",
    description: "Hierarchical classification of educational goals.",
    overview: "3 domains: Cognitive, Affective, Psychomotor.",
    points: [
      "Cognitive: Remember → Understand → Apply → Analyse → Evaluate → Create",
      "Affective: Receiving → Responding → Valuing → Organisation → Characterization",
      "Psychomotor: Imitation → Manipulation → Precision → Articulation → Naturalization"
    ],
    examTrap: "Lorin Anderson revised it. CREATE is now highest."
  },
  {
    id: "5e-model", type: "model", tag: "High Yield", title: "5-E Instructional Model", subtitle: "Inquiry-Based Design",
    description: "Order: Engage → Explore → Explain → Elaborate → Evaluate.",
    overview: "Constructivist cycle of discovery.",
    points: [
      "Engage: Hook interest, activate prior knowledge",
      "Explore: Hands-on investigation",
      "Explain: Formal introduction of terms",
      "Elaborate: Application to new situations",
      "Evaluate: Assessment of understanding"
    ],
    mnemonic: "Every Explorer Explains Elaborate Events"
  },
  {
    id: "herbartian-model", type: "model", tag: "High Yield", title: "Herbartian Model", subtitle: "Memory Level Teaching",
    description: "5 formal steps: Prep → Presentation → Comparison → Generalisation → Application.",
    overview: "Systematic presentation of facts.",
    points: [
      "Preparation: Connect to prior knowledge",
      "Presentation: Deliver content",
      "Comparison: Relate to known concepts",
      "Generalisation: Derive a rule",
      "Application: Apply the rule"
    ],
    examTrap: "Herbartian = Memory Level ONLY."
  },
  {
    id: "udl-model", type: "model", tag: "Key Topic", title: "UDL (Universal Design for Learning)", subtitle: "Inclusion Framework",
    description: "Proactive design to make learning accessible to all.",
    overview: "Developed by CAST.",
    points: [
      "Multiple means of Engagement",
      "Multiple means of Representation",
      "Multiple means of Action and Expression"
    ],
    examTrap: "UDL = UNIVERSAL (not Unified)."
  },

  // SECTION 4 — TOOLS, TESTS & SYSTEMS (5 cards)
  {
    id: "clinical-tools", type: "tool", tag: "High Yield", title: "Clinical Assessment Tools", subtitle: "Performance Evaluation",
    description: "Methods for testing clinical skills and reasoning.",
    overview: "OSCE, MEQ, SJT, ICMA.",
    points: [
      "OSCE = Objective Structured Clinical Examination: multiple timed stations, standardised patients, tests specific clinical skills — most reliable for clinical competence",
      "MEQ = Modified Essay Questions: open-ended, case-based",
      "SJT = Situational Judgement Test: multiple sections/questions based on ONE case scenario (PYQ 2025)",
      "ICMA = Interactive Computer Marked Assessment",
      "Long case: student examines real patient 30–60 min then presents",
      "Short case: rapid focused examination of specific signs",
      "Cassettes are NOT a critical thinking assessment method"
    ],
    examTrap: "SJT = questions based on a CASE. MEQ = open-ended case-based. These two are different."
  },
  {
    id: "microteaching-tool", type: "tool", tag: "High Yield", title: "Microteaching", subtitle: "Skill Refinement",
    description: "Scaled-down teaching technique for training.",
    overview: "Developed at Stanford University (1960s).",
    points: [
      "Both purposes are true (PYQ 2025): device for teaching communication skills to teachers AND device for modification of teacher's behaviour",
      "Plan → Teach → Observe → Feedback → Re-plan → Re-teach cycle",
      "Skills practised: stimulus variation, reinforcement, explaining, questioning, blackboard writing, introduction, illustration, closure"
    ],
    examTrap: "BOTH statements about microteaching in PYQ 2025 are TRUE."
  },
  {
    id: "digital-tools", type: "tool", tag: "High Yield", title: "Digital Tools Reference", subtitle: "Technology Guide",
    description: "Categorization of educational software and platforms.",
    overview: "Video conferencing, LMS, content creation.",
    points: [
      "Video conferencing: WebEx, Skype, Google Meet, Zoom",
      "NOT video conferencing: Google Keep (note-taking), Moodle (LMS)",
      "Camtasia = screen recording and video editing (PYQ 2025)",
      "FlipGrid = video discussion",
      "Edmodo = learning platform",
      "Stormboard = collaborative whiteboarding",
      "Blogs = online diaries for educational use",
      "Wikis = collaborative editing and creation",
      "Podcasts = distribute audio/visual course material",
      "Instant Messenger = real-time communication"
    ],
    examTrap: "Google Keep and Moodle are NOT video conferencing. Camtasia = screen recording only."
  },
  {
    id: "swayam-tool", type: "tool", tag: "High Yield", title: "SWAYAM & MOOCs", subtitle: "Indian Platform",
    description: "Study Webs of Active Learning for Young Aspiring Minds.",
    overview: "Launched 2017 by Government of India.",
    points: [
      "Full form: Study Webs of Active Learning for Young Aspiring Minds. Launched 2017 by Government of India",
      "4 Quadrants: E-Content (videos, animations) | E-Assessment (quizzes, assignments) | Discussion Forum (peer and expert interaction) | Web resources and reference material",
      "DBMS is NOT one of the 4 quadrants",
      "SWAYAM Prabha = separate DTH TV channels for education",
      "MOOCs = Massive Open Online Courses"
    ],
    examTrap: "DBMS is NOT a SWAYAM quadrant. SWAYAM Prabha ≠ SWAYAM."
  },
  {
    id: "cbcs-tool", type: "tool", tag: "High Yield", title: "CBCS", subtitle: "Choice Based Credit System",
    description: "UGC higher education framework.",
    overview: "Choice, not content based.",
    points: [
      "Full form: Choice Based Credit System (NOT Content Based)",
      "Implemented by UGC India",
      "Students choose core, elective, and open elective courses",
      "Assessment is inclusive: formative + summative + project + field-based — ALL types together",
      "Periodic assessments serve both formative and diagnostic purposes"
    ],
    examTrap: "CBCS = CHOICE Based (not Content Based). Assessment = all types combined NOT just summative."
  },

  // SECTION 5 — KEY CONCEPTS (5 cards)
  {
    id: "zpd-concept", type: "concept", tag: "High Yield", title: "Zone of Proximal Development", subtitle: "ZPD",
    description: "The optimal zone for learning with guidance.",
    overview: "By Vygotsky.",
    points: [
      "Gap between what learner can do independently vs. with guidance",
      "Three zones: Too Easy (comfort zone, no growth) | ZPD (cannot do alone but can with help — where learning happens) | Too Hard (frustration even with help)",
      "Scaffolding = temporary support within ZPD, gradually removed as learner becomes competent",
      "Types of scaffolding: hints, prompts, worked examples, peer support, teacher modelling"
    ],
    examTrap: "ZPD is about POTENTIAL to learn with support, not what has already been learned. Scaffolding is TEMPORARY — always removed as competence grows."
  },
  {
    id: "assessment-concept", type: "concept", tag: "High Yield", title: "Formative vs Summative", subtitle: "Assessment Types",
    description: "Distinction between progress monitoring and final certification.",
    overview: "Accelerates vs Measures.",
    points: [
      "Formative: during instruction, monitor progress, give feedback, accelerates learning. Examples: class tests, quizzes, assignments",
      "Summative: end of instruction, certify/grade, measures final learning. Examples: final exams, term-end exams",
      "Diagnostic: identifies WHY student struggles, before/during teaching",
      "Placement: determines where to place student, before instruction",
      "Periodic: serves BOTH formative AND diagnostic purposes (PYQ 2025)",
      "Scholastic: purely academic/curricular performance"
    ],
    examTrap: "Periodic = formative + diagnostic NOT summative. Term End Exam = summative only. Formative ACCELERATES learning; summative MEASURES it."
  },
  {
    id: "inclusion-concept", type: "concept", tag: "High Yield", title: "Inclusive Education", subtitle: "Segregation to Inclusion",
    description: "Historical evolution of diverse education.",
    overview: "Historical sequence (PYQ 2025): Segregation → Opening doors → Accommodation → Integration → Inclusion.",
    points: [
      "Segregation: different students in different types of schools",
      "Opening doors: institutes began allowing \"other\" students in",
      "Accommodation: students learned to adjust to existing setup",
      "Integration: students integrated — but institute unchanged",
      "Inclusion: institute evolved to genuinely include all students",
      "Key difference: Integration = student adapts to institution. Inclusion = institution adapts to student",
      "Inclusive classroom = every student feels valued and respected"
    ],
    examTrap: "Inclusion ≠ Integration. These are different stages."
  },
  {
    id: "communication-concept", type: "concept", tag: "High Yield", title: "7 C's & Barriers", subtitle: "Communication",
    description: "Principles and obstacles of interaction.",
    overview: "Meferland's definition: \"The process of meaningful interaction among human beings\".",
    points: [
      "7 C's: Clarity, Conciseness, Completeness, Correctness, Courtesy, Consideration, Concreteness",
      "NOT in 7 C's: Competition, Cleverness, Causation, Cessation, Calmness",
      "Barriers: Semantic (jargon) | Presentation (too many facts in one paragraph) | Personal (lack of confidence, emotions, stereotyping) | Organisational (lack of equipment) | Physical (noise, poor lighting, fatigue)",
      "Communication process: Sender = Source | Receiver = Audience | Message = Contents | Channel = Medium",
      "AIR/TV = important unit of mass media | Socialising people = function of mass media | Promoting disturbances = negative effect of mass media | Incomplete message = barrier"
    ],
    examTrap: "Competition is NOT one of the 7 C's. Oral is FASTER than written — \"oral is slower\" is a PYQ wrong option."
  },
  {
    id: "pedagogy-concept", type: "concept", tag: "High Yield", title: "Pedagogy: Full Concept", subtitle: "Science & Art",
    description: "Theory and practice of teaching.",
    overview: "Etymology: Greek \"paidagogos\" = to lead the child (not educate, not mentor)",
    points: [
      "Pedagogy = art + science + craft of teaching (NOT \"prospect\" of teaching)",
      "Organic relation between Thoughts and Action",
      "Ultimate goal: holistic development — cognitive, creative, emotional, social",
      "Aspects of pedagogy: Learning and Supervising Drill — NOT Behaviourism, Investigation, Examination",
      "Pedagogical Analysis sequence: Content analysis → Instructional objectives → Methodology → Evaluation",
      "Critical Pedagogy thinkers: Paulo Freire and Henry Giroux ONLY"
    ],
    examTrap: "\"Prospect of teaching\" is always WRONG. Alexander Kapp = coined Andragogy not a pedagogy theorist. Loughran = reflective teaching not critical pedagogy."
  }
];

const FILTER_LABELS: Record<string, string> = {
  all: 'All',
  person: 'Persons',
  theory: 'Theories',
  model: 'Models',
  tool: 'Tools & Tests',
  concept: 'Key Concepts'
};

export default function TheoriesPersonsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userRef);

  const filteredData = useMemo(() => {
    return DOSSIER_DATA.filter(item => {
      const typeMatch = activeFilter === 'all' || item.type === activeFilter;
      const search = searchTerm.toLowerCase();
      const contentMatch = !search || 
        item.title.toLowerCase().includes(search) || 
        item.subtitle.toLowerCase().includes(search) || 
        item.description.toLowerCase().includes(search) ||
        item.overview.toLowerCase().includes(search);
      return typeMatch && contentMatch;
    });
  }, [activeFilter, searchTerm]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!mounted || isUserLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto py-12 pt-4 md:pt-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full mt-8" />
      </div>
    );
  }

  // Admin/Special access check
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

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-4 md:pt-8">
      <header className="flex flex-col gap-4 mb-8">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground hover:text-primary">
          <Link href="/notes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Material
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
            Theories, Persons & Events
          </h1>
          <p className="text-muted-foreground text-lg">
            Detailed dossiers on every important theorist, theory, and model as per syllabus.
          </p>
        </div>
      </header>

      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur py-4 flex flex-col gap-4 border-b -mx-4 px-4 md:px-0 md:mx-0">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search dossier... (e.g. Bloom, Piaget, ZPD)" 
            className="pl-10 h-12 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {Object.entries(FILTER_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap",
                activeFilter === key 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              )}
            >
              {label}
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
          filteredData.map((item) => {
            const isOpen = expandedItems[item.id];
            
            return (
              <Card key={item.id} className={cn(
                "transition-all duration-300 overflow-hidden",
                isOpen ? "ring-2 ring-primary/20 shadow-lg" : "hover:border-primary/30"
              )}>
                <button 
                  className="w-full text-left p-6 flex items-start gap-4"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className={cn(
                    "p-3 rounded-xl shrink-0",
                    item.type === 'person' ? "bg-indigo-100 text-indigo-700" :
                    item.type === 'theory' ? "bg-emerald-100 text-emerald-700" :
                    item.type === 'model' ? "bg-violet-100 text-violet-700" :
                    item.type === 'tool' ? "bg-amber-100 text-amber-700" :
                    "bg-rose-100 text-rose-700"
                  )}>
                    {item.type === 'person' && <Users className="w-6 h-6" />}
                    {item.type === 'theory' && <FlaskConical className="w-6 h-6" />}
                    {item.type === 'model' && <Layers className="w-6 h-6" />}
                    {item.type === 'tool' && <Wrench className="w-6 h-6" />}
                    {item.type === 'concept' && <Lightbulb className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-xl text-foreground truncate">{item.title}</h3>
                      <Badge variant="secondary" className={cn(
                        "uppercase text-[10px] font-black tracking-tighter",
                        item.tag === 'High Yield' ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-blue-100 text-blue-700 border-blue-200"
                      )}>
                        {item.tag}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mb-2">{item.subtitle}</p>
                    {!isOpen && (
                      <p className="text-sm text-muted-foreground line-clamp-1 italic">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-300 mt-1 shrink-0",
                    isOpen && "rotate-180"
                  )} />
                </button>

                {isOpen && (
                  <CardContent className="pt-0 pb-8 px-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="h-px bg-border" />
                    
                    {item.bio && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(item.bio).map(([k, v]) => (
                          <div key={k} className="bg-muted/30 p-3 rounded-lg border border-border/50">
                            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{k}</div>
                            <div className="text-sm font-semibold mt-1">{v}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Overview</h4>
                      <p className="text-lg leading-relaxed text-foreground/90">{item.overview}</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Key Points</h4>
                      <ul className="space-y-3 pl-1">
                        {item.points.map((p, pIdx) => (
                          <li key={pIdx} className="flex gap-3 text-base md:text-lg leading-relaxed">
                            <span className="text-primary font-bold shrink-0 mt-1.5">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {item.tables?.map((table, tIdx) => (
                      <div key={tIdx} className="space-y-3">
                        <div className="overflow-x-auto rounded-xl border border-border">
                          <table className="w-full text-sm">
                            <thead className="bg-muted">
                              <tr>
                                {table.headers.map((h, hIdx) => (
                                  <th key={hIdx} className="p-3 text-left font-bold border-b border-border">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-border last:border-none">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className={cn("p-3 align-top", cIdx === 0 && "font-bold bg-muted/20")}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}

                    {item.sequence && (
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Process Sequence</h4>
                        <div className="flex flex-wrap items-center gap-3">
                          {item.sequence.map((s, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-3">
                              {sIdx > 0 && <span className="text-muted-foreground/40 font-bold">→</span>}
                              <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                                {s}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.examTrap && (
                      <div className="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 p-5 rounded-r-xl space-y-2">
                        <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400 font-black text-xs uppercase tracking-widest">
                          <Zap className="w-4 h-4 fill-current" />
                          Exam Trap Alert
                        </div>
                        <p className="text-lg font-medium leading-relaxed italic text-rose-900 dark:text-rose-200">
                          {item.examTrap}
                        </p>
                      </div>
                    )}

                    {item.mnemonic && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 p-5 rounded-r-xl space-y-2">
                        <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase tracking-widest">
                          <Lightbulb className="w-4 h-4 fill-current" />
                          Mnemonic Shortcut
                        </div>
                        <p className="text-lg font-bold leading-relaxed text-emerald-900 dark:text-emerald-200">
                          {item.mnemonic}
                        </p>
                      </div>
                    )}
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
