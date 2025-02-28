import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME; 
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET; 

export const uploadMeme = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url; // Cloudinary returns the image URL
  } catch (error) {
    console.error("Error uploading meme:", error);
    throw error;
  }
};
