import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { fetchMemes } from "../store/memeSlice";
import MemeCard from "../components/ui/MemeCard";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { memes, loading } = useAppSelector((state) => state.memes);
  const { darkMode } = useAppSelector((state) => state.ui);
  const [memeUrl, setMemeUrl] = useState("")

  const fetchMeme = async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = await response.json();
      if (data.success) {
        const memes = data.data.memes;
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        setMemeUrl(randomMeme.url);
      }
    } catch (error) {
      console.error("Error fetching meme:", error);
    }
  };
  useEffect(() => {
    fetchMeme(); 

    
    const interval = setInterval(fetchMeme, 5000);

    return () => clearInterval(interval); 
  }, []);
  
  useEffect(() => {
    dispatch(fetchMemes());
  }, [dispatch]);

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        className={`py-16 md:py-24 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-purple-50 to-pink-50"
        }`}
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                Welcome to MemeVerse
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300"
                variants={itemVariants}
              >
                Your one-stop destination for all things memes. Create, share,
                and enjoy the internet's best humor.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                <Link
                  to="/explore"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity flex items-center"
                >
                  Explore Memes <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link
                  to="/upload"
                  className={`px-6 py-3 font-medium rounded-full border-2 border-purple-500 flex items-center ${
                    darkMode ? "text-white" : "text-purple-500"
                  } hover:bg-purple-500 hover:text-white transition-colors`}
                >
                  Create Your Own
                </Link>
              </motion.div>
            </div>
            <motion.div
              className="md:w-1/2 md:h-80 flex justify-center"
              variants={itemVariants}
            >
              {memeUrl ? (
        <img 
          src={memeUrl} 
          alt="Random Meme" 
          className="rounded-lg shadow-xl max-w-full h-auto"
        />
      ) : (
        <p>Loading...</p>
      )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className={`py-16 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Why Choose MemeVerse?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Fresh Content Daily
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Discover new memes every day, curated from the best sources
                across the internet.
              </p>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-pink-100 dark:bg-pink-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Zap size={24} className="text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Creation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create your own memes in seconds with our intuitive meme
                generator tools.
              </p>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join a vibrant community of meme enthusiasts. Like, comment, and
                share your favorites.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Memes Section */}
      <section className={`py-16 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Trending Memes
            </h2>
            <Link
              to="/explore"
              className="text-purple-500 hover:text-purple-700 font-medium flex items-center"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {loading && memes.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {memes.slice(0, 8).map((meme, index) => (
                <MemeCard key={meme.id} meme={meme} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/explore"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity inline-flex items-center"
            >
              Explore More Memes <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Own Memes?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of creators and share your humor with the world. It's
            free and takes just a minute to get started.
          </p>
          <Link
            to="/upload"
            className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition-colors inline-block"
          >
            Start Creating Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
