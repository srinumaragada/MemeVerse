import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchMemes, resetMemes, setCategory, setSortBy, setHasMore } from '../store/memeSlice';
import MemeCard from '../components/ui/MemeCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { MemeCategory, SortOption } from '../types';

const ExplorePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { memes, loading, category, sortBy, searchQuery, searchResults, hasMore } = useAppSelector(
    (state) => state.memes
  );
  const { darkMode } = useAppSelector((state) => state.ui);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayedMemes, setDisplayedMemes] = useState<typeof memes>([]); // Local state for displayed memes
  const [page, setPage] = useState(1); // Track the current page for repeating memes

  const isFetching = useRef(false);

  const categories: MemeCategory[] = ['Trending', 'New', 'Classic', 'Random', 'All'];
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'likes', label: 'Most Liked' },
    { value: 'date', label: 'Newest First' },
    { value: 'comments', label: 'Most Comments' },
  ];

  // Fetch more memes or repeat the existing ones
  const fetchMoreMemes = useCallback(() => {
    if (isFetching.current || loading) return;

    // If there are no more memes to load, repeat the existing ones
    if (!hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment the page to simulate infinite scrolling
      return;
    }

    // Fetch new memes if available
    isFetching.current = true;
    dispatch(fetchMemes()).finally(() => {
      isFetching.current = false;
    });
  }, [dispatch, hasMore, loading]);

  // Use the infinite scroll hook
  const { ref } = useInfiniteScroll(fetchMoreMemes);

  // Reset memes and fetch initial data when category or sortBy changes
  useEffect(() => {
    dispatch(resetMemes());
    dispatch(setHasMore(true));
    dispatch(fetchMemes());
    setPage(1); // Reset the page when filters change
  }, [dispatch, category, sortBy]);

  // Update displayed memes based on the current page
  useEffect(() => {
    if (memes.length > 0) {
      const repeatedMemes = Array.from({ length: page }, () => memes).flat();
      setDisplayedMemes(repeatedMemes);
    }
  }, [memes, page]);

  const handleCategoryChange = (newCategory: MemeCategory) => {
    if (category !== newCategory) {
      dispatch(setCategory(newCategory));
      setIsFilterOpen(false);
    }
  };

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy !== newSortBy) {
      dispatch(setSortBy(newSortBy));
      setIsFilterOpen(false);
    }
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const finalDisplayedMemes = searchQuery ? searchResults : displayedMemes;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`py-8 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Explore Memes
            </h1>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFilter}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } transition-colors`}
              >
                <Filter size={18} />
                <span>Filter & Sort</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-4 p-4 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              } shadow-lg`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          category === cat
                            ? 'bg-purple-500 text-white'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                          sortBy === option.value
                            ? 'bg-pink-500 text-white'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        {option.value === 'likes' || option.value === 'comments' ? (
                          <SortDesc size={14} className="mr-1" />
                        ) : (
                          <SortAsc size={14} className="mr-1" />
                        )}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Memes Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading && finalDisplayedMemes.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {finalDisplayedMemes.map((meme, index) => (
                <motion.div
                  key={`${meme.id}-${index}`} // Use a unique key for repeated memes
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemeCard meme={meme} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div
          ref={ref}
          className="h-20 mt-4"
          style={{ minHeight: '20px', background: 'transparent' }}
        ></div>

        {/* Loading spinner for additional memes */}
        {loading && finalDisplayedMemes.length > 0 && (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;