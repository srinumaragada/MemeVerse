import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

const Footer: React.FC = () => {
  const { darkMode } = useAppSelector(state => state.ui);
  
  return (
    <footer className={`py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">MemeVerse</h3>
            <p className="mb-4">Your one-stop destination for all things memes. Create, share, and enjoy the internet's best humor.</p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-purple-500 transition-colors">Home</Link></li>
              <li><Link to="/explore" className="hover:text-purple-500 transition-colors">Explore</Link></li>
              <li><Link to="/upload" className="hover:text-purple-500 transition-colors">Upload</Link></li>
              <li><Link to="/leaderboard" className="hover:text-purple-500 transition-colors">Leaderboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-purple-500 transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-purple-500 transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-purple-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-purple-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="mb-2">Have questions or feedback?</p>
            <a href="mailto:info@memeverse.com" className="text-purple-500 hover:underline">info@memeverse.com</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} MemeVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;