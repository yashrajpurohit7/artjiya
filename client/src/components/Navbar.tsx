import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  avatar_url: string;
}

function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:5000/auth/logout', { credentials: 'include' })
      .then(() => {
        setUser(null);
        navigate('/');
      });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/search?q=${search.trim()}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b border-[#222222] h-14 flex items-center px-6 gap-6">
      <Link to="/" className="text-[#E84393] font-bold text-xl tracking-tight shrink-0">
        ARTJIYA
      </Link>

      <div className="flex items-center gap-1">
        <Link to="/contest" className="text-sm text-white px-3 py-1.5 rounded hover:bg-[#222222] transition">
          Contest
        </Link>
        <Link to="/gallery" className="text-sm text-white px-3 py-1.5 rounded hover:bg-[#222222] transition">
          Gallery
        </Link>
        <span className="text-sm text-[#888888] px-3 py-1.5 rounded cursor-not-allowed">
          Courses
        </span>
        <span className="text-sm text-[#888888] px-3 py-1.5 rounded cursor-not-allowed">
          Community
        </span>
      </div>

      <div className="flex-1 max-w-xs">
        <input
          type="text"
          placeholder="Search artists..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full bg-[#0a0a0a] border border-[#222222] rounded-full px-4 py-1.5 text-sm text-white placeholder-[#888888] focus:outline-none focus:border-[#E84393] transition"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-sm bg-[#E84393] hover:bg-[#C2185B] text-white px-4 py-1.5 rounded-full transition"
            >
              Upload
            </Link>
            <div className="relative group">
              <img
                src={user.avatar_url}
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent group-hover:border-[#E84393] transition"
              />
              <div className="absolute right-0 top-10 bg-[#111111] border border-[#222222] rounded-lg p-2 w-40 hidden group-hover:block">
                <Link
                  to={`/profile/${user.id}`}
                  className="block text-sm text-white px-3 py-2 hover:bg-[#222222] rounded transition"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-[#888888] px-3 py-2 hover:bg-[#222222] rounded transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          
            <a href="http://localhost:5000/auth/google"
            className="text-sm bg-[#E84393] hover:bg-[#C2185B] text-white px-4 py-1.5 rounded-full transition"
          >
            Sign in
          </a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;