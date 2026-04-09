
import type { SyllabusPoint, Note, MCQ, Test } from './types';
import mcqData from './mcq-data.json';

export const syllabus: SyllabusPoint[] = [
    {
    id: 'updates',
    title: 'Latest Updates',
    description: 'Latest announcements and updates regarding the NTET examination.',
    subpoints: [
      { 
        id: 'ntet-2026-notification', 
        title: 'NTET-2026 Examination Notification (Key Points)', 
        description: `The National Teachers Eligibility Test (NTET) 2026 will be conducted in Computer-Based Test (CBT) mode.\n\n• Application period: 11 March 2026 – 02 April 2026.\n• Exam date: 28 April 2026.\n• Duration: 120 minutes.\n• Minimum 50% marks to qualify.`
      },
    ]
  },
  {
    id: 'syllabus-overview',
    title: 'Syllabus Modules',
    description: 'A general overview of the topics covered in the NTET.',
    subpoints: [
        { id: 'syl-1', title: '1. Teaching & Training', description: 'Concepts, objectives, and methods.' },
        { id: 'syl-2', title: '2. Communication', description: 'Verbal and non-verbal skills.' },
        { id: 'syl-3', title: '3. Classroom Management', description: 'Environment and engagement.' },
        { id: 'syl-4', title: '4. Assessment Methods', description: 'Formative and summative tools.' },
        { id: 'syl-5', title: '5. ICT', description: 'Educational technology.' },
        { id: 'syl-6', title: '6. Educational Psychology', description: 'Cognitive and moral development.' },
        { id: 'syl-7', title: '7. Andragogy', description: 'Adult learning principles.' },
        { id: 'syl-8', title: '8. Learning & Pedagogy', description: 'Thinking and objectives.' },
    ],
  },
];

export const allMcqs: MCQ[] = mcqData;

// Centralized test registry
const tests: Test[] = [
  { id: 'mt1', title: 'Mock Test 1', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt1-q${i + 1}`) },
  { id: 'mt2', title: 'Mock Test 2', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt2-q${i + 1}`) },
  { id: 'mt3', title: 'Mock Test 3', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt3-q${i + 1}`) },
  { id: 'mt4', title: 'Mock Test 4', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt4-q${i + 1}`) },
  { id: 'mt5', title: 'Mock Test 5', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt5-q${i + 1}`) },
  { id: 'mt6', title: 'Mock Test 6', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt6-q${i + 1}`) },
  { id: 'mt7', title: 'Mock Test 7', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt7-q${i + 1}`) },
  { id: 'mt8', title: 'Mock Test 8', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt8-q${i + 1}`) },
  { id: 'mt9', title: 'Mock Test 9', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt9-q${i + 1}`) },
  { id: 'mt10', title: 'Mock Test 10', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt10-q${i + 1}`) },
  { id: 'mt11', title: 'Mock Test 11', type: 'mock', duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `mt11-q${i + 1}`) },
  { id: 'pyp-2025', title: 'Previous Year Paper 2025', type: 'pyp', year: 2025, duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `pyp2025-q${i + 1}`) },
  { id: 'pyp-2024', title: 'Previous Year Paper 2024', type: 'pyp', year: 2024, duration: 120, mcqs: Array.from({ length: 100 }, (_, i) => `pyp2024-q${i + 1}`) }
];

export const getSyllabus = (): SyllabusPoint[] => syllabus;
export const getSyllabusPointById = (id: string): SyllabusPoint | undefined => {
    for (const point of syllabus) {
        if (point.id === id) return point;
        if (point.subpoints) {
            const subpoint = point.subpoints.find(sp => sp.id === id);
            if (subpoint) return { ...subpoint, parentTitle: point.title };
        }
    }
    return undefined;
}

const DETAILED_MODULES = [
  {
    id: 'syl-1',
    title: "Teaching & Training",
    content: `### 1.1 Concept of Teaching\nTeaching is a complex, interactive process involving the planned transmission of knowledge, skills, and values from an instructor to learners. It is not merely telling or lecturing — it is facilitating understanding.\n\n### 1.2 Objectives of Teaching\nTeaching objectives define what learners are expected to know, understand, or be able to do after instruction. They operate at three levels of Bloom's Taxonomy:\n- **Knowledge (Remember)**: Recall facts, terms, and basic concepts.\n- **Comprehension (Understand)**: Explain ideas in one's own words.\n- **Application (Apply)**: Use knowledge in new situations.\n- **Analysis (Analyse)**: Break information into components.\n- **Synthesis/Evaluation (Evaluate)**: Make judgments and justify decisions.\n- **Creation (Create)**: Produce new work.\n\n### 1.3 Levels of Teaching\n- **Memory Level (Herbartian Level)**: Lowest level, emphasis on rote learning and recall.\n- **Understanding Level (Morrison Level)**: Learner grasps the meaning and relationships between facts.\n- **Reflective Level (Hunt Level)**: Highest level, involves critical thinking and problem-solving.`
  },
  {
    id: 'syl-2',
    title: "Communication",
    content: `### 2.1 Meaning of Communication\nCommunication is the process of sharing meaning between sender and receiver through a channel, with feedback completing the loop.\n\n### 2.2 Types of Communication\n- **Verbal**: Spoken or written words.\n- **Non-Verbal**: Body language, gestures, posture, facial expressions.\n- **Formal**: Official channels within an institution.\n- **Informal**: Casual interaction among peers.\n\n### 2.3 The 7 C's of Effective Communication\nClarity, Conciseness, Completeness, Correctness, Courtesy, Consideration, and Concreteness.`
  },
  {
    id: 'syl-3',
    title: "Classroom Management",
    content: `### 3.1 Concept of Management\nClassroom management involves the skills and strategies used to maintain a positive, productive, and organized learning environment.\n\n### 3.2 Strategies\n- **Preventive**: Establishing clear rules and routines on day one.\n- **Supportive**: Using non-verbal cues or quiet redirection for minor issues.\n- **Corrective**: Fair and consistent consequences for rule violations.`
  },
  {
    id: 'syl-4',
    title: "Assessment Methods",
    content: `### 4.1 Formative vs Summative\n- **Formative**: Conducted during instruction to provide feedback and accelerate learning.\n- **Summative**: Conducted at the end of a unit or course for certification and grading.\n\n### 4.2 Modern Tools\n- **OSCE**: Objective Structured Clinical Examination for clinical skills.\n- **SJT**: Situational Judgement Tests based on specific cases.\n- **CBCS**: Choice Based Credit System offering flexibility.`
  },
  {
    id: 'syl-5',
    title: "ICT in Education",
    content: `### 5.1 ICT Overview\nInformation and Communication Technology includes hardware and software used to enhance learning.\n\n### 5.2 Key Tools\n- **LMS**: Learning Management Systems like Moodle or Google Classroom.\n- **SWAYAM**: India's national MOOC platform.\n- **Adaptive Learning**: Software that adjusts content based on learner performance.`
  },
  {
    id: 'syl-6',
    title: "Educational Psychology",
    content: `### 6.1 Cognitive Development (Piaget)\nChildren move through 4 fixed stages: Sensorimotor, Preoperational, Concrete Operational, and Formal Operational.\n\n### 6.2 Sociocultural Theory (Vygotsky)\nFocuses on the Zone of Proximal Development (ZPD) and the role of social interaction and language in learning.`
  },
  {
    id: 'syl-7',
    title: "Andragogy",
    content: `### 7.1 Meaning of Andragogy\nThe science and art of helping adults learn, distinct from pedagogy (teaching children).\n\n### 7.2 Knowles' Assumptions\nAdults are self-directed, bring rich experience, and are motivated by practical, real-life problem-solving.`
  },
  {
    id: 'syl-8',
    title: "Learning & Pedagogy",
    content: `### 8.1 Pedagogical Analysis\nThe systematic breakdown of content into objectives, methods, and evaluation systems.\n\n### 8.2 5-E Model\nEngage, Explore, Explain, Elaborate, and Evaluate — a constructivist cycle for discovery learning.`
  }
];

export const getNotes = (): Note[] => DETAILED_MODULES.map(m => ({
  id: m.id,
  syllabusPointId: m.id,
  title: m.title,
  content: m.content
}));

export const getNoteBySyllabusId = (syllabusId: string): Note | undefined => {
  return getNotes().find(n => n.syllabusPointId === syllabusId);
};

export const getMcqsBySyllabusId = (syllabusId: string): MCQ[] => allMcqs.filter(m => m.syllabusPointId === syllabusId);
export const getMcqById = (id: string): MCQ | undefined => allMcqs.find(m => m.id === id);
export const getTests = (): Test[] => tests;
export const getTestById = (id: string): Test | undefined => tests.find(t => t.id === id);
