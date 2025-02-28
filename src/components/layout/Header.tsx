import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleDarkMode } from '../../store/uiSlice';
import { setSearchQuery, searchMemes } from '../../store/memeSlice';
import useDebounce from '../../hooks/useDebounce';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { darkMode } = useAppSelector(state => state.ui);
  const { searchQuery } = useAppSelector(state => state.memes);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  const debouncedSearchQuery = useDebounce(localSearchQuery, 500);
  
  React.useEffect(() => {
    if (debouncedSearchQuery) {
      dispatch(searchMemes(debouncedSearchQuery));
    }
  }, [debouncedSearchQuery, dispatch]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Upload', path: '/upload' },
    { name: 'Profile', path: '/profile' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];
  
  return (
    <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">MemeVerse</span>
            </Link>
          </div>
          
          {/* Search bar - only show on explore page */}
          {location.pathname === '/explore' && (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className={`relative w-full ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search memes..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                />
              </div>
            </div>
          )}
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium hover:text-purple-500 transition-colors ${
                  location.pathname === link.path ? 'text-purple-500' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            {location.pathname === '/explore' && (
              <div className="mb-4">
                <div className={`relative w-full ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search memes..."
                    value={localSearchQuery}
                    onChange={handleSearchChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium hover:text-purple-500 transition-colors ${
                    location.pathname === link.path ? 'text-purple-500' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Dark Mode</span>
                <button
                  onClick={() => dispatch(toggleDarkMode())}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;