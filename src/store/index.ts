import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import memeReducer from './memeSlice';
import uiReducer from './uiSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    memes: memeReducer,
    ui: uiReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;