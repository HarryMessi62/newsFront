import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CryptoTicker from './components/CryptoTicker';
import Footer from './components/Footer';
import Home from './pages/Home';
import Articles from './pages/Articles';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contacts from './pages/Contacts';
import ArticleDetail from './pages/ArticleDetail';
import ViewingStats from './pages/ViewingStats';
import TestPage from './pages/TestPage';
import LikeTest from './pages/LikeTest';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <CryptoTicker />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/stats" element={<ViewingStats />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/like-test" element={<LikeTest />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
