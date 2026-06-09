import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/auth/me', { credentials: 'include' })
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