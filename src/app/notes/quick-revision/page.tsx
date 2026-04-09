'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronDown, Search, Zap, Lightbulb, Brain } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface RevisionNote {
  unit: string;
  title: string;
  hy: boolean;
  explain: string;
  points: string[];
  seq?: string[];
  trick?: string;
  mnemonic?: string;
}

const NOTES_DATA: RevisionNote[] = [
  {
    unit: "1",
    title: "Levels of Teaching",
    hy: true,
    explain: "Teaching operates at three levels of cognitive demand — from simple recall to deep critical thinking. Each level has a corresponding teaching model used in exams.",
    points: [
      "<b>Memory Level</b> — rote learning, recall of facts → <b>Herbartian Model</b>",
      "<b>Understanding Level</b> — comprehension, application → <b>Morrison Teaching Model</b>",
      "<b>Reflective Level</b> — critical thinking, problem solving → <b>Bigge and Hunt Model</b>",
      "<b>Dynamic Model for Autonomy</b> → <b>Tassinari Model</b>",
      "3 levels total (not 4, not 5 — a common MCQ trap)"
    ],
    seq: ["Memory", "Understanding", "Reflective"],
    trick: "Match: Memory=Herbartian, Understanding=Morrison, Reflective=Bigge & Hunt, Autonomy=Tassinari",
    mnemonic: "MUR — Memory, Understanding, Reflective"
  },
  {
    unit: "1",
    title: "Bloom's Taxonomy – Cognitive Domain",
    hy: true,
    explain: "Bloom's taxonomy classifies educational objectives from simple to complex. Revised by Lorin Anderson — changed nouns to verbs and moved Synthesis to Create at the top.",
    points: [
      "Original (1956) → Revised by <b>Lorin Anderson</b>, named 'A Taxonomy for Teaching, Learning and Assessment'",
      "Order: <b>Remember → Understand → Apply → Analyse → Evaluate → Create</b>",
      "Remember = recall, identify | Understand = explain, classify | Apply = solve, use",
      "Analyse = compare, differentiate | Evaluate = judge, critique | Create = design, produce",
      "Application in new situation = <b>Synthesis/Create</b> level",
      "Recall of data = <b>Remembering</b> level — both are in the cognitive domain"
    ],
    seq: ["Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"],
    mnemonic: "RUAAEC — Really Useful Acronyms Always Explain Concepts"
  },
  {
    unit: "1",
    title: "Affective Domain (Krathwohl & Masia 1964)",
    hy: true,
    explain: "The affective domain deals with emotions, attitudes, and values. It progresses from simply being aware of something to making it a core part of one's character.",
    points: [
      "<b>Receiving</b> — passive attention, awareness, memory",
      "<b>Responding</b> — active participation (answering, doing homework)",
      "<b>Valuing</b> — attach worth to a phenomenon",
      "<b>Organisation</b> — internalising and prioritising values",
      "<b>Characterization</b> (Value Complex) — values become a way of life"
    ],
    seq: ["Receiving", "Responding", "Valuing", "Organisation", "Characterization"],
    mnemonic: "RRVOC — Really Responding Validates Our Character"
  },
  {
    unit: "1",
    title: "Psychomotor Domain (Dave 1970)",
    hy: false,
    explain: "This domain covers physical skills — from copying actions to performing them automatically with expertise.",
    points: [
      "<b>Imitation</b> — copying an observed action",
      "<b>Manipulation</b> — performing by following instructions",
      "<b>Precision</b> — accurate, controlled, without guidance",
      "<b>Articulation</b> — adapting and combining multiple skills",
      "<b>Naturalization</b> — automatic, expert-level performance"
    ],
    seq: ["Imitation", "Manipulation", "Precision", "Articulation", "Naturalization"],
    mnemonic: "IMPAN — I Must Practice And Naturalise"
  },
  {
    unit: "1",
    title: "VARK Learning Styles (Fleming)",
    hy: true,
    explain: "VARK by Neil Fleming describes four preferred modes of taking in information. Knowing these helps teachers diversify instruction.",
    points: [
      "<b>Visual</b> — graphs, diagrams, maps, charts (NOT spoken word)",
      "<b>Auditory/Aural</b> — listening, speaking, group discussions",
      "<b>Reading/Writing</b> — printed words, notes, lists, textbooks",
      "<b>Kinesthetic</b> — hands-on, simulation, clinical/lab setting",
      "Kinesthetic ≠ visual — do NOT confuse simulation with graphs"
    ],
    trick: "Visual learners prefer DIAGRAMS not lectures. Kinesthetic learners prefer HANDS-ON not reading.",
    mnemonic: "VARK — Very Active Reading Kids"
  },
  {
    unit: "1",
    title: "Factors Affecting Teaching Effectiveness",
    hy: false,
    explain: "Teaching effectiveness depends on multiple interacting factors. Teacher's subject knowledge and pedagogical skills have the greatest influence.",
    points: [
      "<b>Greatest influence</b> = teacher's subject knowledge + pedagogical skills",
      "Teacher factors: knowledge, communication, class management",
      "Learner factors: prior knowledge, motivation, individual differences",
      "Support material: AV aids, ICT tools, lab resources",
      "Personal social media contact with students is NOT a core factor",
      "Formative assessment accelerates learning by providing timely feedback"
    ]
  },
  {
    unit: "2",
    title: "7 C's of Effective Communication",
    hy: true,
    explain: "The 7 C's are a checklist for effective communication. Questions often test which words belong and which don't — memorise the exact 7.",
    points: [
      "<b>Clarity</b> — message is easy to understand",
      "<b>Conciseness</b> — no unnecessary words",
      "<b>Completeness</b> — all needed info is included",
      "<b>Correctness</b> — accurate facts and grammar",
      "<b>Courtesy</b> — respectful and polite tone",
      "<b>Consideration</b> — audience's perspective kept in mind",
      "<b>Concreteness</b> — specific, vivid, definite"
    ],
    trick: "NOT in the 7 C's: Cleverness, Competition, Causation, Cessation, Calmness. Competition is specifically asked as the odd one out.",
    mnemonic: "4C+3C — Clarity, Conciseness, Correctness, Courtesy + Completeness, Consideration, Concreteness"
  },
  {
    unit: "2",
    title: "Types & Modes of Communication",
    hy: true,
    explain: "Communication is classified by direction, medium, and reach. Each type appears in scenario-based MCQs.",
    points: [
      "<b>One-way</b> — teacher lectures to students (no feedback loop)",
      "<b>Two-way</b> — classroom discussion, dialogue",
      "<b>Verbal</b> — oral (speeches) + written (reports, memos)",
      "<b>Non-verbal</b> — gestures, posture, eye contact, body language",
      "<b>Mass communication</b> — newspapers, All India Radio/TV, internet",
      "Oral is <b>FASTER</b> than written (NOT slower — a trick option in PYQ)",
      "Over-reliance on written communication → excessive paperwork"
    ],
    trick: "'Oral communication is slower than written' is the INCORRECT statement — oral is always faster."
  },
  {
    unit: "2",
    title: "Barriers to Effective Communication",
    hy: true,
    explain: "Barriers prevent the message from reaching the receiver accurately. Classified by origin — language, presentation, personal, organisational, or physical.",
    points: [
      "<b>Semantic</b> — jargon, technical terms receiver doesn't understand",
      "<b>Presentation</b> — too many facts crammed in one paragraph",
      "<b>Personal</b> — lack of confidence, emotions, stereotyping",
      "<b>Organisational</b> — lack of equipment/infrastructure",
      "<b>Physical</b> — noise, poor lighting, fatigue",
      "Easy sentences and simple language are <b>facilitators</b>, NOT barriers",
      "Causes of miscommunication: too many messages, lack of sequence, too fast speed"
    ],
    trick: "'Communication is meaningful interaction' is a DEFINITION not a cause of miscommunication."
  },
  {
    unit: "2",
    title: "Communication Process – Key Matches",
    hy: false,
    explain: "The communication process has standard components frequently matched in MCQs. Learn the pairs.",
    points: [
      "<b>Sender</b> = Source | <b>Receiver</b> = Audience",
      "<b>Message</b> = Contents | <b>Channel</b> = Medium",
      "AIR/TV = important unit of mass media",
      "Socialising people = <b>function</b> of mass media",
      "Promoting disturbances = <b>negative effect</b> of mass media",
      "Incomplete message = <b>barrier</b> of communication"
    ]
  },
  {
    unit: "3",
    title: "Classroom Management Approaches",
    hy: true,
    explain: "Different approaches reflect different philosophies about authority and student freedom. Frequently matched in MCQs.",
    points: [
      "<b>Exploratory</b> — teacher plants questions like seeds, students discover",
      "<b>Permissive</b> — student autonomy and free expression",
      "<b>Authoritative</b> — firm but compassionate boundaries (not authoritarian)",
      "<b>Behaviorist</b> — rewards appropriate behaviors, discourages bad ones",
      "Classroom setting is an important <b>variable</b> in classroom management",
      "Knowing students by name → they feel noticed → feel respected"
    ],
    trick: "Authoritative ≠ Authoritarian. Authoritative is warm + firm. Permissive = total freedom."
  },
  {
    unit: "3",
    title: "Inclusive & Diverse Classrooms",
    hy: true,
    explain: "Inclusive education is the movement away from segregation toward full participation of all learners.",
    points: [
      "Inclusive classroom = <b>every student feels valued and respected</b>",
      "UDL = <b>Universal Design for Learning</b> (NOT Unified Design)",
      "Historical movement: <b>Segregation → Opening doors → Accommodation → Integration → Inclusion</b>",
      "Low vision student → seat at the <b>front</b> of the class",
      "UDL and diversity management are proactive, not reactive"
    ],
    seq: ["Segregation", "Opening doors", "Accommodation", "Integration", "Inclusion"]
  },
  {
    unit: "3",
    title: "Discipline & Behaviour Management",
    hy: false,
    explain: "Effective discipline is proactive and respectful. Best strategies prevent disruption rather than react to it.",
    points: [
      "<b>Best strategy</b> to reduce disruption = clear, consistent behavioural expectations",
      "Minor disruptions → use non-verbal cues or quietly address (NOT shouting)",
      "Positive discipline sequence: set rules (year start) → set objectives (class start) → reinforce → give choices",
      "Ignoring is NOT always correct — only works for attention-seeking behaviour",
      "<b>Scaffolding</b> = temporary support to help learners (gradually removed)"
    ],
    seq: ["Set rules (year start)", "Set objectives (class start)", "Reinforce conduct", "Give learner choices"]
  },
  {
    unit: "4",
    title: "Types of Assessment",
    hy: true,
    explain: "Assessment types serve different purposes at different points in the learning cycle. Confusing formative with summative is the most common MCQ trap.",
    points: [
      "<b>Formative</b> — during instruction; feedback; accelerates learning",
      "<b>Summative</b> — end of instruction; final certification/grade",
      "<b>Diagnostic</b> — identifies persistent learning difficulties",
      "<b>Placement</b> — determines where learner should be placed before instruction",
      "<b>Periodic</b> — serves BOTH diagnostic AND formative purposes",
      "<b>Scholastic</b> — purely academic/curricular activities",
      "Term End Examination = summative, NOT formative"
    ],
    trick: "Periodic = both diagnostic + formative (not summative). This exact combo appears in PYQs.",
    mnemonic: "FSD — Formative=Feedback, Summative=Score, Diagnostic=Difficulties"
  },
  {
    unit: "4",
    title: "Assessment – Norm, Criterion & Ipsative",
    hy: false,
    explain: "These three forms compare student performance against different reference points — the group, a standard, or the student's own past performance.",
    points: [
      "<b>Norm-Referenced</b> — performance relative to the group",
      "<b>Criterion-Referenced</b> — performance against a set standard (pass/fail)",
      "<b>Ipsative (Self-Referenced)</b> — current vs. student's earlier performance",
      "<b>Scholastic</b> — purely academic/curricular focus",
      "CBCS assessment = formative + summative + project + field-based"
    ]
  },
  {
    unit: "4",
    title: "Characteristics of a Good Test",
    hy: true,
    explain: "A good test must be dependable (reliable), measure what it claims (valid), and free from bias (objective). Subjectivity is the opposite of what is wanted.",
    points: [
      "<b>Reliability</b> — consistent results on re-testing",
      "<b>Validity</b> — tests what it is supposed to test",
      "<b>Objectivity</b> — scoring free from personal bias",
      "<b>Subjectivity is NOT</b> a characteristic of a good test",
      "Portfolio must NOT include biased selection of work",
      "Rubrics: criteria, descriptions, performance levels — NOT 'skills to be acquired'",
      "Constructive feedback types: Negative, Positive, Positive feed-forward — NOT 'feed-backward'"
    ],
    trick: "'Subjectivity' always appears as a trap option — eliminate it. Feed-backward is not a real term."
  },
  {
    unit: "4",
    title: "Evaluation & Test Preparation Sequences",
    hy: true,
    explain: "Sequencing questions are very common in NTET. Learn the exact order for each process.",
    points: [
      "<b>Evaluation sequence:</b> Identify objectives → Write behavioral objectives → Select tools → Administer → Score & interpret",
      "<b>Test preparation:</b> Define purpose → Write learning outcomes → Write items → Tryout → Finalise",
      "<b>5-E approach:</b> Engage → Explore → Explain → Elaborate → Evaluate",
      "<b>Pedagogical analysis:</b> Content analysis → Instructional objectives → Methodology → Evaluation",
      "On-demand examination needs a <b>Question Bank</b> as its key component"
    ],
    seq: ["Engage", "Explore", "Explain", "Elaborate", "Evaluate"],
    mnemonic: "5-E: Every Explorer Explains Elaborate Events"
  },
  {
    unit: "4",
    title: "OSCE, MEQ, SJT & Computer-Based Testing",
    hy: false,
    explain: "Clinical assessment tools are increasingly tested in NTET. Know what each abbreviation stands for.",
    points: [
      "<b>OSCE</b> = Objective Structured Clinical Exam — assesses clinical skills",
      "<b>MEQ</b> = Modified Essay Questions — case-based, open-ended",
      "<b>SJT</b> = Situational Judgement Test — multiple sections based on one case scenario",
      "Computer-based assessment order: Generation → Delivery → Scoring → Storage",
      "Cassettes are NOT a method of assessing critical thinking"
    ]
  },
  {
    unit: "5",
    title: "ICT – Core Concepts & Tools",
    hy: true,
    explain: "ICT in education covers both the technology (hardware/software) and its application in teaching and governance.",
    points: [
      "<b>Cloud computing</b> = on-demand services via internet from a specialised data centre",
      "<b>Augmented Reality (AR)</b> = overlays digital information on a real-world environment",
      "<b>Adaptive Learning Technologies</b> = software/devices that adjust to individual needs",
      "<b>LMS</b> = Learning Management System (e.g. Moodle) — NOT a video conferencing tool",
      "ICT includes both <b>hardware and software</b>",
      "Teacher confidence with ICT remains a key issue for mainstream adoption"
    ],
    trick: "Moodle = LMS. Google Keep = note-taking app. Neither is a video conferencing tool."
  },
  {
    unit: "5",
    title: "Digital Tools – Video, Recording & Platforms",
    hy: true,
    explain: "NTET frequently asks which tool belongs to which category. Memorise the tool-to-category mapping.",
    points: [
      "<b>Video conferencing:</b> WebEx, Skype, Google Meet, Zoom",
      "<b>NOT video conferencing:</b> Google Keep (notes), Moodle (LMS)",
      "<b>Camtasia</b> = screen recording and video editing for digital teaching",
      "<b>Wikis</b> = freedom to create, edit, and enhance collaboratively",
      "<b>Blogs</b> = online diaries — gaining interest for educational purposes",
      "<b>Podcasts</b> = distribute auditory/visual course material",
      "<b>Instant Messenger</b> = real-time communication among students/instructor"
    ],
    trick: "Camtasia = screen recording (not conferencing, not LMS). Appears directly in PYQ."
  },
  {
    unit: "5",
    title: "SWAYAM, MOOCs & E-learning",
    hy: false,
    explain: "SWAYAM is India's national MOOC platform. E-learning supports both individual and collaborative learning.",
    points: [
      "SWAYAM 4-quadrant: <b>E-content + E-assessment + Discussion Forum + Video lectures</b> (NOT DBMS)",
      "E-learning supports <b>both individual AND collaborative</b> learning",
      "Benefits of online teaching: self-paced, global communities, diverse resources",
      "<b>NOT a benefit:</b> physical interaction (that is a limitation)",
      "Computer illiteracy causing difficulty = <b>disadvantage</b> not advantage of e-examination",
      "Blended learning = online modules + face-to-face discussion combined"
    ],
    trick: "Physical interaction is a DISADVANTAGE of online learning, not a benefit."
  },
  {
    unit: "6",
    title: "Piaget's Cognitive Development Stages",
    hy: true,
    explain: "Piaget described how children's thinking develops in a fixed, sequential order. Each stage has a specific age range directly tested in MCQs.",
    points: [
      "<b>Sensorimotor</b> (0–2 yrs) — learning through senses and movement",
      "<b>Preoperational</b> (2–7 yrs) — symbolic/language use, egocentric thinking",
      "<b>Concrete Operational</b> (7–11 yrs) — logical thinking about concrete objects",
      "<b>Formal Operational</b> (12+ yrs) — abstract, hypothetical reasoning",
      "Child moves between stages in an <b>established (fixed) pattern</b>",
      "Schema theory: <b>Frederic Bartlett AND Jean Piaget</b>"
    ],
    seq: ["Sensorimotor 0–2", "Preoperational 2–7", "Concrete Op. 7–11", "Formal Op. 12+"],
    trick: "Age ranges are exact MCQ fodder. 7–11 = Concrete (NOT Formal). 12+ = Formal Operational."
  },
  {
    unit: "6",
    title: "Vygotsky's Sociocultural Theory",
    hy: true,
    explain: "Vygotsky believed learning is fundamentally social. Children learn with others first (interpsychological) then internalise it (intrapsychological). This direction is reversed in wrong options.",
    points: [
      "3 key features: <b>Social interaction, Zone of Proximal Development (ZPD), Language as central tool</b>",
      "Correct direction: <b>Interpsychological → Intrapsychological</b> (social first, then internal)","Higher mental functions originate as actual relations between human individuals","ZPD = gap between what a learner can do alone vs. with guidance","Private speech = <b>thinking tool</b>, NOT egocentric behaviour","Implication: <b>collaborative learning and peer interaction</b>","Internalization = taking social knowledge inside oneself"],trick:"PYQs reverse the direction: 'intra to inter' is WRONG. Always inter first, then intra.",mnemonic:"Inter before Intra — Vygotsky's golden rule"},
  {
    unit: "6",
    title: "Bronfenbrenner's Ecological Systems",
    hy: false,
    explain: "Bronfenbrenner saw development shaped by nested environmental systems — from immediate family to historical time. The theory is ecological, NOT structural.",
    points: ["<b>Microsystem</b> — immediate environment (family, school, peers)","<b>Mesosystem</b> — connections between microsystems","<b>Exosystem</b> — indirect environment (parent's workplace)","<b>Chronosystem</b> — TIME dimension — growing up before mobiles = Chronosystem","This is an <b>ecological</b> theory, NOT a structural theory of learning"],mnemonic:"MMEC — Micro, Meso, Exo, Chrono (smallest to biggest)"},
  {
    unit: "6",
    title: "Brain Parts & Functions",
    hy: true,
    explain: "Brain structure-function matching is high-frequency in NTET. Amygdala vs. Hippocampus confusion is the most common deliberate trap.",
    points: ["<b>Cerebellum</b> — coordinates balance, movement, motor skills","<b>Hippocampus</b> — critical for recalling NEW information and memory formation","<b>Amygdala</b> — processes emotions and fear (NOT recall)","<b>Thalamus</b> — relay centre; also involved in new verbal information","Synaptic connections are <b>dynamic</b> (neuroplasticity)","Adolescent brain is <b>different</b> from adult brain","Brain damage is NOT always permanent — partial compensation is possible"],trick:"Amygdala = EMOTION. Hippocampus = MEMORY/RECALL. This swap is the #1 brain MCQ trap.",mnemonic:"CHAT — Cerebellum=movement, Hippocampus=recall, Amygdala=emotion, Thalamus=relay"},
  {
    unit: "6",
    title: "Intelligence, IQ & Personality Tests",
    hy: true,
    explain: "IQ is a mathematical ratio. Personality assessment tools have specific creators — both appear in direct recall MCQs.",
    points: ["<b>IQ formula</b> = (Mental Age ÷ Chronological Age) × 100","IQ scores form a <b>Normal/Bell curve</b> distribution","Intelligence involves: Reasoning, Judging, Understanding — <b>NOT Feeling</b>","<b>Rorschach Inkblot Test</b> created by Hermann Rorschach","TAT = Morgan and Murray | Self-concept defined by <b>H. J. Eysenck</b>","Gardner's native intelligences: Interpersonal, Naturalist (among others)"],trick:"'Feeling' is always the wrong option for intelligence attributes — it belongs to emotion/personality.",mnemonic:"IQ = MA/CA × 100"},
  {
    unit: "6",
    title: "Maslow's Hierarchy of Needs",
    hy: false,
    explain: "Maslow's hierarchy explains motivation in terms of needs that must be met in order.",
    points: ["5 levels: <b>Physiological → Safety → Belongingness → Esteem → Self-Actualisation</b>","Physiological = food, water, shelter — most basic","Safety = security, stability","Belongingness = social connection, love","Esteem = respect, recognition","Self-Actualisation = reaching full potential — highest level"],seq:["Physiological","Safety","Belongingness","Esteem","Self-Actualisation"],mnemonic:"Please Stop Being Eaten Slowly"},
  {
    unit: "7",
    title: "Andragogy – Core Concepts",
    hy: true,
    explain: "Andragogy is the theory of adult learning, distinct from pedagogy. Malcolm Knowles introduced the term. Key differences from pedagogy appear in almost every NTET paper.",
    points: ["Andragogy = science of helping adults learn — term by <b>Malcolm Knowles</b>","Andragogy is <b>learner-centred</b> (NOT subject-centred — common trap!)","Topics organised around <b>life/work situations</b>, NOT subject matter units","Knowles' hypotheses: problem-solving, immediate importance, learning from experience, understanding why — NOT judgmental","Standardised assessment = NOT a characteristic of andragogy"],trick:"'Andragogy is subject-centred' is FALSE. It is always learner-centred.",mnemonic:"MASL — Malcolm, Andragogy, Self-directed, Learner-centred"},
  {
    unit: "7",
    title: "Adult Learning Theorists – Key Matches",
    hy: true,
    explain: "NTET consistently tests which theorist said what. These four names and their contributions must be memorised exactly.",
    points: ["<b>Malcolm Knowles</b> → introduced the concept of Andragogy","<b>Stephen Lieb</b> → critical elements: motivation and reinforcement","<b>Liegans Paul</b> → responsibilities of adult trainers (Facilitator, Harmonizer)","<b>Hall D.M.</b> → guidelines for adult trainers","<b>Legans</b> — adult trainer should NOT use force or fear","Adult trainer must respect, engage, and provide practical application"],trick:"Knowles = Andragogy concept. Lieb = motivation & reinforcement. Don't swap these.",mnemonic:"KL-LH — Knowles, Lieb, Liegans, Hall"},
  {
    unit: "7",
    title: "Characteristics of Adult Learners",
    hy: true,
    explain: "Adult learners are fundamentally different from children — self-directed, experienced, and practically oriented.",
    points: ["Adult learners are <b>NOT teacher-dependent</b> — they are self-directed","They take <b>ownership</b> of their learning","Prefer <b>practical/experiential</b> learning over theoretical/traditional methods","Are <b>voluntary</b> learners — they choose to be there","Bring <b>prior knowledge and experience</b> to the classroom","Are <b>internally motivated</b> (not externally driven)"],trick:"'Highly teacher-dependent' and 'prefer traditional theoretical methods' are always WRONG for adult learners."},
  {
    unit: "8",
    title: "Pedagogy – Meaning & Core Concepts",
    hy: true,
    explain: "Pedagogy comes from Greek, meaning 'to lead the child'. It encompasses the art, science, and craft of teaching.",
    points: ["Greek origin: <b>paidagogos</b> — 'to lead the child' (NOT educate, mentor, or recognise)","Pedagogy = <b>art + science + craft</b> of teaching (NOT 'prospect')","Organic relation between <b>Thoughts and Action</b>","Ultimate goal = <b>holistic development</b> — creative, emotional, social","Critical pedagogy: <b>Paulo Freire and Henry Giroux</b>","<b>Alexander Kapp</b> coined 'Andragogy' — NOT pedagogy","Teaching = conscious activity to enhance learning in another"],trick:"'Prospect of teaching' is always the WRONG option for what pedagogy refers to."},
  {
    unit: "8",
    title: "Learning Objectives",
    hy: true,
    explain: "Learning objectives guide what is taught and assessed. They must be precise, sequenced, and achievable — but they are NOT determined by the syllabus.",
    points: ["Must be: <b>specific in terms of behaviour, sequenced (simple to complex), attainable</b>","<b>NOT required to be 'covered by the syllabus'</b> — syllabus aligns to objectives, not vice versa","<b>CLO</b> = Course Learning Objectives (detailed objectives for individual subjects)","<b>PLO</b> = Program Learning Objectives | <b>GA</b> = Graduate Attributes","Remembering → recognise | Understanding → give examples | Applying → represent graphically"],trick:"'Covered by the syllabus' is the INCORRECT statement about learning objectives (PYQ Q15)."},
  {
    unit: "8",
    title: "Teaching Sequences & Models",
    hy: true,
    explain: "Sequencing questions are very common in NTET. Learn the exact order for each process.",
    points: ["<b>Teaching sequence:</b> Know prior knowledge → Set objectives → Decide topic → Decide materials → Introduce topic","<b>Test preparation:</b> Define purpose → Write outcomes → Write items → Tryout → Finalise","<b>5-E approach:</b> Engage → Explore → Explain → Elaborate → Evaluate","<b>Pedagogical analysis:</b> Content analysis → Instructional objectives → Methodology → Evaluation","<b>Pre-active stage</b> = Fixing up Goals (BEFORE entering classroom)","<b>Programmed learning:</b> Initial Behavior → Small steps → Active Participation → Immediate feedback → Terminal Behavior"],seq:["Engage","Explore","Explain","Elaborate","Evaluate"],mnemonic:"5-E: Every Explorer Explains Elaborate Events"},
  {
    unit: "8",
    title: "Teaching Methods – Learner vs Teacher Centred",
    hy: true,
    explain: "Understanding which methods put the learner in control vs. the teacher is fundamental to NTET.",
    points: ["<b>Learner-centred:</b> Role play, Discussion, Inquiry/Discovery, Problem-solving","<b>Teacher-centred:</b> Lecture, Demonstration","Lecture = one-way communication — always teacher-centred","<b>Blended learning</b> = online modules + face-to-face discussion","<b>Brainstorming</b> = generates large number of ideas","<b>Simulation (SBME)</b> = improves communication skills + decision-making","<b>Inquiry-based learning</b> = improves reasoning, argumentation, higher cognitive competencies","<b>Microteaching</b> = trains communication skills AND modifies teacher behaviour"],trick:"Lecture is ALWAYS teacher-centred. Demonstration is also teacher-centred despite showing a skill."},
  {
    unit: "8",
    title: "Constructivism & Self-Directed Learning",
    hy: false,
    explain: "Constructivism holds that learners build knowledge through experience. Self-directed learning puts the learner in control of the entire process.",
    points: ["Constructivist approach = <b>child-centred pedagogy</b>","Assessment for learning = constructivist perspective","Self-directed learning sequence: <b>Evaluate readiness → Establish objectives → Participate → Evaluate learning</b>","Self-assessment sequence: Getting started → Select components → Evaluate competences → Compare perspectives","Teacher promotes self-regulation by providing opportunities for <b>self-reflection and goal setting</b>"],seq:["Evaluate readiness","Establish objectives","Participate","Evaluate learning"]}
];

const UNIT_NAMES: Record<string, string> = {
  '1': 'Unit 1 – Teaching & Training',
  '2': 'Unit 2 – Communication',
  '3': 'Unit 3 – Classroom Management',
  '4': 'Unit 4 – Assessment Methods',
  '5': 'Unit 5 – Educational Technology',
  '6': 'Unit 6 – Educational Psychology',
  '7': 'Unit 7 – Andragogy',
  '8': 'Unit 8 – Learning & Pedagogy'
};

export default function QuickRevisionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const filteredData = useMemo(() => {
    return NOTES_DATA.map((d, i) => ({ ...d, _i: i })).filter(d => {
      const unitMatch = activeTab === 'all' || d.unit === activeTab;
      const search = searchTerm.toLowerCase();
      const searchMatch = !search || 
        d.title.toLowerCase().includes(search) || 
        d.explain.toLowerCase().includes(search) || 
        d.points.some(p => p.toLowerCase().includes(search));
      return unitMatch && searchMatch;
    });
  }, [activeTab, searchTerm]);

  const toggleCard = (id: number) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-4 md:pt-8">
      <header className="flex flex-col gap-4 mb-8">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground hover:text-primary">
          <Link href="/notes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
            NTET Quick Revision Notes
          </h1>
          <p className="text-muted-foreground text-lg">
            All 8 units · High-yield points · Exam traps · Mnemonics
          </p>
        </div>
      </header>

      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur py-4 flex flex-col gap-4 border-b -mx-4 px-4 md:px-0 md:mx-0">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search notes... (e.g. Bloom, Vygotsky, formative)" 
            className="pl-10 h-12 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap",
              activeTab === 'all' 
                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
            )}
          >
            All Units
          </button>
          {Object.entries(UNIT_NAMES).map(([id, name]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap",
                activeTab === id 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              )}
            >
              {name.split(' – ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-12">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium text-lg">No revision notes found matching your search.</p>
            <Button variant="link" className="text-lg" onClick={() => {setSearchTerm(''); setActiveTab('all');}}>Clear all filters</Button>
          </div>
        ) : (
          (() => {
            let lastUnit = '';
            return filteredData.map((d) => {
              const showUnitTitle = activeTab === 'all' && d.unit !== lastUnit;
              if (showUnitTitle) lastUnit = d.unit;
              const isOpen = expandedCards[d._i];

              return (
                <div key={d._i} className="flex flex-col gap-4">
                  {showUnitTitle && (
                    <h2 className="text-base md:text-lg font-black uppercase tracking-[0.2em] text-primary/60 border-b pb-3 mt-6">
                      {UNIT_NAMES[d.unit]}
                    </h2>
                  )}
                  
                  <Card className={cn(
                    "transition-all duration-300 overflow-hidden",
                    isOpen ? "ring-2 ring-primary/20 shadow-md" : "hover:border-primary/30"
                  )}>
                    <button 
                      className="w-full text-left p-6 md:p-8 flex justify-between items-start gap-6"
                      onClick={() => toggleCard(d._i)}
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-4">
                          <h3 className="font-bold text-xl md:text-2xl text-foreground">{d.title}</h3>
                          {d.hy ? (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 hover:bg-orange-100 border-orange-200 uppercase text-[10px] md:text-xs font-black tracking-tighter">
                              High Yield
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="uppercase text-[10px] md:text-xs font-black tracking-tighter opacity-60">
                              Key Topic
                            </Badge>
                          )}
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                          {d.explain}
                        </p>
                      </div>
                      <ChevronDown className={cn(
                        "w-6 h-6 text-muted-foreground transition-transform duration-300 mt-1 shrink-0",
                        isOpen && "rotate-180"
                      )} />
                    </button>

                    {isOpen && (
                      <CardContent className="pt-0 pb-8 px-6 md:px-8 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="h-px bg-border" />
                        
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Key Points</h4>
                          <ul className="space-y-4">
                            {d.points.map((p, idx) => (
                              <li key={idx} className="flex gap-4 text-base md:text-xl leading-relaxed text-foreground/90">
                                <span className="text-primary font-bold shrink-0 mt-1.5">•</span>
                                <span dangerouslySetInnerHTML={{ __html: p }} />
                              </li>
                            ))}
                          </ul>
                        </div>

                        {d.seq && (
                          <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sequence</h4>
                            <div className="flex flex-wrap items-center gap-3">
                              {d.seq.map((s, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  {idx > 0 && <span className="text-muted-foreground/40 font-bold">→</span>}
                                  <span className="bg-primary/5 text-primary border border-primary/10 px-4 py-2 rounded-full text-sm md:text-base font-bold">
                                    {s}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {d.trick && (
                          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-5 md:p-6 rounded-r-xl space-y-2">
                            <div className="flex items-center gap-3 text-red-700 dark:text-red-400 font-black text-xs uppercase tracking-widest">
                              <Zap className="w-4 h-4 fill-current" />
                              Exam Trap Alert
                            </div>
                            <p className="text-base md:text-lg text-red-900 dark:text-red-200 font-medium leading-relaxed italic">
                              {d.trick}
                            </p>
                          </div>
                        )}

                        {d.mnemonic && (
                          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-5 md:p-6 rounded-r-xl space-y-2">
                            <div className="flex items-center gap-3 text-green-700 dark:text-green-400 font-black text-xs uppercase tracking-widest">
                              <Lightbulb className="w-4 h-4 fill-current" />
                              Mnemonic Shortcut
                            </div>
                            <p className="text-base md:text-lg text-green-900 dark:text-green-200 font-medium leading-relaxed">
                              <strong className="text-xl">{d.mnemonic.split(' — ')[0]}</strong> {d.mnemonic.includes(' — ') ? ` — ${d.mnemonic.split(' — ')[1]}` : ''}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </div>
              );
            })
          })()
        )}
      </div>

      <footer className="mt-24 text-center space-y-6 border-t pt-12 opacity-60">
        <Brain className="w-10 h-10 text-primary mx-auto opacity-20" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
          Master the High-Yield Concepts
        </p>
      </footer>
    </div>
  );
}
