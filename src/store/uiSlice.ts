import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>;
}

// Check if dark mode is preferred
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedDarkMode = localStorage.getItem('darkMode');

const initialState: UiState = {
  darkMode: savedDarkMode !== null ? JSON.parse(savedDarkMode) : prefersDarkMode,
  sidebarOpen: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addToast: (state, action: PayloadAction<Omit<UiState['toasts'][0], 'id'>>) => {
      state.toasts.push({
        id: Date.now().toString(),
        ...action.payload,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
  },
});

export const { toggleDarkMode, toggleSidebar, addToast, removeToast } = uiSlice.actions;

export default uiSlice.reducer;