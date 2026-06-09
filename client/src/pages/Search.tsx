import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  avatar_url: string;
}

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`https://artjiya-server.onrender.com/api/search?q=${query}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Search Results</h1>
      <p className="text-[#888888] mb-8">for "{query}"</p>

      {loading && <p className="text-[#888888]">Searching...</p>}

      {!loading && results.length === 0 && query && (
        <p className="text-[#888888]">No artists found for "{query}"</p>
      )}

      <div className="flex flex-col gap-4 max-w-xl">
        {results.map(user => (
          <Link
            key={user.id}
            to={`/profile/${user.id}`}
            className="flex items-center gap-4 bg-[#111111] border border-[#222222] rounded-xl p-4 hover:border-[#E84393] transition"
          >
            <img src={user.avatar_url} className="w-12 h-12 rounded-full" />
            <span className="font-semibold">{user.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Search;