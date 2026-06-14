import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authHeaders, getToken } from '../utils/auth';

interface Contest {
  id: number;
  title: string;
  theme: string;
  start_date: string;
  end_date: string;
  status: string;
  result_date: string;
}

interface LeaderboardUser {
  id: number;
  username: string;
  avatar_url: string;
  rating: number;
  artwork_count: number;
  wins: number;
}

interface Artwork {
  id: number;
  title: string;
  image_url: string;
}

function Contest() {
  const [contest, setContest] = useState<Contest | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getToken()) {
      fetch('https://artjiya-server.onrender.com/auth/me', {
        headers: authHeaders(),
      })
        .then(res => res.json())
        .then(data => setCurrentUser(data.user));
    }

    fetch('https://artjiya-server.onrender.com/api/contests')
      .then(res => res.json())
      .then(data => {
        setContest(data.contest);
        setLeaderboard(data.leaderboard);
      });
  }, []);

  useEffect(() => {
    if (!contest || !currentUser) return;
    fetch(`https://artjiya-server.onrender.com/api/contests/my-submission/${contest.id}`, {
      headers: authHeaders(),
    })
      .then(res => res.json())
      .then(data => setSubmitted(data.submitted));

    fetch('https://artjiya-server.onrender.com/api/artworks', {
      headers: authHeaders(),
    })
      .then(res => res.json())
      .then(data => setUserArtworks(
        data.filter((a: any) => a.user_id === currentUser.id)
      ));
  }, [contest, currentUser]);

  const handleSubmit = async () => {
    if (!selectedArtwork || !contest) return;
    setSubmitting(true);
    const res = await fetch('https://artjiya-server.onrender.com/api/contests/submit', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contest_id: contest.id,
        artwork_id: selectedArtwork,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setSubmitted(true);
      setShowSubmitModal(false);
    }
    setSubmitting(false);
  };

  const getTimeLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - new Date().getTime();
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h left`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {contest ? (
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#E8439322] border border-[#E84393] text-[#E84393] text-xs px-3 py-1 rounded-full">
                Live now
              </span>
              <span className="text-[#888888] text-sm">{getTimeLeft(contest.end_date)}</span>
            </div>
            <p className="text-[#888888] text-xs tracking-widest uppercase mb-1">Theme</p>
            <h1 className="text-3xl font-bold mb-3">{contest.theme}</h1>
            <p className="text-[#888888] text-sm mb-6">{contest.title}</p>

            {currentUser ? (
              submitted ? (
                <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl px-4 py-3 inline-flex items-center gap-2">
                  <span className="text-[#E84393]">✓</span>
                  <span className="text-sm text-white">Artwork submitted</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-[#E84393] hover:bg-[#C2185B] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition"
                >
                  Submit artwork
                </button>
              )
            ) : (
              
              <a  href="https://artjiya-server.onrender.com/auth/google"
                className="bg-[#E84393] hover:bg-[#C2185B] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition"
              >
                Sign in to submit
              </a>
            )}

            <div className="mt-4 bg-[#0a0a0a] border border-[#222222] rounded-xl px-4 py-3 flex items-center gap-3">
              <span>🔒</span>
              <div>
                <p className="text-sm text-white font-medium">Submissions hidden until results</p>
                <p className="text-xs text-[#888888]">
                  Winner announced on {new Date(contest.result_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })} — then all artworks revealed
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 mb-8">
            <p className="text-[#888888] text-sm mb-4">No active contest right now. Check back soon.</p>
            <Link to="/contest/results/1" className="text-sm text-[#E84393] underline">
              View last contest results →
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All-time ratings</h2>
          <span className="text-[#888888] text-xs">Updated after each contest</span>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden mb-4">
          <div className="grid grid-cols-[40px_1fr_70px_60px_80px] px-4 py-3 border-b border-[#222222]">
            <span className="text-[#888888] text-xs">#</span>
            <span className="text-[#888888] text-xs">Artist</span>
            <span className="text-[#888888] text-xs text-right">Artworks</span>
            <span className="text-[#888888] text-xs text-right">Wins</span>
            <span className="text-[#888888] text-xs text-right">Rating</span>
          </div>

          {leaderboard.length === 0 ? (
            <p className="text-[#888888] text-sm text-center py-8">No ratings yet.</p>
          ) : (
            leaderboard.map((user, index) => (
              <div
                key={user.id}
                className={`grid grid-cols-[40px_1fr_70px_60px_80px] items-center px-4 py-3 border-b border-[#222222] last:border-0 ${index === 0 ? 'bg-[#E8439308]' : ''}`}
              >
                <span className={`text-sm font-bold ${index === 0 ? 'text-[#E84393]' : 'text-[#888888]'}`}>
                  {index + 1}
                </span>
                <Link to={`/profile/${user.id}`} className="flex items-center gap-2">
                  <img src={user.avatar_url} className="w-7 h-7 rounded-full" />
                  <span className="text-sm text-white">{user.username}</span>
                  {index === 0 && (
                    <span className="bg-[#E8439322] border border-[#E84393] text-[#E84393] text-xs px-2 py-0.5 rounded-full">
                      Champion
                    </span>
                  )}
                </Link>
                <span className="text-[#888888] text-sm text-right">{user.artwork_count}</span>
                <span className="text-[#888888] text-sm text-right">{user.wins}</span>
                <span className={`text-sm font-bold text-right ${index === 0 ? 'text-[#E84393]' : 'text-white'}`}>
                  {user.rating}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-xl px-4 py-3">
          <p className="text-[#888888] text-xs mb-2">How ratings are calculated</p>
          <div className="flex flex-wrap gap-4">
            {[
              ['Upload', '+10'],
              ['Like received', '+5'],
              ['Follower', '+8'],
              ['Contest entry', '+15'],
              ['Contest win', '+50'],
            ].map(([label, points]) => (
              <span key={label} className="text-[#888888] text-xs">
                {label} <span className="text-[#E84393]">{points}</span>
              </span>
            ))}
          </div>
        </div>

        {showSubmitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-6">
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Choose artwork to submit</h3>
              {userArtworks.length === 0 ? (
                <p className="text-[#888888] text-sm mb-4">
                  No artworks yet. <Link to="/dashboard" className="text-[#E84393]">Upload one first.</Link>
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-4 max-h-64 overflow-y-auto">
                  {userArtworks.map(art => (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArtwork(art.id)}
                      className={`rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                        selectedArtwork === art.id ? 'border-[#E84393]' : 'border-transparent'
                      }`}
                    >
                      <img src={art.image_url} className="w-full aspect-square object-cover" />
                      <p className="text-xs text-white p-2">{art.title}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 border border-[#222222] text-[#888888] py-2 rounded-full text-sm transition hover:border-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedArtwork || submitting}
                  className="flex-1 bg-[#E84393] hover:bg-[#C2185B] text-white py-2 rounded-full text-sm font-semibold transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contest;