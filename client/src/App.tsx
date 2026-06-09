import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Contest from './pages/Contest';
import ContestResults from './pages/ContestResults';
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-14 bg-[#0a0a0a] min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={
            <ProtectedRoute><Gallery /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/profile/:id" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/search" element={<Search />} />
          <Route path="/contest" element={<Contest />} />
          <Route path="/contest/results/:contestId" element={<ContestResults />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;