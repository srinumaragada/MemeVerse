import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { uploadMeme } from "../utils/uploadMeme";
import { addNewMeme } from "../store/memeSlice";
import { useAppSelector } from "../hooks/useRedux";
import { useNavigate } from "react-router-dom";
import { addUploadedMeme } from "../store/userSlice";
import { Meme } from "../types";

const UploadPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    caption:""
  });
  const navigate=useNavigate()
  const [previewmeme,setPreviewmeme] = useState<boolean>(false);
  const { darkMode } = useAppSelector(state => state.ui);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generatingCaption, setGeneratingCaption] = useState(false);

  const { memes, } = useAppSelector(state => state.memes);
  console.log(memes);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
  
    try {
      const uploadedUrl = await uploadMeme(file);
  
      const newMeme: Meme = {
        id: Date.now().toString(), 
        title: formData.title || "Funny Meme",
        url: uploadedUrl,
        width: 500,
        height: 500,
        caption: formData.caption || "",
        category: formData.category || "Trending",
        author: formData.author || "Anonymous",
        created_at: new Date().toISOString(), 
        likes: 0,
        comments: [], 
      };
  
      dispatch(addNewMeme(newMeme));
      dispatch(addUploadedMeme(newMeme));
  
      setPreviewmeme(true);
      alert("Meme uploaded successfully!");
      navigate("/");
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };
  

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const generateAICaption = async () => {
    setGeneratingCaption(true);
    try {
      const response = await fetch("https://api.chucknorris.io/jokes/random");
      const data = await response.json();
      setFormData((prev) => ({ ...prev, caption: data.value || "Funny Caption" }));
    } catch (error) {
      console.error("Failed to generate caption", error);
      alert("AI caption generation failed!");
    } finally {
      setGeneratingCaption(false);
    }
  };

  return (
    <div className={`min-h-screen mb-10 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
    <div className={`${previewmeme ? "blur-sm" : "blur-none"} transition-all duration-300`}>
      <h1 className="text-6xl font-bold bg-gradient-to-r p-10 from-purple-500 to-pink-500 bg-clip-text text-transparent text-center animate-gradient-x">
        Create Your Own Memes
      </h1>
      
      <div className={`max-w-2xl mx-auto min-h-screen p-10 ${
        darkMode ? 'bg-gray-800/70 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-md'
      } rounded-xl shadow-2xl border ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex flex-col justify-center mt-10 gap-6">
          <div className="space-y-2">
            <label className="text-xl font-bold text-purple-400 uppercase tracking-wide">Title</label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleChangeInput}
              placeholder="Enter the Title"
              className={`w-full p-4 text-lg rounded-xl border-2 ${
                darkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500' 
                  : 'bg-white border-gray-200 text-gray-800 focus:border-purple-400'
              } focus:ring-0 transition-all duration-200 placeholder-gray-400`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xl font-bold text-purple-400 uppercase tracking-wide">Upload Meme</label>
            <div className={`relative border-2 border-dashed ${
              darkMode ? 'border-gray-600 hover:border-purple-500' : 'border-gray-300 hover:border-purple-400'
            } rounded-xl transition-all duration-200 group`}>
              <input 
              title="image"
                type="file" 
                required 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-8 text-center">
                <span className={`text-lg ${
                  darkMode ? 'text-gray-300 group-hover:text-purple-400' : 'text-gray-600 group-hover:text-purple-600'
                } transition-colors`}>
                  Click to upload or drag and drop
                </span>
                <p className={`text-sm mt-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {preview && (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-64 h-64 object-cover rounded-xl border-2 border-purple-500 shadow-lg mt-4 mx-auto transition-transform hover:scale-105" 
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xl font-bold text-purple-400 uppercase tracking-wide">Caption</label>
            <div className="flex gap-3">
              <input
                required
                type="text"
                name="caption"
                value={formData.caption}
                onChange={handleChangeInput}
                placeholder="Enter a funny caption"
                className={`flex-1 p-4 text-lg rounded-xl border-2 ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500' 
                    : 'bg-white border-gray-200 text-gray-800 focus:border-purple-400'
                } focus:ring-0 transition-all duration-200 placeholder-gray-400`}
              />
              <button
                className={`px-6 py-4 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white rounded-xl font-bold uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 ${
                  generatingCaption ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={generateAICaption}
                disabled={generatingCaption}
              >
                {generatingCaption ? '✨ Generating...' : 'AI Magic'}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xl font-bold text-purple-400 uppercase tracking-wide">Category</label>
            <input
              type="text"
              required
              name="category"
              value={formData.category}
              onChange={handleChangeInput}
              placeholder="Enter the category"
              className={`w-full p-4 text-lg rounded-xl border-2 ${
                darkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500' 
                  : 'bg-white border-gray-200 text-gray-800 focus:border-purple-400'
              } focus:ring-0 transition-all duration-200 placeholder-gray-400`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xl font-bold text-purple-400 uppercase tracking-wide">Author</label>
            <input
              type="text"
              required
              name="author"
              value={formData.author}
              onChange={handleChangeInput}
              placeholder="Enter your name"
              className={`w-full p-4 text-lg rounded-xl border-2 ${
                darkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500' 
                  : 'bg-white border-gray-200 text-gray-800 focus:border-purple-400'
              } focus:ring-0 transition-all duration-200 placeholder-gray-400`}
            />
          </div>
          <button
            className={`mt-8 p-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-xl uppercase tracking-wide transition-all transform hover:scale-105 active:scale-95
            `}
            onClick={()=>setPreviewmeme(true)}
            
          >
            Preview
            <br/>
            <span className="text-xs">Check Preview Once before Publish</span>
          </button>
          <button
            className={`mt-8 p-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-xl uppercase tracking-wide transition-all transform hover:scale-105 active:scale-95 ${
              !file || uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? '🚀 Uploading...' : 'Publish Meme'}
          </button>
          
        </div>
      </div>
    </div>

    {previewmeme && (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-lg animate-fade-in">
        <div className="relative bg-gray-900 p-8 rounded-2xl border-2 border-purple-500 shadow-2xl max-w-2xl w-full mx-4">
          <button
            onClick={() => setPreviewmeme(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-purple-500 transition-colors"
          >
            ✕
          </button>
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Masterpiece!
            </h2>
            <img 
              src={preview} 
              alt="Meme Preview" 
              className="w-96 h-96 object-contain rounded-xl bg-gray-800 p-4 border-2 border-purple-500/30 shadow-lg" 
            />
            <div className="w-full space-y-3 text-center">
              <h3 className="text-2xl font-bold text-purple-400">{formData.title}</h3>
              <p className="text-lg text-pink-300">{formData.author}</p>
              <p className="text-lg text-pink-600">{formData.category}</p>
              <p className="text-gray-300 italic">"{formData.caption}"</p>
            </div>
            <button
              onClick={() => setPreviewmeme(false)}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default UploadPage;
