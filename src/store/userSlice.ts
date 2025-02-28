import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, Meme } from "../types";

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const loadUserFromStorage = (): User | null => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

const initialState: UserState = {
  currentUser: loadUserFromStorage(),
  loading: false,
  error: null,
};

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const existingUser = loadUserFromStorage();
      const updatedUser = { ...existingUser, ...userData } as User;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return rejectWithValue("Failed to update profile");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addLikedMeme: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.likedMemes = [
          ...new Set([...state.currentUser.likedMemes, action.payload]),
        ];
        localStorage.setItem("user", JSON.stringify(state.currentUser));
      }
    },
    addUploadedMeme: (state, action: PayloadAction<Meme>) => {
      if (state.currentUser) {
        state.currentUser.uploadedMemes.push(action.payload);
        localStorage.setItem("user", JSON.stringify(state.currentUser));
      }
    },
    removeLikedMeme: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.likedMemes = state.currentUser.likedMemes.filter(
          (id) => id !== action.payload
        );
        localStorage.setItem("user", JSON.stringify(state.currentUser));
      }
    },
    loadLikedMemesFromStorage: (state, action: PayloadAction<string[]>) => {
      if (state.currentUser) {
        state.currentUser.likedMemes = action.payload;
      }
    },
    initializeUser: (state) => {
      if (!state.currentUser) {
        state.currentUser = {
          id: `user-${Date.now()}`,
          name: "MemeVerse User",
          bio: "I love memes!",
          profilePicture: "https://source.unsplash.com/random/100x100/?avatar",
          uploadedMemes: [],
          likedMemes: [],
        };
        localStorage.setItem("user", JSON.stringify(state.currentUser));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addLikedMeme,
  addUploadedMeme,
  removeLikedMeme,
  initializeUser,
  loadLikedMemesFromStorage,
} = userSlice.actions;

export default userSlice.reducer;
