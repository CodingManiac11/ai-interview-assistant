import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, InterviewSession, ChatMessage, Answer } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface CandidateState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  currentSession: InterviewSession | null;
}

const initialState: CandidateState = {
  candidates: [],
  currentCandidate: null,
  currentSession: null,
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    createCandidate: (state, action: PayloadAction<Partial<Candidate>>) => {
      const newCandidate: Candidate = {
        id: uuidv4(),
        name: action.payload.name || '',
        email: action.payload.email || '',
        phone: action.payload.phone || '',
        resumeContent: action.payload.resumeContent,
        resumeFileName: action.payload.resumeFileName,
        interviewStarted: false,
        interviewCompleted: false,
        currentQuestionIndex: 0,
        answers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.candidates.push(newCandidate);
      state.currentCandidate = newCandidate;
    },

    updateCandidate: (state, action: PayloadAction<Partial<Candidate> & { id: string }>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = {
          ...state.candidates[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        if (state.currentCandidate?.id === action.payload.id) {
          state.currentCandidate = state.candidates[index];
        }
      }
    },

    setCurrentCandidate: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.currentCandidate = state.candidates.find(c => c.id === action.payload) || null;
      } else {
        state.currentCandidate = null;
      }
    },

    startInterview: (state, action: PayloadAction<{ candidateId: string; questions: any[] }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.interviewStarted = true;
        candidate.updatedAt = new Date().toISOString();
        
        state.currentSession = {
          candidateId: action.payload.candidateId,
          questions: action.payload.questions,
          currentQuestionIndex: 0,
          startTime: new Date().toISOString(),
          isPaused: false,
          messages: [{
            id: uuidv4(),
            type: 'system',
            content: 'Welcome! Your interview is about to begin. You will be asked 6 questions: 2 Easy (20s each), 2 Medium (60s each), and 2 Hard (120s each). Good luck!',
            timestamp: new Date().toISOString(),
          }],
        };
      }
    },

    addAnswer: (state, action: PayloadAction<Answer>) => {
      const candidate = state.candidates.find(c => c.id === state.currentSession?.candidateId);
      if (candidate) {
        candidate.answers.push(action.payload);
        candidate.currentQuestionIndex = Math.min(candidate.currentQuestionIndex + 1, 6);
        candidate.updatedAt = new Date().toISOString();
        
        // Update current candidate as well to keep it in sync
        if (state.currentCandidate?.id === candidate.id) {
          state.currentCandidate = { ...candidate };
        }
      }
    },

    completeInterview: (state, action: PayloadAction<{ score: number; summary: string }>) => {
      const candidate = state.candidates.find(c => c.id === state.currentSession?.candidateId);
      if (candidate) {
        candidate.interviewCompleted = true;
        candidate.score = action.payload.score;
        candidate.summary = action.payload.summary;
        candidate.updatedAt = new Date().toISOString();
        
        // Update current candidate as well
        if (state.currentCandidate?.id === candidate.id) {
          state.currentCandidate = { ...candidate };
        }
      }
      if (state.currentSession) {
        state.currentSession.endTime = new Date().toISOString();
      }
    },

    addChatMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id' | 'timestamp'>>) => {
      if (state.currentSession) {
        const message: ChatMessage = {
          ...action.payload,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };
        state.currentSession.messages.push(message);
      }
    },

    pauseInterview: (state, action: PayloadAction<number>) => {
      if (state.currentSession) {
        state.currentSession.isPaused = true;
        state.currentSession.timeRemaining = action.payload;
      }
    },

    resumeInterview: (state) => {
      if (state.currentSession) {
        state.currentSession.isPaused = false;
      }
    },

    nextQuestion: (state) => {
      if (state.currentSession) {
        state.currentSession.currentQuestionIndex++;
      }
    },

    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.currentCandidate = null;
    },

    // Reset candidate interview to start fresh
    resetCandidateInterview: (state, action: PayloadAction<string>) => {
      const candidate = state.candidates.find(c => c.id === action.payload);
      if (candidate) {
        candidate.interviewStarted = false;
        candidate.interviewCompleted = false;
        candidate.currentQuestionIndex = 0;
        candidate.answers = [];
        candidate.score = undefined;
        candidate.summary = undefined;
        candidate.updatedAt = new Date().toISOString();
        
        // Update current candidate if it's the same one
        if (state.currentCandidate?.id === candidate.id) {
          state.currentCandidate = { ...candidate };
        }
      }
      // Clear current session
      state.currentSession = null;
    },

    // New action to complete interview with fresh candidate data
    completeInterviewWithAnswers: (state, action: PayloadAction<{ candidateId: string; answers: Answer[] }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate && action.payload.answers.length > 0) {
        // Calculate final score and summary
        const totalScore = action.payload.answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
        const averageScore = Math.round((totalScore / action.payload.answers.length) * 10) / 10;
        
        candidate.interviewCompleted = true;
        candidate.score = averageScore;
        candidate.updatedAt = new Date().toISOString();
        
        // Update current candidate as well
        if (state.currentCandidate?.id === candidate.id) {
          state.currentCandidate = { ...candidate };
        }
      }
      if (state.currentSession) {
        state.currentSession.endTime = new Date().toISOString();
      }
    },
  },
});

export const {
  createCandidate,
  updateCandidate,
  setCurrentCandidate,
  startInterview,
  addAnswer,
  completeInterview,
  addChatMessage,
  pauseInterview,
  resumeInterview,
  nextQuestion,
  clearCurrentSession,
  resetCandidateInterview,
  completeInterviewWithAnswers,
} = candidateSlice.actions;

export default candidateSlice.reducer;