# MemeVerse

## Overview
MemeVerse is a multi-page, highly interactive website where users can explore, upload, and interact with memes. This project demonstrates frontend development skills, including UI/UX, animations, state management, performance optimization, API handling, and advanced React techniques.

## 🚀 Live Demo
[Click here to view the live demo](#)(https://memeversewebsite.netlify.app/)

---

## 🎯 Features & Functionalities

### 🔥 Homepage (Landing Page)
- Display trending memes dynamically (Fetched from an API).
- Interactive animations & transitions.
- Dark mode toggle.

### 🖼 Meme Explorer Page
- Infinite scrolling or pagination.
- Meme categories filter (Trending, New, Classic, Random).
- Search functionality with debounced API calls.
- Sort memes by likes, date, or comments.

### 📤 Meme Upload Page
- Upload memes (image/gif format).
- Add funny captions using a text editor.
- Option to generate AI-based meme captions.
- Preview before uploading.

### 📌 Meme Details Page
- Dynamic routing (/meme/:id).
- Display meme details, likes, comments, and sharing options.
- Comment system (Local storage for now).
- Like buttons with animation and local storage persistence.

### 👤 User Profile Page
- Shows user-uploaded memes.
- Edit profile info (Name, Bio, Profile Picture).
- View liked memes (saved in local storage or API).

### 🏆 Leaderboard Page
- Top 10 most liked memes.
- User rankings based on engagement.

### 🎭 404 Page (Easter Egg)
- A fun, meme-based 404 error page for non-existent routes.

---

## 💻 Tech Stack
- **Frontend:** Next.js/React (Pages & App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion / GSAP
- **State Management:** Redux Toolkit / Context API
- **Caching:** Local Storage / IndexedDB
- **API Handling:** Meme APIs (for fetching memes)
- **Image Uploads:** Cloudinary / Firebase
- **Performance Optimization:** Lighthouse / React Profiler

---

## 🔗 Free APIs Used
### Meme APIs
- [Imgflip API](https://api.imgflip.com/) - Generate and fetch popular memes
- [Meme Generator API](https://meme-api.com/) - Create memes dynamically

### Image Upload & Storage APIs
- [ImgBB API](https://api.imgbb.com/) - Free image hosting for meme uploads

---



---

## 📂 Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/memeverse.git
   cd memeverse
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create an `.env` file and configure API keys (if needed).
4. Start the development server:
   ```sh
   npm run dev
   ```

---

## 🚀 Deployment
The app is deployed on **Netlify**. To update:
1. Push changes to GitHub.
2. Netlify will automatically deploy the latest version.

For manual deployment:
```sh
npm run build
```

---

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.

---

💡 **Enjoy Memeverse & Spread the Laughter!** 😆

