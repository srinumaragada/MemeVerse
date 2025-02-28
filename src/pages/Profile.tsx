import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { Meme, User } from "../types";
import { updateProfile, addLikedMeme, removeLikedMeme } from "../store/userSlice";

const ProfilePage = () => {
  const { darkMode } = useAppSelector((state) => state.ui);
  const { memes } = useAppSelector((state) => state.memes);
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
console.log(currentUser);

  const [profile, setProfile] = useState<User>(currentUser || {
    id: Date.now().toString(),
    name: "",
    bio: "",
    profilePicture: "",
    uploadedMemes: [],
    likedMemes: [],
  });

  const [isProfileSaved, setIsProfileSaved] = useState(!!currentUser?.name);
  const [activeTab, setActiveTab] = useState<"uploads" | "likes">("uploads");

  // Fetch uploaded and liked memes
  const userUploadedMemes = memes.filter((meme) =>
    meme.author===currentUser?.name
  );
  const userLikedMemes = memes.filter((meme) =>
    currentUser?.likedMemes.includes(meme.id)
  );

  
  const uniqueLike: Meme[] = userLikedMemes.reduce<Meme[]>((acc, curr) => {
    if (!acc.some(meme => meme.id === curr.id)) { // Ensure uniqueness based on 'id'
        acc.push(curr);
    }
    return acc;
}, []);

  console.log(userUploadedMemes);
  console.log(userLikedMemes);
  
  // Sync profile with currentUser
  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
      setIsProfileSaved(true);
    }
  }, [currentUser]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile(profile));
    setIsProfileSaved(true);
  };

  const handleLikeMeme = (memeId: string) => {
    if (currentUser?.likedMemes.includes(memeId)) {
      dispatch(removeLikedMeme(memeId));
    } else {
      dispatch(addLikedMeme(memeId));
    }
  };

  const handleEditProfile = () => {
    setIsProfileSaved(false); // Toggle back to the edit form
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert to Base64
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setProfile(prev => ({ ...prev, profilePicture: base64Image }));
        localStorage.setItem("profilePicture", base64Image);
      };
    }
  };
  
  useEffect(() => {
    const savedImage = localStorage.getItem("profilePicture");
    if (savedImage) {
      setProfile(prev => ({ ...prev, profilePicture: savedImage }));
    }
  }, []);
  

  
  return (
    <div className={`min-h-screen p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto">
        {!isProfileSaved ? (
          // Edit Profile Form
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Create Your Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 rounded-lg border-2 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full p-3 rounded-lg border-2 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
                  rows={4}
                  placeholder="Tell us about yourself"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Save Profile
              </button>
            </form>
          </div>
        ) : (
          // Profile Card and Memes Section
          <div>
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{profile.bio}</p>
                </div>
                <button
                  onClick={handleEditProfile}
                  className="ml-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Tabs for Uploaded and Liked Memes */}
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab("uploads")}
                className={`px-4 py-2 text-lg font-medium ${
                  activeTab === "uploads"
                    ? "border-b-2 border-purple-500 text-purple-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-purple-500"
                }`}
              >
                Uploaded Memes
              </button>
              <button
                onClick={() => setActiveTab("likes")}
                className={`px-4 py-2 text-lg font-medium ${
                  activeTab === "likes"
                    ? "border-b-2 border-purple-500 text-purple-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-purple-500"
                }`}
              >
                Liked Memes
              </button>
            </div>

            {/* Memes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeTab === "uploads" ? userUploadedMemes : uniqueLike).map((meme) => (
                <div key={meme.id} className="relative group">
                  <img
                    src={meme.url}
                    alt={meme.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white rounded-b-lg">
                    <h3 className="text-lg font-bold">{meme.title}</h3>
                    <p className="text-sm">{meme.category}</p>
                  </div>
                  {activeTab === "likes" && (
                    <button
                      onClick={() => handleLikeMeme(meme.id)}
                      className="absolute top-2 right-2 p-2 bg-black text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;