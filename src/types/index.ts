export interface Meme {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  box_count?: number;
  caption?: string;
  category?: string;
  author?: string;
  created_at: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  bio: string;
  profilePicture: string;
  uploadedMemes: string[];
  likedMemes: string[];
}

export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export type MemeCategory =  'All'|'Trending' | 'New' | 'Classic' | 'Random';

export type SortOption = 'likes' | 'date' | 'comments';