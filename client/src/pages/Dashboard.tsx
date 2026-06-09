import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  avatar_url: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(err => console.error(err));
  }, []);

  const handleUpload = async () => {
    if (!file || !title) return setMessage('Please add a title and image');

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);

    try {
      const res = await fetch('http://localhost:5000/api/artworks', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (data.id) {
  navigate('/gallery');
}
        else {
        setMessage('Upload failed');
      }
    } catch (err) {
      setMessage('Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Please <a href="/" className="underline">sign in</a> first.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center gap-4 mb-8">
        <img src={user.avatar_url} className="w-10 h-10 rounded-full" />
        <h1 className="text-2xl font-bold">Welcome, {user.username}</h1>
      </div>

      <div className="max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload Artwork</h2>
        <input
          type="text"
          placeholder="Artwork title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded p-3 mb-4 text-white"
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="w-full mb-4 text-gray-400"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="mt-4 text-green-400">{message}</p>}
      </div>

      <a href="/gallery" className="block mt-8 text-gray-400 underline">View Gallery</a>
    </div>
  );
}

export default Dashboard;  