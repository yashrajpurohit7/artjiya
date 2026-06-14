import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, authHeaders } from '../utils/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }
    fetch('https://artjiya-server.onrender.com/auth/me', {
      headers: authHeaders(),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          navigate('/');
        } else {
          setUser(data.user);
        }
      });
  }, []);

  if (user === undefined) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[#888888]">Loading...</p>
    </div>
  );

  return <>{children}</>;
}

export default ProtectedRoute;