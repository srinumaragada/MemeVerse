import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useAppSelector } from '../hooks/useRedux';

const NotFoundPage: React.FC = () => {
  const { darkMode } = useAppSelector(state => state.ui);
  
  // Random funny 404 messages
  const funnyMessages = [
    "Oops! This meme has gone into hiding.",
    "404: Meme not found. It probably went viral somewhere else.",
    "This page has been abducted by aliens... or just doesn't exist.",
    "Looks like this meme took a day off.",
    "Even our best meme detectives couldn't find this page."
  ];
  
  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            404
          </h1>
          
          <div className="mb-8">
            <img 
              src="https://source.unsplash.com/random/600x400/?funny,error" 
              alt="Funny 404 error" 
              className="mx-auto rounded-lg shadow-xl max-w-md w-full h-auto"
            />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {randomMessage}
          </h2>
          
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The page you're looking for has disappeared faster than a trending meme. 
            Let's get you back to the fun stuff!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity flex items-center"
            >
              <Home size={18} className="mr-2" />
              Back to Home
            </Link>
            
            <Link
              to="/explore"
              className={`px-6 py-3 font-medium rounded-full border-2 border-purple-500 flex items-center ${
                darkMode ? 'text-white' : 'text-purple-500'
              } hover:bg-purple-500 hover:text-white transition-colors`}
            >
              <Search size={18} className="mr-2" />
              Explore Memes
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;