import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MemeDetailsPage from './pages/MemeDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import 'react-toastify/dist/ReactToastify.css';
import MemeUploader from './pages/MemeUploadPage';
import UploadPage from './pages/Profile';
import LeaderboardPage from './pages/Leaderboard';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/meme/:id" element={<MemeDetailsPage />} />
            <Route path="/upload" element={<MemeUploader/>}/>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/profile" element={<UploadPage/>}/>
            <Route path="/leaderboard" element={<LeaderboardPage/>}/>
          </Routes>
        </Layout>
        <ToastContainer position="bottom-right" theme="colored" />
      </Router>
    </Provider>
  );
}

export default App;