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
  const [showLikedBy, setShowLikedBy] = useState<number | null>(null);
  const [likedByList, setLikedByList] = useState<any[]>([]);

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

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => toggleLike(art.id)}
                    className="flex items-center gap-1.5 text-sm transition"
                  >
                    <span className={art.liked_by_me ? 'text-[#E84393]' : 'text-[#888888] hover:text-[#E84393]'}>
                      {art.liked_by_me ? '♥' : '♡'}
                    </span>
                    <span className={art.liked_by_me ? 'text-[#E84393]' : 'text-[#888888]'}>
                      {art.like_count} {art.like_count === 1 ? 'like' : 'likes'}
                    </span>
                  </button>
                  {art.like_count > 0 && (
                    <button
                      onClick={() => {
                        fetch(`https://artjiya-server.onrender.com/api/likes/${art.id}`)
                          .then(res => res.json())
                          .then(data => {
                            setLikedByList(data);
                            setShowLikedBy(art.id);
                          });
                      }}
                      className="text-xs text-[#888888] hover:text-white transition"
                    >
                      See who liked
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Liked by modal */}
      {showLikedBy && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-6">
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Liked by</h3>
              <button onClick={() => setShowLikedBy(null)} className="text-[#888888] hover:text-white">✕</button>
            </div>
            {likedByList.length === 0 ? (
              <p className="text-[#888888] text-sm">No likes yet.</p>
            ) : (
              likedByList.map(user => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  onClick={() => setShowLikedBy(null)}
                  className="flex items-center gap-3 py-2 hover:opacity-80 transition"
                >
                  <img src={user.avatar_url} className="w-8 h-8 rounded-full" />
                  <span className="text-sm text-white">{user.username}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;