import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authHeaders, getToken } from '../utils/auth';

interface User {
  id: number;
  username: string;
  avatar_url: string;
  bio: string;
  rating: number;
  created_at: string;
}

interface Artwork {
  id: number;
  title: string;
  image_url: string;
}

function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);

  useEffect(() => {
    if (getToken()) {
      fetch('https://artjiya-server.onrender.com/auth/me', {
        headers: authHeaders(),
      })
        .then(res => res.json())
        .then(data => setCurrentUser(data.user));
    }

    fetch(`https://artjiya-server.onrender.com/api/profile/${id}`, {
      headers: authHeaders(),
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data.user);
        setArtworks(data.artworks);
        setFollowerCount(data.followerCount);
        setFollowing(data.isFollowing);
        setEditUsername(data.user.username);
        setEditBio(data.user.bio || '');
      });

    fetch(`https://artjiya-server.onrender.com/api/profile/${id}/following`)
      .then(res => res.json())
      .then(data => setFollowingCount(data.length));
  }, [id]);

  const toggleFollow = async () => {
    if (!currentUser) return alert('Please sign in to follow artists');
    const method = following ? 'DELETE' : 'POST';
    await fetch(`https://artjiya-server.onrender.com/api/follows/${id}`, {
      method,
      headers: authHeaders(),
    });
    setFollowing(!following);
    setFollowerCount(prev => following ? prev - 1 : prev + 1);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('https://artjiya-server.onrender.com/api/profile/edit', {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: editUsername, bio: editBio }),
    });
    const data = await res.json();
    if (data.id) {
      setProfile(prev => prev ? { ...prev, username: data.username, bio: data.bio } : prev);
      setEditing(false);
    }
    setSaving(false);
  };

  if (!profile) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[#888888]">Loading...</p>
    </div>
  );

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-6 mb-10">
          <img
            src={profile.avatar_url}
            className="w-20 h-20 rounded-full border-2 border-[#E84393] shrink-0"
          />
          <div className="flex-1">
            {editing ? (
              <div className="mb-3">
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  className="bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 text-white text-lg font-bold w-full mb-2 focus:outline-none focus:border-[#E84393]"
                  placeholder="Username"
                />
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-[#E84393] resize-none"
                  placeholder="Write something about yourself..."
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#E84393] hover:bg-[#C2185B] text-white px-4 py-1.5 rounded-full text-sm font-semibold transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="border border-[#222222] text-[#888888] px-4 py-1.5 rounded-full text-sm transition hover:border-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-1">{profile.username}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-[#E8439322] border border-[#E84393] text-[#E84393] px-2 py-0.5 rounded-full">
                    ⭐ {profile.rating} pts
                  </span>
                </div>
                {profile.bio && (
                  <p className="text-[#888888] text-sm mb-2">{profile.bio}</p>
                )}
                <div className="flex gap-4 mb-3">
                  <button
                    onClick={() => {
                      fetch(`https://artjiya-server.onrender.com/api/profile/${id}/followers`)
                        .then(res => res.json())
                        .then(data => setFollowersList(data));
                      setShowFollowers(true);
                    }}
                    className="text-sm text-[#888888] hover:text-white transition"
                  >
                    <span className="text-white font-semibold">{followerCount}</span> followers
                  </button>
                  <button
                    onClick={() => {
                      fetch(`https://artjiya-server.onrender.com/api/profile/${id}/following`)
                        .then(res => res.json())
                        .then(data => setFollowingList(data));
                      setShowFollowing(true);
                    }}
                    className="text-sm text-[#888888] hover:text-white transition"
                  >
                    <span className="text-white font-semibold">{followingCount}</span> following
                  </button>
                </div>
                {isOwnProfile ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="border border-[#222222] text-[#888888] hover:border-[#E84393] hover:text-[#E84393] px-5 py-1.5 rounded-full text-sm transition"
                  >
                    Edit profile
                  </button>
                ) : (
                  currentUser && (
                    <button
                      onClick={toggleFollow}
                      className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition ${
                        following
                          ? 'border-[#E84393] text-[#E84393] hover:bg-[#E84393] hover:text-white'
                          : 'bg-[#E84393] text-white hover:bg-[#C2185B] border-[#E84393]'
                      }`}
                    >
                      {following ? 'Following' : 'Follow'}
                    </button>
                  )
                )}
              </>
            )}
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Artworks</h2>
        {artworks.length === 0 ? (
          <p className="text-[#888888]">No artworks uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {artworks.map(art => (
              <div key={art.id} className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
                <img
                  src={art.image_url}
                  alt={art.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3 flex items-center justify-between">
                  <p className="text-sm text-white">{art.title}</p>
                  {isOwnProfile && (
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this artwork?')) return;
                        await fetch(`https://artjiya-server.onrender.com/api/artworks/${art.id}`, {
                          method: 'DELETE',
                          headers: authHeaders(),
                        });
                        setArtworks(prev => prev.filter(a => a.id !== art.id));
                      }}
                      className="text-[#888888] hover:text-red-500 text-xs transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFollowers && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-6">
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Followers</h3>
              <button onClick={() => setShowFollowers(false)} className="text-[#888888] hover:text-white">✕</button>
            </div>
            {followersList.length === 0 ? (
              <p className="text-[#888888] text-sm">No followers yet.</p>
            ) : (
              followersList.map(user => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  onClick={() => setShowFollowers(false)}
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

      {showFollowing && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-6">
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Following</h3>
              <button onClick={() => setShowFollowing(false)} className="text-[#888888] hover:text-white">✕</button>
            </div>
            {followingList.length === 0 ? (
              <p className="text-[#888888] text-sm">Not following anyone yet.</p>
            ) : (
              followingList.map(user => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  onClick={() => setShowFollowing(false)}
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

export default Profile;