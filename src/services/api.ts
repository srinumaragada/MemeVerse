import axios from 'axios';
import { Meme, MemeTemplate, User } from '../types';

const IMGFLIP_API = 'https://api.imgflip.com';
const IMGBB_API = 'https://api.imgbb.com/1/upload';
const IMGBB_API_KEY = 'your-imgbb-api-key'; 

const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; 


const isCacheValid = (key: string): boolean => {
  if (!apiCache[key]) return false;
  return Date.now() - apiCache[key].timestamp < CACHE_DURATION;
};


export const getMemeTemplates = async (): Promise<MemeTemplate[]> => {
  const cacheKey = 'meme-templates';
  
  if (isCacheValid(cacheKey)) {
    return apiCache[cacheKey].data;
  }
  
  try {
    const response = await axios.get(`${IMGFLIP_API}/get_memes`);
    const templates = response.data.data.memes;
    
    apiCache[cacheKey] = {
      data: templates,
      timestamp: Date.now()
    };
    
    return templates;
  } catch (error) {
    console.error('Error fetching meme templates:', error);
    throw error;
  }
};

export const generateMeme = async (
  templateId: string,
  topText: string,
  bottomText: string
): Promise<string> => {
  try {
    const formData = new URLSearchParams();
    formData.append('template_id', templateId);
    formData.append('username', 'memeverse_demo'); 
    formData.append('password', 'memeverse_demo'); 
    formData.append('text0', topText);
    formData.append('text1', bottomText);
    
    const response = await axios.post(`${IMGFLIP_API}/caption_image`, formData);
    return response.data.data.url;
  } catch (error) {
    console.error('Error generating meme:', error);
    throw error;
  }
};

export const uploadImage = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('key', IMGBB_API_KEY);
    
    const response = await axios.post(IMGBB_API, formData);
    return response.data.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};


export const getMemes = async (
  category: string = 'All',
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'likes'
): Promise<{ memes: Meme[]; hasMore: boolean }> => {
  
  const cacheKey = `memes-${category}-${page}-${limit}-${sortBy}`;
  
  if (isCacheValid(cacheKey)) {
    return apiCache[cacheKey].data;
  }
  
 
  await new Promise(resolve => setTimeout(resolve, 500));
  
  
  let memes: Meme[] = JSON.parse(localStorage.getItem('memes') || '[]');
  
  if (memes.length === 0) {
  
    const templates = await getMemeTemplates();
    memes = templates.slice(0, 50).map((template, index) => ({
      id: template.id,
      title: template.name,
      url: template.url,
      width: template.width,
      height: template.height,
      category: ['Trending', 'New', 'Classic', 'Random'][Math.floor(Math.random() * 4)],
      author: `user${Math.floor(Math.random() * 100)}`,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 0, 
      comments: []
    }));
    
    localStorage.setItem('memes', JSON.stringify(memes));
  }
  
  let filteredMemes = category === 'All' 
    ? memes 
    : memes.filter(meme => meme.category === category);
  
  
  if (sortBy === 'likes') {
    filteredMemes = filteredMemes.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === 'date') {
    filteredMemes = filteredMemes.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else if (sortBy === 'comments') {
    filteredMemes = filteredMemes.sort((a, b) => b.comments.length - a.comments.length);
  }
  
 
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMemes = filteredMemes.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredMemes.length;
  
  const result = { memes: paginatedMemes, hasMore };
  
  apiCache[cacheKey] = {
    data: result,
    timestamp: Date.now()
  };
  
  return result;
};


export const searchMemes = async (query: string): Promise<Meme[]> => {
  const cacheKey = `search-${query}`;
  
  if (isCacheValid(cacheKey)) {
    return apiCache[cacheKey].data;
  }
  
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const memes: Meme[] = JSON.parse(localStorage.getItem('memes') || '[]');
  const results = memes.filter(meme => 
    meme.title.toLowerCase().includes(query.toLowerCase())
  );
  
  apiCache[cacheKey] = {
    data: results,
    timestamp: Date.now()
  };
  
  return results;
};


export const getMemeById = async (id: string): Promise<Meme | null> => {
  const cacheKey = `meme-${id}`;
  
  if (isCacheValid(cacheKey)) {
    return apiCache[cacheKey].data;
  }
  
  const memes: Meme[] = JSON.parse(localStorage.getItem('memes') || '[]');
  const meme = memes.find(m => m.id === id) || null;
  
  apiCache[cacheKey] = {
    data: meme,
    timestamp: Date.now()
  };
  
  return meme;
};

export const addMeme = async (meme: Omit<Meme, 'id' | 'created_at' | 'likes' | 'comments'>): Promise<Meme> => {
  const memes: Meme[] = JSON.parse(localStorage.getItem('memes') || '[]');
  
  const newMeme: Meme = {
    ...meme,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    likes: 0, 
    comments: []
  };
  
  memes.unshift(newMeme);
  localStorage.setItem('memes', JSON.stringify(memes));
 
  Object.keys(apiCache).forEach(key => {
    if (key.startsWith('memes-') || key === 'search-') {
      delete apiCache[key];
    }
  });
  
  return newMeme;
};


export const likeMeme = async (id: string): Promise<Meme> => {
  const memes: Meme[] = JSON.parse(localStorage.getItem('memes') || '[]');
  const index = memes.findIndex(m => m.id === id);
  
  if (index === -1) {
    throw new Error('Meme not found');
  }
  

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.likedMemes && user.likedMemes.includes(id)) {
    throw new Error('User has already liked this meme');
  }
  

  memes[index].likes += 1;
  

  if (user.id) {
    user.likedMemes = [...(user.likedMemes || []), id];
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  localStorage.setItem('memes', JSON.stringify(memes));
  

  Object.keys(apiCache).forEach(key => {
    if (key.startsWith('memes-') || key === `meme-${id}`) {
      delete apiCache[key];
    }
  });
  
  return memes[index];
};

// Unlike a meme
export const unlikeMeme = async (id: string): Promise<Meme> => {
  const memes: Meme[] = JSON.parse(localStorage.getItem('memes') || '[]');
  const index = memes.findIndex(m => m.id === id);
  
  if (index === -1) {
    throw new Error('Meme not found');
  }
  
  // Check if the user has liked the meme
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.likedMemes || !user.likedMemes.includes(id)) {
    throw new Error('User has not liked this meme');
  }
  
  // Decrement like count
  memes[index].likes -= 1;
  
  // Remove meme from user's liked memes
  if (user.id) {
    user.likedMemes = user.likedMemes.filter((memeId: string) => memeId !== id);
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  localStorage.setItem('memes', JSON.stringify(memes));
  
  // Invalidate cache
  Object.keys(apiCache).forEach(key => {
    if (key.startsWith('memes-') || key === `meme-${id}`) {
      delete apiCache[key];
    }
  });
  
  return memes[index];
};


export const addComment = async (memeId: string, text: string): Promise<Comment> => {
  const memes: Meme[] = JSON.parse(localStorage.getItem('memes') || '[]');
  const index = memes.findIndex(m => m.id === memeId);

  if (index === -1) {
    throw new Error('Meme not found');
  }

  const newComment: Comment = {
    id: `comment-${Date.now()}`, 
    text,
    author: 'User',
    created_at: new Date().toISOString(), 
  };

  
  memes[index].comments.push(newComment);

  
  localStorage.setItem('memes', JSON.stringify(memes));

  // Invalidate cache for the affected meme
  Object.keys(apiCache).forEach(key => {
    if (key.startsWith('memes-') || key === `meme-${memeId}`) {
      delete apiCache[key];
    }
  });

  return newComment;
};


export const getTopMemes = async (limit: number = 10): Promise<Meme[]> => {
  const cacheKey = `top-memes-${limit}`;
  
  if (isCacheValid(cacheKey)) {
    return apiCache[cacheKey].data;
  }
  
  const memes: Meme[] = JSON.parse(localStorage.getItem('memes') || '[]');
  const topMemes = [...memes].sort((a, b) => b.likes - a.likes).slice(0, limit);
  
  apiCache[cacheKey] = {
    data: topMemes,
    timestamp: Date.now()
  };
  
  return topMemes;
};


export const getUserData = async (): Promise<User | null> => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};


export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...user, ...userData };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
};