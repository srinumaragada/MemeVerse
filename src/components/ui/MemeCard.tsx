import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { formatDistanceToNow } from 'date-fns';
import { Meme } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { likeMeme, unlikeMeme } from '../../store/memeSlice'; // Add unlikeMeme action
import { addLikedMeme, removeLikedMeme } from '../../store/userSlice'; // Add removeLikedMeme action
import 'react-lazy-load-image-component/src/effects/blur.css';

interface MemeCardProps {
  meme: Meme;
  index?: number;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, index = 0 }) => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector(state => state.ui);
  const { currentUser } = useAppSelector(state => state.user);
  
  const isLiked = currentUser?.likedMemes.includes(meme.id) || false;
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      // Unlike the meme
      dispatch(unlikeMeme(meme.id));
      dispatch(removeLikedMeme(meme.id));
    } else {
      // Like the meme
      dispatch(likeMeme(meme.id));
      dispatch(addLikedMeme(meme.id));
    }
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: meme.title,
        url: window.location.origin + '/meme/' + meme.id,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.origin + '/meme/' + meme.id)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <Link to={`/meme/${meme.id}`} className="block">
        <div className="relative pb-[75%] overflow-hidden bg-gray-200 dark:bg-gray-700">
          <LazyLoadImage
            src={meme.url}
            alt={meme.title}
            effect="blur"
            className="absolute inset-0 w-full h-full object-cover"
            wrapperClassName="absolute inset-0 w-full h-full"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{meme.title}</h3>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span>By {meme.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(new Date(meme.created_at), { addSuffix: true })}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-500'
                } transition-colors`}
                aria-label={isLiked ? 'Unlike meme' : 'Like meme'}
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{meme.likes}</span>
              </button>
              
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <MessageCircle size={18} />
                <span>{meme.comments.length}</span>
              </div>
            </div>
            
            <button
              onClick={handleShare}
              className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-500 transition-colors"
              aria-label="Share meme"
            >
              <Share2 size={18} />
            </button>
          </div>
          {meme.caption && (
            <div className="mt-3">
            <span className={`inline-block px-2 py-1 text-xs rounded-lg ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {meme.caption}
            </span>
          </div>
          )}
          
          {meme.category && (
            <div className="mt-3">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}>
                {meme.category}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default MemeCard;