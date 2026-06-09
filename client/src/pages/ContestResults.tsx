import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Submission {
  id: number;
  username: string;
  avatar_url: string;
  user_id: number;
  title: string;
  image_url: string;
  like_count: number;
}

interface Contest {
  id: number;
  title: string;
  theme: string;
  end_date: string;
}

function ContestResults() {
  const { contestId } = useParams();
  const [contest, setContest] = useState<Contest | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/contests/results/${contestId}`)
      .then(res => res.json())
      .then(data => {
        setRevealed(data.revealed);
        if (data.revealed) {
          setContest(data.contest);
          setSubmissions(data.submissions);
        }
        setLoading(false);
      });
  }, [contestId]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[#888888]">Loading...</p>
    </div>
  );

  if (!revealed) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white px-6">
      <span className="text-5xl mb-4">🔒</span>
      <h1 className="text-2xl font-bold mb-2">Results not revealed yet</h1>
      <p className="text-[#888888] text-center">The contest is still active or results haven't been announced.</p>
      <Link to="/contest" className="mt-6 text-[#E84393] underline text-sm">Back to Contest</Link>
    </div>
  );

  const winner = submissions[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#888888] text-xs tracking-widest uppercase mb-2">Contest Results</p>
          <h1 className="text-3xl font-bold mb-1">{contest?.theme}</h1>
          <p className="text-[#888888] text-sm">{contest?.title}</p>
        </div>

        {/* Winner */}
        {winner && (
          <div className="bg-[#111111] border border-[#E84393] rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏆</span>
              <span className="text-[#E84393] font-semibold">Winner</span>
            </div>
            <img
              src={winner.image_url}
              alt={winner.title}
              className="w-full max-h-80 object-cover rounded-xl mb-4"
            />
            <p className="text-white font-semibold text-lg mb-2">{winner.title}</p>
            <div className="flex items-center justify-between">
              <Link to={`/profile/${winner.user_id}`} className="flex items-center gap-2">
                <img src={winner.avatar_url} className="w-8 h-8 rounded-full" />
                <span className="text-[#888888] hover:text-[#E84393] transition">{winner.username}</span>
              </Link>
              <span className="text-[#E84393]">♥ {winner.like_count}</span>
            </div>
          </div>
        )}

        {/* All submissions */}
        <h2 className="text-lg font-semibold mb-4">All submissions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {submissions.map((sub, index) => (
            <div key={sub.id} className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
              <img
                src={sub.image_url}
                alt={sub.title}
                className="w-full aspect-square object-cover"
              />
              <div className="p-3">
                <p className="text-white text-sm font-medium mb-2">{sub.title}</p>
                <div className="flex items-center justify-between">
                  <Link to={`/profile/${sub.user_id}`} className="flex items-center gap-1.5">
                    <img src={sub.avatar_url} className="w-5 h-5 rounded-full" />
                    <span className="text-[#888888] text-xs">{sub.username}</span>
                  </Link>
                  <span className="text-[#888888] text-xs">♥ {sub.like_count}</span>
                </div>
                {index === 0 && (
                  <span className="mt-2 inline-block bg-[#E8439322] border border-[#E84393] text-[#E84393] text-xs px-2 py-0.5 rounded-full">
                    🏆 Winner
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Link to="/contest" className="block mt-8 text-center text-[#888888] hover:text-white transition text-sm">
          ← Back to Contest
        </Link>
      </div>
    </div>
  );
}

export default ContestResults;