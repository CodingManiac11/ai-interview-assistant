export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeContent?: string;
  resumeFileName?: string;
  score?: number;
  summary?: string;
  interviewStarted: boolean;
  interviewCompleted: boolean;
  currentQuestionIndex: number;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  category: string;
}

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
  score?: number;
  feedback?: string;
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  type: 'system' | 'user' | 'question' | 'answer';
  content: string;
  timestamp: string;
  questionIndex?: number;
}

export interface InterviewSession {
  candidateId: string;
  questions: Question[];
  currentQuestionIndex: number;
  startTime?: string;
  endTime?: string;
  isPaused: boolean;
  timeRemaining?: number;
  messages: ChatMessage[];
}

export interface AppState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  currentSession: InterviewSession | null;
  activeTab: 'interviewee' | 'interviewer';
}

export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  content: string;
}

export const QUESTION_DIFFICULTIES = {
  easy: { timeLimit: 20, label: 'Easy' },
  medium: { timeLimit: 60, label: 'Medium' },
  hard: { timeLimit: 120, label: 'Hard' }
} as const;

export const QUESTIONS_PER_DIFFICULTY = 2;
export const TOTAL_QUESTIONS = 6;