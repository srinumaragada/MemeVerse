import { useEffect, useState } from 'react';
import { getTopMemes, getMemes } from '../services/api';
import { Meme, User } from '../types';
import { useAppSelector } from '../hooks/useRedux';

const LeaderboardPage = () => {
  const [topMemes, setTopMemes] = useState<Meme[]>([]);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch top 10 memes
        const memes = await getTopMemes(10);
        setTopMemes(memes);

        // Fetch all memes to calculate user engagement
        const allMemes = await getMemes('All', 1, 1000, 'likes');

        // Calculate user engagement
        const userEngagement: Record<string, { user: User; likes: number; memes: number }> = {};
        allMemes.memes.forEach((meme) => {
          // Ensure meme.author is defined
          if (!meme.author) return;

          // Track meme uploads
          if (!userEngagement[meme.author]) {
            userEngagement[meme.author] = {
              user: {
                id: meme.author, name: meme.author, uploadedMemes: [], likedMemes: [],
                bio: '',
                profilePicture: ''
              },
              likes: 0,
              memes: 0,
            };
          }
          userEngagement[meme.author].memes += 1;

          // Track likes received
          userEngagement[meme.author].likes += meme.likes;
        });

        // Sort users by engagement (likes + memes)
        const sortedUsers = Object.values(userEngagement)
          .sort((a, b) => b.likes + b.memes - (a.likes + a.memes))
          .map((entry) => entry.user);

        setTopUsers(sortedUsers.slice(0, 10)); // Top 10 users
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Loading leaderboard...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-center animate-gradient-x mb-12">
          Leaderboard
        </h1>

        {/* Top 10 Memes Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Top 10 Most Liked Memes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMemes.map((meme, index) => (
              <div
                key={meme.id}
                className={`p-6 rounded-xl shadow-lg ${
                  darkMode ? 'bg-gray-800/70 backdrop-blur-lg border border-gray-700' : 'bg-white/90 backdrop-blur-md border border-gray-200'
                } transition-all hover:scale-105`}
              >
                <img
                  src={meme.url}
                  alt={meme.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-purple-400">{meme.title}</h3>
                  <p className="text-gray-400">Likes: {meme.likes}</p>
                  <p className="text-gray-400">Author: {meme.author || 'Unknown'}</p>
                  <div className="text-sm text-gray-500">
                    Rank: <span className="font-bold text-purple-500">#{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Users Section */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Top 10 Users by Engagement
          </h2>
          <div
            className={`rounded-xl shadow-lg overflow-hidden ${
              darkMode ? 'bg-gray-800/70 backdrop-blur-lg border border-gray-700' : 'bg-white/90 backdrop-blur-md border border-gray-200'
            }`}
          >
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400 uppercase tracking-wider">
                    Memes Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400 uppercase tracking-wider">
                    Total Likes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topUsers.map((user, index) => (
                  <tr key={user.id} className={`${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 text-sm font-medium text-purple-500">#{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.uploadedMemes?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.likedMemes?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;