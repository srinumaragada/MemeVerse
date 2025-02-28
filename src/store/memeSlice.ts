import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Meme, MemeCategory, SortOption } from '../types';
import * as api from '../services/api';

interface MemeState {
  memes: Meme[];
  currentMeme: Meme | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  category: MemeCategory;
  sortBy: SortOption;
  searchQuery: string;
  searchResults: Meme[];
}

const initialState: MemeState = {
  memes: [],
  currentMeme: null,
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  category: 'All',
  sortBy: 'likes',
  searchQuery: '',
  searchResults: [],
};

// Fetch memes
export const fetchMemes = createAsyncThunk(
  'memes/fetchMemes',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { memes: MemeState };
      const { page, category, sortBy } = state.memes;
      
      const response = await api.getMemes(category, page, 10, sortBy);
      const hasMore = response.memes.length > 0; 

      return { memes: response.memes, hasMore };
    } catch (error) {
      return rejectWithValue('Failed to fetch memes');
    }
  }
);

// Fetch meme by ID
export const fetchMemeById = createAsyncThunk(
  'memes/fetchMemeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const meme = await api.getMemeById(id);
      if (!meme) {
        return rejectWithValue('Meme not found');
      }
      return meme;
    } catch (error) {
      return rejectWithValue('Failed to fetch meme');
    }
  }
);

// Search memes
export const searchMemes = createAsyncThunk(
  'memes/searchMemes',
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query.trim()) {
        return [];
      }
      const results = await api.searchMemes(query);
      return results;
    } catch (error) {
      return rejectWithValue('Search failed');
    }
  }
);

// Add new meme
export const addNewMeme = createAsyncThunk(
  'memes/addNewMeme',
  async (meme: Omit<Meme, 'id' | 'created_at' | 'likes' | 'comments'>, { rejectWithValue }) => {
    try {
      const newMeme = await api.addMeme(meme);
      return newMeme;
    } catch (error) {
      return rejectWithValue('Failed to add meme');
    }
  }
);

// Like meme
export const likeMeme = createAsyncThunk(
  'memes/likeMeme',
  async (id: string, { rejectWithValue }) => {
    try {
      const updatedMeme = await api.likeMeme(id);
      return updatedMeme;
    } catch (error) {
      return rejectWithValue('Failed to like meme');
    }
  }
);

// Unlike meme
export const unlikeMeme = createAsyncThunk(
  'memes/unlikeMeme',
  async (id: string, { rejectWithValue }) => {
    try {
      const updatedMeme = await api.unlikeMeme(id);
      return updatedMeme;
    } catch (error) {
      return rejectWithValue('Failed to unlike meme');
    }
  }
);

// Add comment
export const addComment = createAsyncThunk(
  'memes/addComment',
  async ({ memeId, text, author }: { memeId: string; text: string; author: string }, { rejectWithValue }) => {
    try {
      const newComment = await api.addComment(memeId, text, author);
      return { memeId, comment: newComment };
    } catch (error) {
      return rejectWithValue('Failed to add comment');
    }
  }
);


const memeSlice = createSlice({
  name: 'memes',
  initialState,
  reducers: {
    resetMemes: (state) => {
      state.memes = [];
      state.page = 1;
      state.hasMore = true;
    },
    setCategory: (state, action: PayloadAction<MemeCategory>) => {
      state.category = action.payload;
      state.memes = [];
      state.page = 1;
      state.hasMore = true;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
      state.memes = [];
      state.page = 1;
      state.hasMore = true;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
    incrementPage: (state) => {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemes.fulfilled, (state, action) => {
        state.loading = false;
        state.memes = [...state.memes, ...action.payload.memes];
        state.hasMore = action.payload.hasMore;
        if (action.payload.hasMore) {
          state.page += 1;
        }
      })
      .addCase(fetchMemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMemeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMeme = action.payload;
      })
      .addCase(fetchMemeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchMemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMemes.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewMeme.fulfilled, (state, action) => {
        state.memes.unshift(action.payload);
      })
      .addCase(likeMeme.fulfilled, (state, action) => {
        const index = state.memes.findIndex(meme => meme.id === action.payload.id);
        if (index !== -1) {
          state.memes[index] = action.payload;
        }
        if (state.currentMeme?.id === action.payload.id) {
          state.currentMeme = action.payload;
        }
      })
      .addCase(unlikeMeme.fulfilled, (state, action) => {
        const index = state.memes.findIndex(meme => meme.id === action.payload.id);
        if (index !== -1) {
          state.memes[index] = action.payload;
        }
        if (state.currentMeme?.id === action.payload.id) {
          state.currentMeme = action.payload;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { memeId, comment } = action.payload;
        const index = state.memes.findIndex(meme => meme.id === memeId);
        if (index !== -1) {
          state.memes[index].comments.push(comment);
        }
        if (state.currentMeme?.id === memeId) {
          state.currentMeme.comments.push(comment);
        }
      });
  },
});

export const {
  resetMemes,
  setCategory,
  setSortBy,
  setSearchQuery,
  clearSearch,
  setHasMore,
  incrementPage,
} = memeSlice.actions;

export default memeSlice.reducer;