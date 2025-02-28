import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { useAppSelector } from '../../hooks/useRedux';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useAppSelector(state => state.ui);
  
  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Header />
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;