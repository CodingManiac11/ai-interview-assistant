import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeTab: 'interviewee' | 'interviewer';
  showWelcomeBackModal: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UIState = {
  activeTab: 'interviewee',
  showWelcomeBackModal: false,
  loading: false,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'interviewee' | 'interviewer'>) => {
      state.activeTab = action.payload;
    },
    
    setShowWelcomeBackModal: (state, action: PayloadAction<boolean>) => {
      state.showWelcomeBackModal = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setActiveTab,
  setShowWelcomeBackModal,
  setLoading,
  setError,
  clearError,
} = uiSlice.actions;

export default uiSlice.reducer;