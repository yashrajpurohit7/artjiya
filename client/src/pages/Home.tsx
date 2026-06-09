import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-32">
        <span className="text-[#E84393] text-sm font-medium tracking-widest uppercase mb-4">
          For Artists, By Artists
        </span>
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Where Art Meets<br />
          <span className="text-[#E84393]">Community</span>
        </h1>
        <p className="text-[#888888] text-lg max-w-xl mb-10">
          Showcase your artwork, compete in weekly contests, and connect with a global community of artists.
        </p>
        <div className="flex gap-4">
          
          <a  href="http://localhost:5000/auth/google"
            className="bg-[#E84393] hover:bg-[#C2185B] text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Join ARTJIYA
          </a>
          <Link
            to="/gallery"
            className="border border-[#222222] hover:border-[#E84393] text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Explore Gallery
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="text-white font-semibold text-lg mb-2">Upload Artwork</h3>
          <p className="text-[#888888] text-sm">Share your creations with a community that appreciates art.</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
          <div className="text-3xl mb-4">🏆</div>
          <h3 className="text-white font-semibold text-lg mb-2">Weekly Contests</h3>
          <p className="text-[#888888] text-sm">Compete in themed contests and get your work recognised.</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
          <div className="text-3xl mb-4">🌍</div>
          <h3 className="text-white font-semibold text-lg mb-2">Build Community</h3>
          <p className="text-[#888888] text-sm">Follow artists, like artwork and grow your audience.</p>
        </div>
      </div>

    </div>
  );
}

export default Home;