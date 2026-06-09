import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Artwork {
  id: number;
  title: string;
  image_url: string;
  username: string;
  user_id: number;
  avatar_url: string;
  like_count: number;
  liked_by_me: boolean;
}

function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [follows, setFollows] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch('https://artjiya-server.onrender.com/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCurrentUser(data.user));

    fetch('https://artjiya-server.onrender.com/api/artworks', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setArtworks(data));
  }, []);

  const toggleLike = async (artworkId: number) => {
    if (!currentUser) return alert('Please sign in to like artwork');
    const artwork = artworks.find(a => a.id === artworkId);
    if (!artwork) return;
    const liked = artwork.liked_by_me;
    const method = liked ? 'DELETE' : 'POST';

    await fetch(`https://artjiya-server.onrender.com/api/likes/${artworkId}`, {
      method,
      credentials: 'include',
    });

    setArtworks(prev => prev.map(a =>
      a.id === artworkId
        ? { ...a, liked_by_me: !liked, like_count: liked ? a.like_count - 1 : a.like_count + 1 }
        : a
    ));
  };

  const toggleFollow = async (userId: number) => {
    if (!currentUser) return alert('Please sign in to follow artists');
    const following = follows[userId];
    const method = following ? 'DELETE' : 'POST';
    await fetch(`https://artjiya-server.onrender.com/api/follows/${userId}`, {
      method,
      credentials: 'include',
    });
    setFollows(prev => ({ ...prev, [userId]: !following }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Gallery</h1>

      {artworks.length === 0 ? (
        <p className="text-[#888888]">No artworks yet. Be the first to upload.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artworks.map(art => (
            <div key={art.id} className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden">
              <img
                src={art.image_url}
                alt={art.title}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <p className="text-white font-semibold mb-3">{art.title}</p>

                <div className="flex items-center justify-between">
                  <Link to={`/profile/${art.user_id}`} className="flex items-center gap-2 group">
                    <img
                      src={art.avatar_url}
                      className="w-7 h-7 rounded-full border border-[#222222] group-hover:border-[#E84393] transition"
                    />
                    <span className="text-sm text-[#888888] group-hover:text-[#E84393] transition">
                      {art.username}
                    </span>
                  </Link>

                  {currentUser && currentUser.id !== art.user_id && (
                    <button
                      onClick={() => toggleFollow(art.user_id)}
                      className={`text-xs px-3 py-1 rounded-full border transition ${
                        follows[art.user_id]
                          ? 'border-[#E84393] text-[#E84393]'
                          : 'border-[#222222] text-[#888888] hover:border-[#E84393] hover:text-[#E84393]'
                      }`}
                    >
                      {follows[art.user_id] ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => toggleLike(art.id)}
                  className="mt-3 flex items-center gap-1.5 text-sm transition"
                >
                  <span className={art.liked_by_me ? 'text-[#E84393]' : 'text-[#888888] hover:text-[#E84393]'}>
                    {art.liked_by_me ? '♥' : '♡'}
                  </span>
                  <span className={art.liked_by_me ? 'text-[#E84393]' : 'text-[#888888]'}>
                    {art.like_count} {art.like_count === 1 ? 'like' : 'likes'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;