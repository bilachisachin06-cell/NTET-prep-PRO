export interface SyllabusPoint {
  id: string;
  title: string;
  description: string;
  subpoints?: SyllabusPoint[];
}

export interface Note {
  id: string;
  syllabusPointId: string;
  title: string;
  content: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  syllabusPointId: string;
}

export interface Test {
  id: string;
  title: string;
  type: 'mock' | 'pyp';
  year?: number;
  duration: number; // in minutes
  mcqs: string[]; // array of MCQ ids
}

export interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  userAnswers: { [mcqId: string]: number };
  timeTaken: number; // in seconds
}
