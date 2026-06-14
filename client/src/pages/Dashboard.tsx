import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authHeaders } from '../utils/auth';

interface User {
  id: number;
  username: string;
  avatar_url: string;
  rating: number;
}

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://artjiya-server.onrender.com/auth/me', {
      headers: authHeaders(),
    })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) return setError('Please add a title and select an image');
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);

    try {
      const res = await fetch('https://artjiya-server.onrender.com/api/artworks', {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (data.id) {
        navigate('/gallery');
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[#888888]">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <img src={user.avatar_url} className="w-12 h-12 rounded-full border-2 border-[#E84393]" />
          <div>
            <h1 className="text-xl font-bold">{user.username}</h1>
            <span className="text-xs bg-[#E8439322] border border-[#E84393] text-[#E84393] px-2 py-0.5 rounded-full">
              ⭐ {user.rating} pts
            </span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6">Upload Artwork</h2>

          <div
            onClick={() => document.getElementById('fileInput')?.click()}
            className={`w-full aspect-video rounded-xl border-2 border-dashed mb-6 flex items-center justify-center cursor-pointer transition overflow-hidden ${
              preview ? 'border-[#E84393]' : 'border-[#222222] hover:border-[#E84393]'
            }`}
          >
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <p className="text-4xl mb-2">🖼️</p>
                <p className="text-[#888888] text-sm">Click to select image</p>
                <p className="text-[#888888] text-xs mt-1">JPEG, PNG or WebP — max 5MB</p>
              </div>
            )}
          </div>

          <input
            id="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <input
            type="text"
            placeholder="Artwork title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:border-[#E84393] transition mb-4"
          />

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-[#E84393] hover:bg-[#C2185B] text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Artwork'}
          </button>

          <p className="text-[#888888] text-xs text-center mt-3">
            Uploading earns you +10 rating points
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;