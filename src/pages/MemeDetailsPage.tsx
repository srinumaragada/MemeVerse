import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, ArrowLeft, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchMemeById, likeMeme, addComment } from '../store/memeSlice';
import { addLikedMeme } from '../store/userSlice';
import { Comment } from '../types';

const MemeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentMeme, loading, error } = useAppSelector(state => state.memes);
  const { darkMode } = useAppSelector(state => state.ui);
  const { currentUser } = useAppSelector(state => state.user);
  const [commentText, setCommentText] = useState('');
  
  useEffect(() => {
    if (id) {
      dispatch(fetchMemeById(id));
    }
  }, [dispatch, id]);
  
  const isLiked = currentUser?.likedMemes.includes(id || '') || false;
  
  const handleLike = () => {
    if (!isLiked && id) {
      dispatch(likeMeme(id));
      dispatch(addLikedMeme(id));
    }
  
    
  };
  
  

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentMeme?.title || 'Check out this meme',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (commentText.trim() && id && currentUser) {
      dispatch(addComment({
        memeId: id,
        text: commentText,
        author: currentUser.name
      }));
      setCommentText('');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (error || !currentMeme) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Meme not found</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          The meme you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/explore"
          className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
        >
          Explore Memes
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center ${
            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
          } transition-colors`}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meme Image */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg overflow-hidden shadow-lg ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              }`}
            >
              <div className="relative">
                <img
                  src={currentMeme.url}
                  alt={currentMeme.title}
                  className="w-full h-auto"
                />
              </div>
              
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">{currentMeme.title}</h1>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <span>By {currentMeme.author}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDistanceToNow(new Date(currentMeme.created_at), { addSuffix: true })}</span>
                  {currentMeme.category && (
                    <>
                      <span className="mx-2">•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {currentMeme.category}
                      </span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 ${
                      isLiked ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-500'
                    } transition-colors`}
                    disabled={isLiked}
                  >
                    <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="font-medium">{currentMeme.likes}</span>
                  </button>
                  
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <MessageCircle size={24} />
                    <span className="font-medium">{currentMeme.comments.length}</span>
                  </div>
                  
                  <button
                  title="button"
                    onClick={handleShare}
                    className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-500 transition-colors"
                  >
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Comments Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`rounded-lg shadow-lg ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              } p-6`}
            >
              <h2 className="text-xl font-bold mb-6">Comments ({currentMeme.comments.length})</h2>
              
              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={currentUser?.profilePicture || "https://source.unsplash.com/random/100x100/?avatar"}
                      alt="Your avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className={`w-full p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                      }`}
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                          commentText.trim()
                            ? 'bg-purple-500 hover:bg-purple-600 text-white'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        } transition-colors`}
                      >
                        <span>Comment</span>
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              
              {/* Comments List */}
              <div className="space-y-6">
                {currentMeme.comments.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  currentMeme.comments.map((comment: Comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={`https://source.unsplash.com/random/100x100/?avatar&${comment.id}`}
                          alt={`${comment.author}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center mb-1">
                          <span className="font-medium">{comment.author}</span>
                          <span className="mx-2 text-xs text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeDetailsPage;